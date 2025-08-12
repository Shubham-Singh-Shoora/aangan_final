
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useICP } from '@/contexts/ICPContext';
import { Home, User, LogIn, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  variant?: 'landing' | 'app';
}

const Header = ({ variant = 'app' }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useICP();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="glass-nav shadow-xl border-b border-white/40 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 pulse-glow hover:scale-110 animate-gradient overflow-hidden">
              <img
                src="/favicon.jpg"
                alt="AANGAN Logo"
                className="w-10 h-10 object-cover rounded-lg"
              />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-wide animate-gradient" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '800', letterSpacing: '0.05em' }}>
              AANGAN
            </span>
            {variant === 'landing' && (
              <div className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
                <span className="text-xs text-blue-700 font-bold">Beta</span>
              </div>
            )}
          </Link>

          {/* Centered Enhanced Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8">
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-blue-200/50">
              <Link
                to="/marketplace"
                className="flex items-center px-6 py-3 text-gray-700 hover:text-white transition-all duration-300 font-bold text-sm relative group rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500"
              >
                <Home className="w-4 h-4 mr-2" />
                Browse Rentals
              </Link>
              {user && (
                <Link
                  to={user.type === 'tenant' ? '/tenant-dashboard' : '/landlord-dashboard'}
                  className="flex items-center px-6 py-3 text-gray-700 hover:text-white transition-all duration-300 font-bold text-sm relative group rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Enhanced Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm text-gray-800 font-bold">
                    {user.name && user.name.length > 0 ? user.name[0] : 'User'}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="glass-card border-blue-300 text-blue-700 hover:bg-blue-50 hover-glow transition-all duration-300 font-bold px-6 py-2 transform hover:scale-105"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                asChild
                variant="outline"
                className="glass-card border-blue-300 text-blue-700 hover:bg-blue-50 hover-glow transition-all duration-300 font-bold px-6 py-2 transform hover:scale-105"
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-blue-200/50">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/marketplace"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-white transition-all duration-300 font-bold rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-3" />
                Browse Rentals
              </Link>
              {isAuthenticated && user && (
                <Link
                  to={Object.keys(user.role)[0] === 'Tenant' ? '/tenant-dashboard' : '/landlord-dashboard'}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-white transition-all duration-300 font-bold rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              )}
              <div className="pt-4 border-t border-blue-200/50">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-800 font-bold">{user.name && user.name.length > 0 ? user.name[0] : 'User'}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full glass-card border-blue-300 text-blue-700 hover:bg-blue-50 font-bold py-3"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full glass-card border-blue-300 text-blue-700 hover:bg-blue-50 font-bold py-3"
                  >
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
