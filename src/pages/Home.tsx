import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Trophy } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  type: 'news' | 'blog';
  thumbnail_url: string | null;
  created_at: string;
}

export const Home: React.FC = () => {
  const [latestNews, setLatestNews] = useState<Post[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch latest news
      const { data: newsData } = await supabase
        .from('posts')
        .select('*')
        .eq('type', 'news')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch featured blogs
      const { data: blogsData } = await supabase
        .from('posts')
        .select('*')
        .eq('type', 'blog')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);

      setLatestNews(newsData || []);
      setFeaturedBlogs(blogsData || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Home"
        description="Stay updated with the latest cricket news, live scores, match fixtures, and expert analysis. Your one-stop destination for comprehensive cricket coverage."
        keywords="cricket news, live scores, cricket fixtures, cricket updates, IPL, international cricket"
      />

      {/* Live Fixtures Section - now using API data */}
      <section className="py-8 bg-gradient-to-br from-green-50 to-green-100 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FixturesList 
            limit={5} 
            compact={true} 
            showHeader={false}
            className=""
          />
        </div>
      </section>

      {/* Latest News & Featured Analysis Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* News Section - 75% main news, 25% cricket updates */}
          <div className="mb-12 flex flex-col md:flex-row gap-8">
            {/* Main News Content (75%) */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Cricket News</h2>
                <Link
                  to="/news"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                >
                  View All News →
                </Link>
              </div>
              {latestNews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Big main news card */}
                  <article
                    key={latestNews[0].id}
                    className="md:col-span-2 bg-green-50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col"
                  >
                    <div className="h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {latestNews[0].thumbnail_url ? (
                        <img
                          src={latestNews[0].thumbnail_url}
                          alt={latestNews[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <Trophy className="h-12 w-12 mx-auto mb-2" />
                          <p>Cricket News</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                          {latestNews[0].category}
                        </span>
                        <span>{format(new Date(latestNews[0].created_at), 'MMM dd, yyyy')}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {latestNews[0].title}
                      </h3>
                      <p className="text-gray-700 text-base mb-4 line-clamp-4">
                        {latestNews[0].content.replace(/<[^>]*>/g, '').substring(0, 220)}...
                      </p>
                      <Link
                        to={`/news/${latestNews[0].slug}`}
                        className="mt-auto text-green-600 hover:text-green-700 font-semibold text-base transition-colors duration-200"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                  {/* Small news cards */}
                  <div className="flex flex-col gap-6">
                    {latestNews.slice(1, 4).map((article) => (
                      <article
                        key={article.id}
                        className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
                      >
                        <div className="h-20 bg-gray-200 flex items-center justify-center overflow-hidden">
                          {article.thumbnail_url ? (
                            <img
                              src={article.thumbnail_url}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <Trophy className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Cricket News</p>
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                              {article.category}
                            </span>
                            <span>{format(new Date(article.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                            {article.title}
                          </h3>
                          <Link
                            to={`/news/${article.slug}`}
                            className="mt-auto text-green-600 hover:text-green-700 font-semibold text-xs transition-colors duration-200"
                          >
                            Read More →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Cricket Updates Sidebar (25%) */}
            <aside className="w-full md:w-1/4">
              <div className="bg-green-100 rounded-xl p-4 shadow-md h-full flex flex-col">
                <h3 className="text-lg font-bold text-green-900 mb-3">Cricket Updates</h3>
                <ul className="text-green-800 text-sm space-y-2">
                  <li>• India vs Australia: 2nd ODI tomorrow</li>
                  <li>• ICC T20 World Cup schedule released</li>
                  <li>• BCCI announces new selection panel</li>
                  <li>• Player of the week: Virat Kohli</li>
                  <li>• Rain delays in England-Pakistan Test</li>
                </ul>
              </div>
            </aside>
          </div>
          {/* Featured Blogs Section - 75% main, 25% sidebar */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Blogs Content (75%) */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Analysis</h2>
                <Link
                  to="/blogs"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                >
                  View All Blogs →
                </Link>
              </div>
              {featuredBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Big main blog card */}
                  <article
                    key={featuredBlogs[0].id}
                    className="md:col-span-2 bg-blue-50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col"
                  >
                    <div className="h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {featuredBlogs[0].thumbnail_url ? (
                        <img
                          src={featuredBlogs[0].thumbnail_url}
                          alt={featuredBlogs[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <Trophy className="h-8 w-8 mx-auto mb-1" />
                          <p className="text-xs">Analysis</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                          {featuredBlogs[0].category}
                        </span>
                        <span>{format(new Date(featuredBlogs[0].created_at), 'MMM dd, yyyy')}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {featuredBlogs[0].title}
                      </h3>
                      <p className="text-gray-700 text-xs mb-3 line-clamp-3">
                        {featuredBlogs[0].content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      <Link
                        to={`/blogs/${featuredBlogs[0].slug}`}
                        className="mt-auto text-green-600 hover:text-green-700 font-semibold text-xs transition-colors duration-200"
                      >
                        Read Analysis →
                      </Link>
                    </div>
                  </article>
                  {/* Small blog cards */}
                  <div className="flex flex-col gap-6">
                    {featuredBlogs.slice(1, 3).map((blog) => (
                      <article
                        key={blog.id}
                        className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex"
                      >
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {blog.thumbnail_url ? (
                            <img
                              src={blog.thumbnail_url}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <Trophy className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Analysis</p>
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                              {blog.category}
                            </span>
                            <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                            {blog.title}
                          </h3>
                          <Link
                            to={`/blogs/${blog.slug}`}
                            className="mt-auto text-green-600 hover:text-green-700 font-semibold text-xs transition-colors duration-200"
                          >
                            Read Analysis →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Sidebar (25%) - can be reused for more updates or ads */}
            <aside className="w-full md:w-1/4">
              <div className="bg-blue-100 rounded-xl p-4 shadow-md h-full flex flex-col">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Cricket Updates</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• IPL Auction coming soon</li>
                  <li>• New ICC rankings released</li>
                  <li>• Top 5 run scorers this week</li>
                  <li>• Player spotlight: Babar Azam</li>
                  <li>• Women's World Cup qualifiers</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};