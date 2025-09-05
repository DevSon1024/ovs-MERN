import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import Button from './Button'; 

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'candidate':
        return '/candidate';
      case 'voter':
        return '/voter';
      default:
        return '/';
    }
  }

  return (
    <nav className="glass-effect shadow-medium sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <span className="text-3xl">🗳️</span>
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-full animate-pulse"></div>
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
              VoteChain
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Profile
                </Link>
                <Button 
                  onClick={handleLogout} 
                  variant="primary"
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}