import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Calendar, 
  Trophy,
  Settings,
  Users,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';
import { PostsManager } from './components/PostsManager';
import { FixturesManager } from './components/FixturesManager';
import { DashboardOverview } from './components/DashboardOverview';

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: location.pathname === '/admin' },
    { name: 'News Articles', href: '/admin/news', icon: FileText, current: location.pathname.includes('/admin/news') },
    { name: 'Blog Posts', href: '/admin/blogs', icon: BookOpen, current: location.pathname.includes('/admin/blogs') },
    { name: 'Fixtures', href: '/admin/fixtures', icon: Calendar, current: location.pathname.includes('/admin/fixtures') },
    { name: 'Scorecards', href: '/admin/scorecards', icon: Trophy, current: location.pathname.includes('/admin/scorecards') },
  ];

  return (
    <>
      <SEOHead
        title="Admin Dashboard"
        description="Admin dashboard for managing cricket news, blogs, fixtures, and scorecards."
      />

      <div className="min-h-screen bg-gray-100">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-green-100 text-green-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-green-100 text-green-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex-1 flex">
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Routes>
                  <Route index element={<DashboardOverview />} />
                  <Route path="news/*" element={<PostsManager type="news" />} />
                  <Route path="blogs/*" element={<PostsManager type="blog" />} />
                  <Route path="fixtures/*" element={<FixturesManager />} />
                  <Route path="scorecards/*" element={<div>Scorecards Management (Coming Soon)</div>} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};