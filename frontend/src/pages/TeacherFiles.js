import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';

function TeacherFiles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null); // null = root
  const [folderHistory, setFolderHistory] = useState([]); // Array of {id, name}

  const fetchFiles = async (folderId = currentFolder?.id) => {
    try {
      setLoading(true);
      const params = folderId ? { parent_id: folderId } : {};
      const response = await axios.get(`${API}/files/list`, { params });
      setItems(response.data);
    } catch (error) {
      toast.error("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  /* New states for inline creation */
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const confirmCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await axios.post(`${API}/folders/create`, {
        name: newFolderName,
        parent_id: currentFolder?.id || null
      });
      toast.success("Folder created!");
      setIsCreatingFolder(false);
      setNewFolderName('');
      fetchFiles();
    } catch (error) {
      toast.error("Failed to create folder.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolder) {
        formData.append('parent_id', currentFolder.id);
      }

      try {
        await axios.post(`${API}/files/upload`, formData);
        toast.success(`File "${file.name}" uploaded.`);
        fetchFiles();
      } catch (error) {
        toast.error(error.response?.data?.detail || 'File upload failed.');
      }
      event.target.value = null; // Reset input
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete "${item.name}"? ${item.is_folder ? '(and all contents)' : ''}`)) {
      try {
        await axios.delete(`${API}/files/delete/${item.id}`);
        toast.info("Item deleted.");
        fetchFiles();
      } catch (error) {
        toast.error('Failed to delete.');
      }
    }
  };

  const openFolder = (folder) => {
    setFolderHistory([...folderHistory, folder]);
    setCurrentFolder(folder);
  };

  const goBack = () => {
    const newHistory = [...folderHistory];
    newHistory.pop(); // Remove current
    const prevFolder = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
    setFolderHistory(newHistory);
    setCurrentFolder(prevFolder);
  };

  const navigateToBreadcrumb = (index) => {
    if (index === -1) {
      // Root
      setFolderHistory([]);
      setCurrentFolder(null);
    } else {
      const newHistory = folderHistory.slice(0, index + 1);
      setFolderHistory(newHistory);
      setCurrentFolder(newHistory[index]);
    }
  };

  const handleDownload = async (item) => {
    try {
      const response = await axios.get(`${API}/files/download/${item.id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Download failed.");
    }
  };

  const FileIcon = ({ type, isFolder }) => {
    const iconClass = "w-8 h-8 mr-4 flex-shrink-0";
    if (isFolder) {
      return <svg className={`${iconClass} text-amber-400`} fill="currentColor" viewBox="0 0 24 24"><path d="M7 3C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21H17C18.6569 21 20 19.6569 20 18V9C20 7.34315 18.6569 6 17 6H11L9 4H7Z" /></svg>;
    }
    if (type === 'pdf') {
      return <svg className={`${iconClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    }
    return <svg className={`${iconClass} text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0b] via-[#111113] to-[#0a0a0b] text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 flex justify-between items-center">
          {/* Nav Back */}
          <Link to="/teacher-dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              {currentFolder && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                  title="Go Back"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
              )}
              <h1 className="text-3xl font-bold">File Manager</h1>
            </div>
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm text-gray-400 font-mono">
              <button
                onClick={() => navigateToBreadcrumb(-1)}
                className={`hover:text-cyan-400 ${!currentFolder ? 'text-cyan-400 font-bold' : ''}`}
              >
                Home
              </button>
              {folderHistory.map((folder, idx) => (
                <React.Fragment key={folder.id}>
                  <span>/</span>
                  <button
                    onClick={() => navigateToBreadcrumb(idx)}
                    className={`hover:text-cyan-400 ${idx === folderHistory.length - 1 ? 'text-cyan-400 font-bold' : ''}`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {isCreatingFolder ? (
              <form onSubmit={confirmCreateFolder} className="flex gap-2 animate-fade-in">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder Name"
                  className="px-3 py-2 bg-black/40 border border-cyan-500/50 rounded-lg text-sm focus:outline-none focus:border-cyan-500 text-white w-40"
                  autoFocus
                />
                <button type="submit" className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
                <button type="button" onClick={() => setIsCreatingFolder(false)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center border border-white/10"
              >
                <svg className="w-5 h-5 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7h-9L9 5H4C2.9 5 2 5.9 2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 10H4V7h16v10z" /></svg>
                New Folder
              </button>
            )}

            <label className="cursor-pointer px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload File
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.jpg,.png" />
            </label>
          </div>
        </div>

        {/* File Grid */}
        <div className="bg-[#18181b] border border-white/10 rounded-xl min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" /></svg>
              <p>Folder is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {/* Back Button if in folder */}
              {currentFolder && (
                <div
                  onClick={goBack}
                  className="group p-4 bg-white/5 border border-white/5 hover:border-white/20 rounded-lg cursor-pointer transition flex items-center justify-center opacity-60 hover:opacity-100"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" transform="rotate(-90 12 12)" /></svg>
                  <span className="font-medium">Up One Level</span>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => item.is_folder ? openFolder(item) : handleDownload(item)}
                  className="group relative p-4 bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-white/10 rounded-lg cursor-pointer transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <FileIcon type={item.type} isFolder={item.is_folder} />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200 truncate pr-4">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default TeacherFiles;
