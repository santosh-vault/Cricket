import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket as Cricket, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Cricket className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">CricNews</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for cricket news, live scores, and comprehensive match coverage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Latest News
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/fixtures" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Fixtures
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news?category=international" className="text-gray-400 hover:text-white transition-colors duration-200">
                  International
                </Link>
              </li>
              <li>
                <Link to="/news?category=domestic" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Domestic
                </Link>
              </li>
              <li>
                <Link to="/news?category=ipl" className="text-gray-400 hover:text-white transition-colors duration-200">
                  IPL
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 CricNews. All rights reserved. Built with passion for cricket fans worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};