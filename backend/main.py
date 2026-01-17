from fastapi import FastAPI, HTTPException, status, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
import shutil
from typing import List, Optional

from database import SessionLocal, engine, Base
import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Backend server is ready at http://127.0.0.1:8000")

# UPLOAD_DIR logic removed as files are stored in DB

# Pydantic Models
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    email: str
    role: str
    
    class Config:
        orm_mode = True

# Helper Functions
# Use pbkdf2_sha256 which is pure python and robust on Windows
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Auth Endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserRegister, db: Session = Depends(get_db)):
    print(f"Attempting to register user: {user.email}") # Debug log
    try:
        # Check if user exists
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user.password)
        
        # Create new user
        new_user = models.User(
            name=user.name,
            email=user.email,
            password_hash=hashed_password,
            role=user.role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"User registered successfully: {new_user.id}")
        return new_user
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        # If it's already an HTTPException, re-raise it
        if isinstance(e, HTTPException):
            raise e
        # Otherwise, 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Registration failed: {str(e)}"
        )

@app.post("/auth/login", response_model=UserResponse)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find user
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    # Verify
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    return db_user

# File Endpoints
from fastapi.responses import StreamingResponse
import io
from fastapi import Form

# Request Models
class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[int] = None

# File/Folder Endpoints

@app.get("/files/list")
async def list_files(parent_id: Optional[int] = None, db: Session = Depends(get_db)):
    # Query items with specific parent_id (Folder browsing)
    items_db = db.query(
        models.DBFile.id,
        models.DBFile.filename, 
        models.DBFile.size, 
        models.DBFile.content_type,
        models.DBFile.is_folder,
        models.DBFile.parent_id
    ).filter(models.DBFile.parent_id == parent_id).all()
    
    item_list = []
    for f in items_db:
        if f.is_folder:
            size_str = "-"
            type_str = "folder"
        else:
            size = f.size
            if size < 1024:
                size_str = f"{size} B"
            elif size < 1024 * 1024:
                size_str = f"{size / 1024:.1f} KB"
            else:
                size_str = f"{size / (1024 * 1024):.1f} MB"
            type_str = f.content_type

        item_list.append({
            "id": f.id,
            "name": f.filename,
            "size": size_str,
            "type": type_str,
            "is_folder": f.is_folder,
            "parent_id": f.parent_id
        })
    return item_list

@app.post("/folders/create")
async def create_folder(folder: FolderCreate, db: Session = Depends(get_db)):
    new_folder = models.DBFile(
        filename=folder.name,
        content_type="application/x-directory",
        size=0,
        data=b"",
        is_folder=True,
        parent_id=folder.parent_id
    )
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    return {"id": new_folder.id, "name": new_folder.filename, "is_folder": True}

@app.post("/files/upload")
async def upload_file(
    file: UploadFile = File(...), 
    parent_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    request_object_content = await file.read()
    
    # Check if exists in this specific folder
    existing_file = db.query(models.DBFile).filter(
        models.DBFile.filename == file.filename,
        models.DBFile.parent_id == parent_id
    ).first()
    
    if existing_file:
         db.delete(existing_file)
         db.commit()
         
    new_file = models.DBFile(
        filename=file.filename,
        content_type=file.content_type,
        size=len(request_object_content),
        data=request_object_content,
        parent_id=parent_id,
        is_folder=False
    )
    db.add(new_file)
    db.commit()
    
    return {"filename": file.filename}

@app.delete("/files/delete/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    # Recursive delete function
    def delete_recursive(id):
        children = db.query(models.DBFile).filter(models.DBFile.parent_id == id).all()
        for child in children:
            delete_recursive(child.id)
        
        item = db.query(models.DBFile).filter(models.DBFile.id == id).first()
        if item:
            db.delete(item)

    item = db.query(models.DBFile).filter(models.DBFile.id == item_id).first()
    if item:
        # If it's a folder, delete children content first
        if item.is_folder:
            delete_recursive(item.id)
        else:
            db.delete(item)
            
        db.commit()
        return {"message": "Item deleted"}
    raise HTTPException(status_code=404, detail="Item not found")

@app.get("/files/download/{item_id}")
async def download_file(item_id: int, db: Session = Depends(get_db)):
    db_file = db.query(models.DBFile).filter(models.DBFile.id == item_id).first()
    if db_file and not db_file.is_folder:
        return StreamingResponse(
            io.BytesIO(db_file.data), 
            media_type=db_file.content_type,
            headers={"Content-Disposition": f"attachment; filename={db_file.filename}"}
        )
    raise HTTPException(status_code=404, detail="File not found or is a folder")

if __name__ == "__main__":
    import uvicorn
    print("Starting backend...")
    uvicorn.run(app, host="127.0.0.1", port=8000)