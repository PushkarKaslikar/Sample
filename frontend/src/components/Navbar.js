import Logo from './Logo';

function Navbar({ onOpenAuth }) {
  return (
    <nav
      data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Logo className="w-10 h-10" />
            <span
              data-testid="logo-text"
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Mechtron
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              data-testid="nav-student-btn"
              onClick={() => onOpenAuth('student', 'login')}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Student
            </button>
            <button
              data-testid="nav-teacher-btn"
              onClick={() => onOpenAuth('teacher', 'login')}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Teacher
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;