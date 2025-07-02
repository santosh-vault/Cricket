import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, Tag, Trophy } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

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

interface Fixture {
  id: string;
  match_id: string;
  team1: string;
  team2: string;
  venue: string;
  match_date: string;
  status: 'upcoming' | 'live' | 'completed';
  tournament: string;
  score?: string;
}

const demoFixtures: Fixture[] = [
  {
    id: '1',
    match_id: 'match1',
    team1: 'India',
    team2: 'Australia',
    venue: 'Wankhede Stadium, Mumbai',
    match_date: new Date(Date.now() + 86400000).toISOString(),
    status: 'upcoming',
    tournament: 'ICC World Cup',
    score: 'IND 250/7 (50) vs AUS 245/9 (50)',
  },
  {
    id: '2',
    match_id: 'match2',
    team1: 'England',
    team2: 'Pakistan',
    venue: 'Lords, London',
    match_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'upcoming',
    tournament: 'ICC World Cup',
    score: 'ENG 180/3 (35) vs PAK 178/10 (40)',
  },
  {
    id: '3',
    match_id: 'match3',
    team1: 'South Africa',
    team2: 'New Zealand',
    venue: 'Eden Park, Auckland',
    match_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: 'live',
    tournament: 'Champions Trophy',
    score: 'SA 120/2 (20) vs NZ 119/8 (20)',
  },
  {
    id: '4',
    match_id: 'match4',
    team1: 'Sri Lanka',
    team2: 'Bangladesh',
    venue: 'R. Premadasa Stadium, Colombo',
    match_date: new Date(Date.now() + 4 * 86400000).toISOString(),
    status: 'upcoming',
    tournament: 'Asia Cup',
    score: 'SL 300/6 (50) vs BAN 299/9 (50)',
  },
  {
    id: '5',
    match_id: 'match5',
    team1: 'West Indies',
    team2: 'Afghanistan',
    venue: 'Kensington Oval, Barbados',
    match_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: 'upcoming',
    tournament: 'T20 Series',
    score: 'WI 150/5 (18) vs AFG 149/8 (20)',
  },
];

export const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [categories, setCategories] = useState<string[]>([]);

  const predefinedCategories = [
    'International',
    'Domestic',
    'IPL',
    'T20 World Cup',
    'ODI World Cup',
    'Test Cricket',
    'Women\'s Cricket',
    'U19 Cricket'
  ];

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [searchParams]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('type', 'news')
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
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select('category')
        .eq('type', 'news')
        .eq('is_published', true);

      const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        title="Cricket News"
        description="Stay updated with the latest cricket news, breaking stories, match reports, and exclusive interviews from the world of cricket."
        keywords="cricket news, cricket updates, match reports, cricket interviews, cricket analysis"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Fixture Cards Section */}
        <section className="py-6 bg-gradient-to-br from-green-50 to-green-100 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 overflow-x-auto pb-2">
              {demoFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="min-w-[260px] bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 flex-shrink-0"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      fixture.status === 'live'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {fixture.status === 'live' ? 'LIVE' : 'UPCOMING'}
                    </span>
                    <span className="text-xs text-gray-500">{fixture.tournament}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{fixture.team1}</span>
                    <span className="text-gray-500 mx-2">vs</span>
                    <span className="font-semibold text-gray-900">{fixture.team2}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{fixture.venue}</p>
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                    <span>{format(new Date(fixture.match_date), 'MMM dd, yyyy')}</span>
                    <span>{format(new Date(fixture.match_date), 'hh:mm a')}</span>
                  </div>
                  {fixture.score && (
                    <div className="text-green-700 font-bold text-xs bg-green-50 rounded px-2 py-1 mb-1 text-center">
                      {fixture.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Header Section */}
        <section className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cricket News</h2>
            {/* Search and Filter Section (compact) */}
            <div className="flex flex-col lg:flex-row gap-2 items-center">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cricket news..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </form>
              <div className="flex items-center space-x-1">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="">All Categories</option>
                  {predefinedCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        {/* News and Sidebar Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
            {/* Main News (75%) - left side */}
            <div className="w-full md:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-green-600"></div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">No news found</h3>
                  <p className="text-gray-600 text-sm">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {news.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full flex flex-row"
                    >
                      {/* Left: Image */}
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {article.thumbnail_url ? (
                          <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <Trophy className="h-8 w-8 mx-auto mb-2" />
                            <p>Cricket News</p>
                          </div>
                        )}
                      </div>
                      {/* Right: Text content */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                              {article.category}
                            </span>
                            <span>{format(new Date(article.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                            {article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                          </p>
                        </div>
                        <Link
                          to={`/news/${article.slug}`}
                          className="text-green-600 hover:text-green-700 font-semibold text-xs transition-colors duration-200 mt-2"
                        >
                          Read Full Story →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
            {/* Most Read News (25%) - right side */}
            <aside className="w-full md:w-1/4">
              <h3 className="text-base font-bold text-green-900 mb-4">Most Read News</h3>
              <div className="flex flex-col gap-4">
                {news.slice(0, 5).map((article) => (
                  <div
                    key={article.id}
                    className="bg-green-50 border border-green-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-3 flex flex-col justify-between"
                  >
                    <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                      <Link to={`/news/${article.slug}`} className="hover:underline">
                        {article.title.length > 60 ? article.title.slice(0, 57) + '...' : article.title}
                      </Link>
                    </h4>
                    <span className="text-xs text-gray-500 mb-1">{format(new Date(article.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
};