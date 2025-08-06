import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Heart,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-950 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Logo & Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/cricket fantom-01.png"
                alt="Cricket Fantom Logo"
                className="h-20 object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Your ultimate destination for cricket news, live scores, and
              comprehensive match coverage from around the globe.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                {
                  Icon: Facebook,
                  href: "https://facebook.com",
                  color: "hover:text-blue-500",
                },
                {
                  Icon: Twitter,
                  href: "https://twitter.com",
                  color: "hover:text-sky-400",
                },
                {
                  Icon: Instagram,
                  href: "https://instagram.com",
                  color: "hover:text-pink-500",
                },
                {
                  Icon: Youtube,
                  href: "https://youtube.com",
                  color: "hover:text-red-500",
                },
              ].map(({ Icon, href, color }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${color} transition-colors duration-300 transform hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b-2 border-green-500 pb-2">
              Quick Access
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Latest News", path: "/news" },
                { name: "Features", path: "/blogs" },
                { name: "Analysis", path: "/features" },
                { name: "Rankings", path: "/ranking" },
                { name: "About Us", path: "/about-us" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-green-500 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cricket Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b-2 border-yellow-400 pb-2">
              Cricket World
            </h3>
            <ul className="space-y-2">
              {[
                { name: "International", category: "international" },
                { name: "IPL", category: "ipl" },
                { name: "Domestic", category: "domestic" },
                { name: "T20 Leagues", category: "t20" },
                { name: "Women's Cricket", category: "womens" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={`/news?category=${item.category}`}
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b-2 border-pink-500 pb-2">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:info@cricnews.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  info@cricnews.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <hr className="my-12 border-gray-700" />

        {/* Legal & Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            {[
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Terms of Service", path: "/terms" },
              { name: "Sitemap", path: "/sitemap" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-500 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <p className="text-gray-500">
            &copy; 2025 CricNews. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
