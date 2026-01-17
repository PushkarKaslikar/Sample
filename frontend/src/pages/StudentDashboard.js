import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '../App';
import { toast } from 'sonner';
import Logo from '../components/Logo';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data fetch since the display elements are removed
    setDashboardData({ message: "Welcome to your centralized hub for learning resources." });
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const openGemini = () => {
    window.open('https://mech-chatbot-7m1g.vercel.app/', '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0b] via-[#111113] to-[#0a0a0b] text-white">
      {/* Header */}
      <nav
        data-testid="dashboard-nav"
        className="bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Logo className="w-10 h-10" />
              <span
                className="text-xl font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Mechtron
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span
                data-testid="user-name"
                className="text-gray-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {user?.name}
              </span>
              <button
                data-testid="logout-btn"
                onClick={handleLogout}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className="container mx-auto px-4 py-12 flex flex-col items-center justify-center"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="text-center mb-12">
          <h1
            data-testid="dashboard-title"
            className="text-5xl font-bold mb-2"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Student Dashboard
          </h1>
          <p
            className="text-gray-400 text-lg"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {dashboardData?.message}
          </p>
        </div>

        {/* Interactive Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

          {/* Chatbot Button */}
          <button
            onClick={openGemini}
            className="group flex flex-col items-center justify-center space-y-4 p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 ease-in-out h-64 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:-translate-y-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Chatbot
            </span>
          </button>

          {/* ✅ 3D Model Button — ROUTING ADDED ONLY */}
          <button
            onClick={() => navigate('/lathe-3d')}
            className="group flex flex-col items-center justify-center space-y-4 p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 ease-in-out h-64 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              3D Models
            </span>
          </button>

          {/* Uploaded Files Button */}
          <button
            onClick={() => navigate('/student-files')}
            className="group flex flex-col items-center justify-center space-y-4 p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 ease-in-out h-64 hover:border-green-400 hover:bg-green-500/10 hover:shadow-2xl hover:shadow-green-500/20 transform hover:-translate-y-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              My Files
            </span>
          </button>



        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
