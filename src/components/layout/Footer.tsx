import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket as Cricket, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-950 text-gray-200 font-sans border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Cricket className="h-9 w-9 text-blue-400 transform rotate-[-15deg]" />
              <span className="text-3xl font-extrabold text-white tracking-tight">CricNews</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for up-to-the-minute cricket news, live scores, insightful analysis, and comprehensive match coverage from around the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white border-b-2 border-blue-500 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/news" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> Latest News
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> Blogs
                </Link>
              </li>
              <li>
                <Link to="/fixtures" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> Fixtures
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white border-b-2 border-blue-500 pb-2 inline-block">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/news?category=international" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> International
                </Link>
              </li>
              <li>
                <Link to="/news?category=domestic" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> Domestic
                </Link>
              </li>
              <li>
                <Link to="/news?category=ipl" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&raquo;</span> IPL
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white border-b-2 border-blue-500 pb-2 inline-block">Connect With Us</h3>
            <div className="flex space-x-5 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transform hover:scale-110 transition-transform duration-300" title="Facebook">
                <Facebook className="h-7 w-7" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transform hover:scale-110 transition-transform duration-300" title="Twitter">
                <Twitter className="h-7 w-7" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-500 transform hover:scale-110 transition-transform duration-300" title="Instagram">
                <Instagram className="h-7 w-7" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-600 transform hover:scale-110 transition-transform duration-300" title="YouTube">
                <Youtube className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 CricNews. All rights reserved. <span className="font-regular text-blue-300">Passionately built for cricket fans worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};