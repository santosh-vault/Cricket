import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Trophy } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useFixtures } from '../hooks/useFixtures';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  type: 'news' | 'blog' | 'feature';
  thumbnail_url: string | null;
  created_at: string;
}

export const Home: React.FC = () => {
  const [latestNews, setLatestNews] = useState<Post[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Post[]>([]);
  const [featurePosts, setFeaturePosts] = useState<Post[]>([]);
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useFixtures(5, true);

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

      // Fetch feature posts
      const { data: featureData } = await supabase
        .from('posts')
        .select('*')
        .eq('type', 'feature')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);

      setLatestNews(newsData || []);
      setFeaturedBlogs(blogsData || []);
      setFeaturePosts(featureData || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  if (fixturesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
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
      {!fixturesLoading && !fixturesError && (
        <section className="py-8 bg-gradient-to-br from-brand-50 to-brand-100 border-b border-brand-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FixturesList 
              limit={5} 
              compact={true} 
              showHeader={false}
              className=""
            />
          </div>
        </section>
      )}

      {/* Latest News & Featured Analysis Section */}
      <section className="py-12 bg-white border-b-4 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* News Section - 75% main news, 25% cricket updates */}
          <div className="mb-12 flex flex-col md:flex-row gap-8">
            {/* Main News Content (75%) */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-8 before:bg-blue-400 before:rounded-full before:mr-2">Latest Cricket News</h2>
                <Link
                  to="/news"
                  className="text-brand-600 hover:text-brand-700 font-semibold transition-colors duration-200"
                >
                  View All News →
                </Link>
              </div>
              {latestNews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Big main news card */}
                  <Link key={latestNews[0].id} to={`/news/${latestNews[0].slug}`} className="block md:col-span-2">
                    <article className="bg-brand-50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col cursor-pointer group">
                      <div className="h-80 bg-blue-200 flex items-center justify-center overflow-hidden">
                        {latestNews[0].thumbnail_url ? (
                          <img
                            src={latestNews[0].thumbnail_url}
                            alt={latestNews[0].title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-blue-400 text-center">
                            <Trophy className="h-12 w-12 mx-auto mb-2" />
                            <p>Cricket News</p>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                            {latestNews[0].category}
                          </span>
                          <span>{format(new Date(latestNews[0].created_at), 'MMM dd, yyyy')}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-900 mb-2 line-clamp-2 font-serif group-hover:underline">
                          {latestNews[0].title}
                        </h3>
                        <p className="text-gray-700 text-base mb-4 line-clamp-4 font-sans">
                          {latestNews[0].content.replace(/<[^>]*>/g, '').substring(0, 220)}...
                        </p>
                        <span className="mt-auto text-brand-600 hover:text-brand-700 font-semibold text-base transition-colors duration-200 font-sans">
                          Read More →
                        </span>
                      </div>
                    </article>
                  </Link>
                  {/* Small news cards */}
                  <div className="flex flex-col gap-6">
                    {latestNews.slice(1, 4).map((article) => (
                      <Link key={article.id} to={`/news/${article.slug}`} className="block">
                        <article className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col cursor-pointer group">
                          <div className="h-36 bg-blue-100 flex items-center justify-center overflow-hidden">
                            {article.thumbnail_url ? (
                              <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-blue-400 text-center">
                                <Trophy className="h-8 w-8 mx-auto mb-1" />
                                <p className="text-xs">Cricket News</p>
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col">
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                                {article.category}
                              </span>
                              <span>{format(new Date(article.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                            <h3 className="text-lg font-bold text-blue-900 mb-1 line-clamp-2 font-serif group-hover:underline">
                              {article.title}
                            </h3>
                            <span className="mt-auto text-brand-600 hover:text-brand-700 font-semibold text-xs transition-colors duration-200 font-sans">
                              Read More →
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Cricket Updates Sidebar (25%) */}
            <aside className="w-full md:w-1/4">
              <div className="h-full flex flex-col gap-3">
                <h3 className="text-lg font-bold text-blue-900 mb-3 font-serif">Cricket Updates</h3>
                <div className="flex flex-col gap-3">
                  {["India vs Australia: 2nd ODI tomorrow", "ICC T20 World Cup schedule released", "BCCI announces new selection panel", "Player of the week: Virat Kohli", "Rain delays in England-Pakistan Test"].map((update, idx) => (
                    <div key={idx} className="border border-blue-200 rounded-lg px-3 py-2 bg-white shadow-sm text-blue-900 text-sm font-sans flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="truncate">{update}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
          {/* Featured Blogs Section - 75% main, 25% sidebar */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Blogs Content (75%) */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-8 before:bg-blue-400 before:rounded-full before:mr-2">Featured Analysis</h2>
                <Link
                  to="/blogs"
                  className="text-brand-600 hover:text-brand-700 font-semibold transition-colors duration-200"
                >
                  View All Blogs →
                </Link>
              </div>
              {featuredBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Big main blog card */}
                  <Link key={featuredBlogs[0].id} to={`/blogs/${featuredBlogs[0].slug}`} className="block md:col-span-2">
                    <article className="bg-blue-50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col cursor-pointer group">
                      <div className="h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
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
                        <h3 className="text-2xl font-bold text-blue-900 mb-2 line-clamp-2 font-serif group-hover:underline">
                          {featuredBlogs[0].title}
                        </h3>
                        <p className="text-gray-700 text-base mb-4 line-clamp-4 font-sans">
                          {featuredBlogs[0].content.replace(/<[^>]*>/g, '').substring(0, 220)}...
                        </p>
                        <span className="mt-auto text-brand-600 hover:text-brand-700 font-semibold text-base transition-colors duration-200 font-sans">
                          Read Analysis →
                        </span>
                      </div>
                    </article>
                  </Link>
                  {/* Small blog cards */}
                  <div className="flex flex-col gap-6">
                    {featuredBlogs.slice(1, 3).map((blog) => (
                      <Link key={blog.id} to={`/blogs/${blog.slug}`} className="block">
                        <article className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col cursor-pointer group">
                          <div className="h-36 bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                            <h3 className="text-lg font-bold text-blue-900 mb-1 line-clamp-2 font-serif group-hover:underline">
                              {blog.title}
                            </h3>
                            <span className="mt-auto text-brand-600 hover:text-brand-700 font-semibold text-xs transition-colors duration-200 font-sans">
                              Read Analysis →
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Sidebar (25%) - can be reused for more updates or ads */}
            <aside className="w-full md:w-1/4">
              <div className="h-full flex flex-col gap-3">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Cricket Updates</h3>
                <div className="flex flex-col gap-3">
                  {["IPL Auction coming soon", "New ICC rankings released", "Top 5 run scorers this week", "Player spotlight: Babar Azam", "Women's World Cup qualifiers"].map((update, idx) => (
                    <div key={idx} className="border border-blue-200 rounded-lg px-3 py-2 bg-white shadow-sm text-blue-900 text-sm font-sans flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="truncate">{update}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-12 bg-blue-50 border-b-4 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-8 before:bg-blue-400 before:rounded-full before:mr-2">Feature Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featurePosts.length > 0 ? featurePosts.map(post => (
              <Link key={post.id} to={`/features/${post.slug}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">
                {post.thumbnail_url ? (
                  <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-blue-100 flex items-center justify-center">
                    <span className="text-4xl text-blue-400">★</span>
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-start p-5">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2 text-left font-serif group-hover:underline line-clamp-2">{post.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold mr-2">
                      {post.category}
                    </span>
                    <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                  <p className="text-gray-700 text-left mb-0 line-clamp-4">{post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center text-gray-500">No feature posts found.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};