import React from 'react';
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Blogs } from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';
import { Fixtures } from './pages/Fixtures';
import { Scorecard } from './pages/Scorecard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRoute } from './components/auth/AdminRoute';
import { Features } from './pages/Features';
import { FeatureDetail } from './pages/FeatureDetail';
import { Ranking } from './pages/Ranking';
import { AboutUs } from './pages/AboutUs';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="news" element={<News />} />
            <Route path="news/:slug" element={<NewsDetail />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:slug" element={<BlogDetail />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="scorecard/:matchId" element={<Scorecard />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="features" element={<Features />} />
            <Route path="features/:slug" element={<FeatureDetail />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;