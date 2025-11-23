import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import Button from './Button'; 

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'admin': return '/admin';
      case 'candidate': return '/candidate';
      case 'voter': return '/voter';
      default: return '/';
    }
  }

  const NavLinks = ({ mobile = false }) => {
    const baseClass = mobile 
      ? "flex flex-col space-y-4 p-4" 
      : "flex items-center space-x-6";
    
    const linkClass = mobile
      ? "text-gray-700 hover:text-indigo-600 font-medium text-lg block py-2"
      : "text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200";

    return (
      <div className={baseClass}>
        {isAuthenticated ? (
          <>
            <Link to={getDashboardLink()} className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/profile" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
             <Link to="/about" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <div className={mobile ? "pt-2" : ""}>
              <Button onClick={handleLogout} variant="primary" size={mobile ? "md" : "sm"} fullWidth={mobile}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
             <Link to="/about" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/login" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" size={mobile ? "md" : "sm"} fullWidth={mobile}>
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🗳️</span>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              VoteChain
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <NavLinks mobile={true} />
        </div>
      )}
    </nav>
  );
}