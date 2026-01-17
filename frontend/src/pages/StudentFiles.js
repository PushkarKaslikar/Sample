import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';

function StudentFiles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null); // null = root
  const [folderHistory, setFolderHistory] = useState([]);

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

  const openFolder = (folder) => {
    setFolderHistory([...folderHistory, folder]);
    setCurrentFolder(folder);
  };

  const goBack = () => {
    const newHistory = [...folderHistory];
    newHistory.pop();
    const prevFolder = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
    setFolderHistory(newHistory);
    setCurrentFolder(prevFolder);
  };

  const navigateToBreadcrumb = (index) => {
    if (index === -1) {
      setFolderHistory([]);
      setCurrentFolder(null);
    } else {
      const newHistory = folderHistory.slice(0, index + 1);
      setFolderHistory(newHistory);
      setCurrentFolder(newHistory[index]);
    }
  };

  const handleDownload = async (item) => {
    toast.info(`Starting download for "${item.name}"...`);
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
          <Link to="/student-dashboard" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              {currentFolder && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (goBack) goBack();
                  }}
                  className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium text-white mb-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back
                </button>
              )}
              <h1 className="text-3xl font-bold">Course Files</h1>
            </div>
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
        </div>

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
                      onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                      className="text-gray-600 hover:text-cyan-400 p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Download"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
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

export default StudentFiles;
