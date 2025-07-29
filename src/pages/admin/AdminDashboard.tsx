import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Trophy,
  Settings,
  Users,
  Plus,
  Menu, // Mobile menu icon
  X, // Mobile close icon
} from "lucide-react";
import { SEOHead } from "../../components/seo/SEOHead";
import { PostsManager } from "./components/PostsManager";
import { DashboardOverview } from "./components/DashboardOverview";
import { RankingsManager } from "./components/RankingsManager";

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "News Articles",
      href: "/admin/news",
      icon: FileText,
      current: location.pathname.includes("/admin/news"),
    },
    {
      name: "Features",
      href: "/admin/blogs",
      icon: BookOpen,
      current: location.pathname.includes("/admin/blogs"),
    },
    {
      name: "Analysis",
      href: "/admin/features",
      icon: BookOpen,
      current: location.pathname.includes("/admin/features"),
    },
    {
      name: "ICC Rankings",
      href: "/admin/rankings",
      icon: Trophy,
      current: location.pathname.includes("/admin/rankings"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Admin Dashboard - CricNews CMS"
        description="Admin dashboard for managing cricket news, blogs, features, analysis, and ICC rankings for CricNews."
      />
      {/* Outer container: Sets min-height for the entire viewport and uses flex-col for stacking header, then content + sidebar */}
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col admin-panel">
        {/* --- MAIN LAYOUT CONTAINER (content below header) --- */}
        {/* This div starts below the fixed header (mt-16) and handles the sidebar + main content side-by-side layout */}
        <div className="flex flex-1  relative">
          {" "}
          {/* `relative` for containing fixed sidebar, `flex-1` to grow vertically */}
          {/* --- DESKTOP SIDEBAR --- */}
          {/* Fixed to left, starts below header, spans remaining height */}
          <div className="hidden md:flex md:w-64 md:flex-col fixed top-16 bottom-0 left-0 z-20 ">
            {" "}
            {/* Fixed, top-16, bottom-0, left-0 */}
            <div className="flex flex-col flex-grow bg-blue-900 overflow-y-auto border-r border-blue-800 shadow-md">
              {/* This div takes full height of the fixed sidebar area */}
              <div className="flex-grow flex flex-col pt-5">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? "bg-blue-700 text-white rounded-lg shadow-md"
                          : "text-blue-200 hover:bg-blue-700 hover:text-white rounded-lg"
                      } group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200`}
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 text-blue-300 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          {/* --- MAIN CONTENT AREA --- */}
          {/* This section will take the remaining width and handle its own scrolling */}
          <main className="flex-1 bg-gray-50 md:ml-64 py-8 px-4 sm:px-6 lg:px-12 overflow-y-auto">
            {" "}
            {/* md:ml-64 to clear sidebar */}
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="news/*" element={<PostsManager type="news" />} />
                <Route path="blogs/*" element={<PostsManager type="blog" />} />
                <Route
                  path="features/*"
                  element={<PostsManager type="feature" />}
                />
                <Route path="rankings/*" element={<RankingsManager />} />
              </Routes>
            </div>
          </main>
        </div>{" "}
        {/* End of flex-1 mt-16 container */}
      </div>{" "}
      {/* End of min-h-screen container */}
    </>
  );
};
