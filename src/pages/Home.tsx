import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Trophy, ChevronRight } from 'lucide-react'; // Added ChevronRight for 'Read More'
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useFixtures } from '../hooks/useFixtures';

// Interface for Post remains the same
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

// ICC Rankings Card Component - MASSIVE DESIGN CHANGE
const formats = ['test', 'odi', 't20'] as const;
const categories = ['team', 'batter', 'bowler', 'allrounder'] as const;

function ICCRankingsCard() {
  const [selectedFormat, setSelectedFormat] = useState<'test' | 'odi' | 't20'>('test');
  const [selectedCategory, setSelectedCategory] = useState<'team' | 'batter' | 'bowler' | 'allrounder'>('team');
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRankings();
  }, [selectedFormat, selectedCategory]);

  async function fetchRankings() {
    setLoading(true);
    const { data } = await supabase
      .from('icc_rankings')
      .select('*')
      .eq('format', selectedFormat)
      .eq('category', selectedCategory)
      .order('rank', { ascending: true });
    setRankings(data || []);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col text-gray-900 border border-gray-100">
      <h3 className="text-2xl font-extrabold text-blue-800 mb-5 flex items-center">
        <Trophy className="h-6 w-6 mr-3 text-yellow-500" /> ICC Rankings
      </h3>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 -mx-2 px-2"> {/* Added overflow for small screens */}
        {formats.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFormat(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out whitespace-nowrap
              ${selectedFormat === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex space-x-5 mb-4 text-base border-b border-gray-200 pb-3 -mx-2 px-2 overflow-x-auto"> {/* Added overflow */}
        {categories.map(c => (
          <span
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`cursor-pointer pb-2 font-medium transition-colors duration-300 ease-in-out whitespace-nowrap
              ${selectedCategory === c
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-blue-600'
              }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </span>
        ))}
      </div>
      <div className="divide-y divide-gray-100 mb-4 min-h-[250px] flex-grow overflow-y-auto"> {/* Increased min-height */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
            Loading Rankings...
          </div>
        ) : rankings.length > 0 ? (
          <>
            {rankings.slice(0, 6).map(row => (
              <div key={row.id} className="flex items-center py-3 text-base justify-between">
                <span className="w-8 text-gray-600 font-bold">{row.rank}.</span>
                {row.flag_emoji && <span className="w-8 h-8 flex items-center justify-center text-xl mr-3">{row.flag_emoji}</span>}
                <span className="flex-1 text-gray-800 font-medium">{row.team_name || row.player_name}</span>
                <span className="font-bold text-blue-700 text-lg">{row.rating}</span>
              </div>
            ))}
            {rankings.length > 6 && (
              <Link to="/ranking" className="block w-full mt-2 py-2 text-center bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors duration-200">
                Show All Rankings
              </Link>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">No rankings available for this selection.</div>
        )}
      </div>
    </div>
  );
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-bounce text-blue-600 text-xl font-semibold">Loading Cricket Data...</div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Home - CricNews: Your Ultimate Cricket Companion"
        description="Stay updated with the latest cricket news, live scores, match fixtures, and expert analysis. Your one-stop destination for comprehensive cricket coverage from around the world."
        keywords="cricket news, live scores, cricket fixtures, cricket updates, IPL, international cricket, T20, ODI, Test, cricket analysis, player rankings"
      />

      {/* Live Fixtures Section */}
      {!fixturesLoading && !fixturesError && (
        <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Added a subtle header to FixturesList or keep showHeader={false} */}
            <FixturesList
              limit={5}
              compact={true}
              showHeader={true} // Set to true to show the internal header of FixturesList if desired
              className="bg-white rounded-xl p-4 md:p-6" // Apply styles to the FixturesList wrapper
            />
          </div>
        </section>
      )}

      {/* Main Content Area: Latest News & Featured Analysis Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 lg:pt-8">
          {/* News Section - Main News (75%) & ICC Rankings (25%) */}
          <div className="mb-32 flex flex-col lg:flex-row gap-10">
            {/* Main News Content (75%) */}
            <div className="w-full lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-10 before:bg-blue-600 before:rounded-full">Latest Cricket News</h2>
                <Link
                  to="/news"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 flex items-center text-lg"
                >
                  View All News <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
              {latestNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Big main news card */}
                  <Link key={latestNews[0].id} to={`/news/${latestNews[0].slug}`} className="block md:col-span-2 group">
                    <article className="bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 min-h-[320px]">
                      <div className="h-80 bg-blue-100 flex items-center justify-center overflow-hidden relative">
                        {latestNews[0].thumbnail_url ? (
                          <img
                            src={latestNews[0].thumbnail_url}
                            alt={latestNews[0].title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-blue-400 text-center p-8">
                            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-70" />
                            <p className="text-lg font-semibold">No Image Available</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <span className="absolute bottom-4 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {latestNews[0].category}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                          {latestNews[0].title}
                        </h3>
                        <p className="text-gray-700 text-base mb-4 line-clamp-3 leading-relaxed">
                          {latestNews[0].content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" /> {format(new Date(latestNews[0].created_at), 'MMM dd, yyyy')}
                          </span>
                          <span className="text-blue-600 font-semibold flex items-center">
                            Read More <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                  {/* Small news cards column */}
                  <div className="flex flex-col gap-4 h-full justify-between min-h-[320px]">
                    {latestNews.slice(1, 3).map((article) => (
                      <Link key={article.id} to={`/news/${article.slug}`} className="block group flex-1">
                        <article className="bg-white rounded-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100 min-h-[150px]">
                          {/* Image on top, smaller height */}
                          {article.thumbnail_url ? (
                            <div className="w-full h-32 bg-blue-100 flex items-center justify-center overflow-hidden">
                              <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-24 bg-blue-100 flex items-center justify-center p-2">
                              <TrendingUp className="h-8 w-8 text-blue-400 opacity-70" />
                            </div>
                          )}
                          {/* Title and meta below image */}
                          <div className="p-3">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold mb-1 inline-block">
                              {article.category}
                            </span>
                            <h3 className="text-md font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                              {article.title}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1 text-gray-400" /> {format(new Date(article.created_at), 'MMM dd, yyyy')}
                              <span className="ml-auto text-blue-600 font-semibold flex items-center">
                                Read More <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-lg">No latest news available at the moment.</div>
              )}
            </div>

            {/* ICC Rankings Sidebar (right) */}
            <aside className="w-full lg:w-1/4">
              <ICCRankingsCard />
            </aside>
          </div>

          {/* Featured Analysis (Blogs) Section */}
          <div className="my-16 mt-16">
            <h2 className="text-3xl font-extrabold text-gray-900 relative pl-5 mb-10 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-10 before:bg-blue-600 before:rounded-full">Featured Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredBlogs.length > 0 ? featuredBlogs.map(blog => (
                <Link key={blog.id} to={`/blogs/${blog.slug}`} className="group">
                  <article className="bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row h-full border border-gray-100">
                    {blog.thumbnail_url ? (
                      <div className="w-full h-48 md:w-64 md:h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={blog.thumbnail_url}
                          alt={blog.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 md:w-64 md:h-auto flex-shrink-0 bg-blue-100 flex items-center justify-center p-8">
                        <Users className="h-16 w-16 text-blue-400 opacity-70" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between p-6">
                      <div>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
                          {blog.category}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                          {blog.title}
                        </h3>
                        <p className="text-gray-700 text-base mb-4 line-clamp-3 leading-relaxed">
                          {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-auto">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" /> {format(new Date(blog.created_at), 'MMM dd, yyyy')}
                        <span className="ml-auto text-blue-600 font-semibold flex items-center">
                          Read More <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )) : (
                <div className="md:col-span-2 text-center py-10 text-gray-500 text-lg">No featured analysis available.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-10 relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-10 before:bg-blue-600 before:rounded-full">Deep Dive Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featurePosts.length > 0 ? featurePosts.map(post => (
              <Link key={post.id} to={`/features/${post.slug}`} className="block group">
                <article className="bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                  {post.thumbnail_url ? (
                    <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-blue-100 flex items-center justify-center">
                      <span className="text-4xl text-blue-400">★</span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between p-5">
                    <div>
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-auto">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" /> {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      <span className="ml-auto text-blue-600 font-semibold flex items-center">
                        Read More <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-10 text-gray-500 text-lg">No feature posts available.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};