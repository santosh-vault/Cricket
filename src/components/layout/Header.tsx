import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Ticket as Cricket, User, LogOut, Mail, Phone, Facebook, Twitter, Instagram, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Fixtures', path: '/fixtures' },
    { name: 'Features', path: '/features' },
    { name: 'Ranking', path: '/ranking' },

  ];

  return (
    <>
      {/* Top Contact & Social Bar */}
      <div className="bg-gray-100 text-gray-700 text-xs py-2 px-4 flex justify-between items-center font-sans tracking-wide">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-blue-600" /> contact@cricnews.com
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-blue-600" /> +1 234 567 890
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>
      <header className="bg-gradient-to-r from-blue-800 to-blue-950 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Cricket className="h-9 w-9 text-blue-300 transform rotate-[-15deg]" />
              <span className="text-3xl font-extrabold text-white tracking-tight">CricNews</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-7">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-blue-700"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="bg-white text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 shadow-md transition-all duration-300 ease-in-out"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 cursor-pointer group">
                    <User className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors duration-200" />
                    <span className="text-sm text-blue-200 group-hover:text-white transition-colors duration-200">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-blue-200 hover:text-red-400 p-1 rounded-md transition-colors duration-200"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="bg-white text-blue-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-100 shadow-md transition-all duration-300 ease-in-out register-login-btn"
                >
                  Register / Login
                </Link>
              )}
              {/* Dark Theme Toggle Icon */}
              <button className="ml-2 text-blue-200 hover:text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" title="Toggle Dark Mode">
                <Moon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-blue-700 py-4 bg-blue-900 absolute w-full left-0 shadow-md">
              <div className="flex flex-col space-y-3 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-base font-medium block transition-colors duration-200 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Dark Theme Toggle Icon for mobile */}
                <button className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-base font-medium text-left transition-colors duration-200 flex items-center hover:bg-blue-700" title="Toggle Dark Mode">
                  <Moon className="h-5 w-5 mr-3" /> Dark Mode
                </button>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="bg-white text-blue-900 px-3 py-2 rounded-md text-base font-medium block hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="text-red-300 hover:text-red-400 px-3 py-2 rounded-md text-base font-medium text-left transition-colors duration-200 hover:bg-blue-700"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    className="bg-white text-blue-900 px-3 py-2 rounded-md text-base font-light block hover:bg-blue-100 transition-colors duration-200 register-login-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register / Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};