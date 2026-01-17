from sqlalchemy import Column, Integer, String, LargeBinary, Boolean, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)

class DBFile(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    content_type = Column(String)
    size = Column(Integer)
    data = Column(LargeBinary)
    
    # New columns for folder structure
    is_folder = Column(Boolean, default=False)
    parent_id = Column(Integer, ForeignKey('files.id'), nullable=True)

