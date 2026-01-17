import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('student');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const openAuth = (role, mode = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  /* Redirect logged-in users */
  useEffect(() => {
    if (!user) return;
    navigate(user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
  }, [user, navigate]);

  /* Background video autoplay */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* ================= VIDEO BACKGROUND ================= */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      </div>

      <Navbar onOpenAuth={openAuth} />

      {/* ================= HERO ================= */}
      <section className="relative z-10 pt-32 pb-28 px-4">
        <div className="max-w-5xl mx-auto text-center">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6
            bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent
            animate-fade-in-up">
            Learn. Create. Succeed.
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10 animate-fade-in-up delay-150">
            A modern learning platform that blends intelligence, interaction, and simplicity —
            built for students and educators.
          </p>

          <div className="flex justify-center gap-4 flex-wrap animate-fade-in-up delay-300">
            <button
              onClick={() => openAuth('student', 'register')}
              className="px-7 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600
              shadow-xl shadow-cyan-500/30 transition-all duration-300
              hover:-translate-y-1"
            >
              I’m a Student
            </button>

            <button
              onClick={() => openAuth('teacher', 'login')}
              className="px-7 py-3 rounded-full border border-white/20
              hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              I’m a Teacher
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">

          {[
            {
              icon: '💬',
              title: 'AI Chatbot',
              desc: 'Instant academic support anytime.'
            },
            {
              icon: '📁',
              title: 'Smart File Sharing',
              desc: 'Centralized notes & materials.'
            },
            {
              icon: '🧩',
              title: 'Interactive 3D Model',
              desc: 'Learn CNC Lathe visually.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white/5 border border-white/10 rounded-2xl p-8
              backdrop-blur-md transition-all duration-300
              hover:-translate-y-3 hover:border-cyan-400/50"
            >
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">

          {['Sign Up', 'Get Access', 'Learn Smarter'].map((step, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-8
              hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{i + 1}</div>
              <h4 className="font-semibold text-lg mb-2">{step}</h4>
              <p className="text-sm text-gray-300">
                {i === 0 && 'Create your account.'}
                {i === 1 && 'Access tools instantly.'}
                {i === 2 && 'Study efficiently.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <footer className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-md">
          <h3 className="text-3xl font-semibold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-300 mb-8">
            Join the next generation of learning platforms.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => openAuth('student', 'register')}
              className="px-7 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 transition-all hover:-translate-y-1"
            >
              Create Student Account
            </button>
            <button
              onClick={() => openAuth('teacher', 'register')}
              className="px-7 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              Create Teacher Account
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-500">
          © 2024 Learning Platform
        </p>
      </footer>

      {/* ================= AUTH MODAL ================= */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          role={authRole}
          onSwitchMode={setAuthMode}
        />
      )}
    </div>
  );
}

export default HomePage;
