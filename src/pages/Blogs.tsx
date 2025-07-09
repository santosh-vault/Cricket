import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, Tag, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  created_at: string;
}

export const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const { isAdmin } = useAuth();

  const predefinedCategories = [
    'Analysis',
    'Opinion',
    'Player Profiles',
    'Match Analysis',
    'Statistics',
    'History',
    'Coaching Tips',
    'Fantasy Cricket'
  ];

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('type', 'blog')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      const search = searchParams.get('search');
      const category = searchParams.get('category');

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    setSelectedCategory(category);
  };

  return (
    <>
      <SEOHead
        title="Cricket Blogs"
        description="Read expert cricket analysis, player profiles, match insights, and in-depth commentary from our team of cricket writers and analysts."
        keywords="cricket blogs, cricket analysis, cricket opinion, player profiles, match analysis, cricket insights"
      />

      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Header Section */}
        <section className="bg-gray-50 pt-6 pb-2 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Features
            </h2>
        
          </div>
        </section>

        {/* Blogs and Sidebar Section */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-10">
            {/* Main Blogs (75%) - left side */}
            <div className="w-full md:w-3/4">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl">
                  <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
                  <p className="ml-4 text-xl text-blue-700 font-semibold mt-4">Loading insightful cricket blogs...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl p-8">
                  <BookOpen className="h-20 w-20 mx-auto mb-6 text-gray-400 opacity-70" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Blogs Found!</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">Try adjusting your search or filter criteria.</p>
                  { (searchQuery || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setSearchParams({});
                      }}
                      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {blogs.map((blog) => (
                    <Link key={blog.id} to={`/blogs/${blog.slug}`} className="block group">
                      <article
                        className="bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
                      >
                        {/* Image */}
                        <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                          {blog.thumbnail_url ? (
                            <img
                              src={blog.thumbnail_url}
                              alt={blog.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-blue-400 text-center p-6 opacity-70">
                              <BookOpen className="h-16 w-16 mx-auto mb-3" />
                              <p className="text-lg font-medium">No Image</p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <span className="absolute bottom-4 left-6 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            {blog.category}
                          </span>
                        </div>
                        {/* Text content */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                              {blog.title}
                            </h3>
                            <p className="text-gray-700 text-base mb-4 line-clamp-3 leading-relaxed">
                              {blog.content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5 text-gray-400" /> {format(new Date(blog.created_at), 'MMM dd, yyyy')}
                            </span>
                            <span className="text-blue-600 font-semibold flex items-center group-hover:text-blue-800 read-more">
                              Read More <ChevronRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Most Read Blogs (25%) - right side */}
            <aside className="w-full md:w-1/4">
              <div className="bg-white rounded-xl p-6 sticky top-28 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-red-500" /> Most Read
                </h3>
                <div className="flex flex-col divide-y divide-gray-100">
                  {blogs.slice(0, 5).map((blog, index) => (
                    <Link key={blog.id} to={`/blogs/${blog.slug}`} className="block py-3 group">
                      <h4 className="font-semibold text-base text-gray-800 mb-1 leading-snug line-clamp-3 group-hover:text-blue-700 transition-colors duration-200">
                        <span className="text-blue-500 mr-2 font-bold">{index + 1}.</span> {blog.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                    </Link>
                  ))}
                  <Link to="/most-read-blogs" className="mt-4 block text-blue-600 text-sm font-semibold hover:underline flex items-center justify-center pt-3">
                    View More <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
};

// Add custom animation to your global CSS or a dedicated styles file (e.g., globals.css) if you want the loading spinner text to pulse
/*
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}
*/