import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Ticket as Cricket, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Fixtures', path: '/fixtures' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Cricket className="h-8 w-8 text-brand-600" />
            <span className="text-2xl font-bold text-gray-900">CricNews</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors duration-200"
                  >
                    Register
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-600 p-1 rounded-md transition-colors duration-200"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors duration-200"
              >
                Register
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-600 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-base font-medium block transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="bg-brand-600 text-white px-3 py-2 rounded-md text-base font-medium block hover:bg-brand-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium text-left transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="bg-brand-600 text-white px-3 py-2 rounded-md text-base font-medium block hover:bg-brand-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};