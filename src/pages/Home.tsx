import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Trophy, ChevronRight } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { FixturesList } from '../components/fixtures/FixturesList';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useFixtures } from '../hooks/useFixtures';
import ReactCountryFlag from 'react-country-flag';

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

// ICC Rankings Card Component
const formats = ['test', 'odi', 't20'] as const;
const categories = ['team'] as const;

function ICCRankingsCard() {
  const [selectedFormat, setSelectedFormat] = useState<'test' | 'odi' | 't20'>('test');
  const [selectedCategory] = useState<'team'>('team'); // Removed setSelectedCategory as it's not used for player/bowler/all-rounder
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRankings();
  }, [selectedFormat, selectedCategory]);

  async function fetchRankings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('icc_rankings')
      .select('*')
      .eq('format', selectedFormat)
      .eq('category', selectedCategory)
      .order('rank', { ascending: true });

    if (error) {
      console.error("Error fetching ICC rankings:", error.message);
      setRankings([]);
    } else {
      setRankings(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl px-6 pt-6 pb-0 flex flex-col text-gray-900 border border-gray-100">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center">
        <Trophy className="h-6 w-6 mr-3 text-yellow-500" /> ICC Rankings
      </h3>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 -mx-2 px-2">
        {formats.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFormat(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out whitespace-nowrap
              ${selectedFormat === f
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }`}
          >
            {f === 't20' ? 'T20I' : f === 'test' ? 'Test' : f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-100 mb-4 min-h-[250px] flex-grow overflow-y-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
            Loading Rankings...
          </div>
        ) : rankings.length > 0 ? (
          <>
            {rankings.slice(0, 7).map(row => (
              <div key={row.id} className="flex items-center py-3 text-base justify-between group">
                <span className="w-8 text-gray-600 font-bold">{row.rank}.</span>
                {(() => {
                  const name = row.team_name.toLowerCase();
                  if (name.includes('england')) {
                    return <img src="/flags/england.svg" alt="England flag" style={{ width: '1.5em', height: '1.5em', marginRight: '0.75em', borderRadius: '0.25em', verticalAlign: 'middle' }} className="flex-shrink-0" />;
                  }
                  if (name.includes('scotland')) {
                    return <img src="/flags/scotland.svg" alt="Scotland flag" style={{ width: '1.5em', height: '1.5em', marginRight: '0.75em', borderRadius: '0.25em', verticalAlign: 'middle' }} className="flex-shrink-0" />;
                  }
                  if (name.includes('west indies')) {
                    return <img src="/flags/westindies.svg" alt="West Indies flag" style={{ width: '1.5em', height: '1.5em', marginRight: '0.75em', borderRadius: '0.25em', verticalAlign: 'middle' }} className="flex-shrink-0" />;
                  }
                  if (row.flag_emoji) {
                    return (
                      <ReactCountryFlag
                        countryCode={row.flag_emoji}
                        svg
                        style={{ width: '1.5em', height: '1.5em', marginRight: '0.75em', borderRadius: '0.25em', verticalAlign: 'middle' }}
                        title={row.team_name}
                        className="flex-shrink-0"
                      />
                    );
                  }
                  return (
                    <span style={{ width: '1.5em', height: '1.5em', marginRight: '0.75em', fontSize: '1.5em', display: 'inline-block', textAlign: 'center', verticalAlign: 'middle' }} className="flex-shrink-0">🏏</span>
                  );
                })()}
                <span className="flex-1 text-gray-800 font-medium text-lg group-hover:text-blue-700 transition-colors duration-200">{row.team_name}</span>
                <span className="font-bold text-blue-700 text-lg">{row.rating}</span>
              </div>
            ))}
            {rankings.length > 7 && (
              <Link to="/ranking" className="block w-full mt-2 py-2 text-center bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors duration-200 show-all-rankings flex items-center justify-center">
                Show All Rankings <ChevronRight className="h-4 w-4 ml-1" />
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
  const [unifiedFeed, setUnifiedFeed] = useState<Post[]>([]);
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useFixtures(5, true);

  useEffect(() => {
    fetchUnifiedFeed();
  }, []);

  const fetchUnifiedFeed = async () => {
    try {
      const { data: allPosts, error } = await supabase
        .from('posts')
        .select('*')
        .in('type', ['news', 'blog', 'feature'])
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching unified feed:', error.message);
        setUnifiedFeed([]);
      } else {
        setUnifiedFeed(allPosts || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching unified feed:', error);
      setUnifiedFeed([]);
    }
  };

  // Split into sections
  const section1 = unifiedFeed.slice(0, 3);
  const section2 = unifiedFeed.slice(3, 7);
  const section3 = unifiedFeed.slice(7, 15);

  if (fixturesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-bounce text-blue-600 text-xl font-semibold">Loading Cricket Data...</div>
      </div>
    );
  }

  // Card height for big card and ICC Rankings (adjust as needed for your ICC card)
  const bigCardMinH = 'min-h-[280px]';
  const smallCardMinH = 'min-h-[140px]';

  const renderImageOrPlaceholder = (thumbnail_url: string | null, title: string, placeholderClass: string, iconClass: string) => {
    return thumbnail_url ? (
      <img
        src={thumbnail_url}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
    ) : (
      <div className={`${placeholderClass} bg-gray-100 flex flex-col items-center justify-center text-blue-400`}>
        <TrendingUp className={`${iconClass} mx-auto mb-2 opacity-60`} />
        <p className="text-sm font-semibold text-gray-500">No Image</p>
      </div>
    );
  };

  return (
    <>
      <SEOHead
        title="Home - CricNews: Your Ultimate Cricket Companion"
        description="Stay updated with the latest cricket news, live scores, match fixtures, and expert analysis. Your one-stop destination for comprehensive cricket coverage from around the world."
        keywords="cricket news, live scores, cricket fixtures, cricket updates, IPL, international cricket, T20, ODI, Test, cricket analysis, player rankings"
      />

      {/* Live Fixtures Section */}
      {!fixturesLoading && !fixturesError && (
        <section className="py-2 bg-gray-50 border-b border-gray-100">
          <FixturesList
            limit={6}
            compact={true}
            showHeader={false}
            className="px-4 pt-2"
          />
        </section>
      )}

      {/* Unified Feed Sections */}
      <section className="pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-4 lg:pt-4">
          <div className="mb-16 flex flex-col lg:flex-row gap-8">
            {/* Main Content (Top Stories and More Highlights) */}
            <div className="w-full lg:w-3/4">
              {/* Section 1: Top 3 (1 big, 2 small) */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-7 bg-blue-600 rounded mr-4"></div>
                  <h2 className="text-3xl font-extrabold text-blue-900">Latest</h2>
                </div>
                {section1.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Big card */}
                    <div className={`md:col-span-2 flex flex-col h-full`}>
                      <Link to={`/${section1[0].type === 'news' ? 'news' : section1[0].type === 'blog' ? 'blogs' : 'features'}/${section1[0].slug}`} className="block group h-full">
                        <article className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100`}>
                          <div className="h-[360px] bg-gray-50 flex items-center justify-center overflow-hidden relative">
                            {renderImageOrPlaceholder(section1[0].thumbnail_url, section1[0].title, "h-[220px]", "h-16 w-16")}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-4 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                              {section1[0].category}
                            </span>
                            <span className="absolute top-4 right-4 bg-white/80 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                              {section1[0].type}
                            </span>
                          </div>
                          <div className="p-6 flex flex-col flex-1 justify-between">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                              {section1[0].title}
                            </h3>
                            <p className="text-gray-700 text-base mb-3 line-clamp-3 leading-relaxed">
                              {section1[0].content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                            <div className="flex justify-between items-center text-base text-gray-500 mt-auto">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" /> {format(new Date(section1[0].created_at), 'MMM dd, yyyy')}
                              </span>
                              <span className="text-blue-600 font-semibold flex items-center read-more group-hover:text-blue-800">
                                Read More <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>

                    <div className={`flex flex-col h-full gap-6`}>
                      {section1.slice(1).map((item, idx) => (
                        <Link key={item.id} to={`/${item.type === 'news' ? 'news' : item.type === 'blog' ? 'blogs' : 'features'}/${item.slug}`} className="block group h-1/2 flex-1">
                          <article className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 ${smallCardMinH}`}> 
                            <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                              {renderImageOrPlaceholder(item.thumbnail_url, item.title, "h-32", "h-8 w-8")}
                              <span className="absolute bottom-2 left-4 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                                {item.category}
                              </span>
                              <span className="absolute top-2 right-4 bg-white/80 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                                {item.type}
                              </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                                {item.title}
                              </h3>
                              <div className="flex items-center text-xs text-gray-500 mt-auto">
                                <Clock className="h-3 w-3 mr-1 text-gray-400" /> {format(new Date(item.created_at), 'MMM dd, yyyy')}
                                <span className="ml-auto text-blue-600 font-semibold flex items-center read-more group-hover:text-blue-800">
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
                  <div className="text-center py-10 text-gray-500 text-lg">No articles available at the moment.</div>
                )}
              </div>
            </div>
            {/* ICC Rankings Sidebar (right) */}
            <aside className="w-full lg:w-1/4 mt-14 hidden sm:block">
              <ICCRankingsCard />
            </aside>
          </div>

       {/* Section 2: Next 4 (2x2 grid, horizontal cards) */}
      <div className="mb-20 w-full">
       <div className="flex items-center mb-6">
         <div className="w-1 h-7 bg-blue-600 rounded mr-4"></div>
         <h2 className="text-3xl font-extrabold text-blue-900">Featured</h2>
       </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {section2.map((item) => (
      <Link key={item.id} to={`/${item.type === 'news' ? 'news' : item.type === 'blog' ? 'blogs' : 'features'}/${item.slug}`} className="block group">
        <article className="bg-white rounded-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-full border border-gray-100 min-h-[160px] sm:h-48">
          {/* Image on the left (on sm screens and up) / Top (on xs screens) */}
          <div className="w-full sm:w-56 h-40 sm:h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative flex-shrink-0">
            {renderImageOrPlaceholder(item.thumbnail_url, item.title, "h-full w-full object-cover", "h-16 w-16")}
            <span className="absolute bottom-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase z-10">
              {item.category}
            </span>
            <span className="absolute top-3 right-3 bg-white/80 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase z-10">
              {item.type}
            </span>
          </div>
          {/* Content on the right (on sm screens and up) / Bottom (on xs screens) */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-gray-700 text-base mb-3 line-clamp-2 leading-relaxed">
              {item.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-auto">
              <Clock className="h-3 w-3 mr-1 text-gray-400" /> {format(new Date(item.created_at), 'MMM dd, yyyy')}
              <span className="ml-auto text-blue-600 font-semibold flex items-center read-more group-hover:text-blue-800">
                Read More <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    ))}
  </div>
</div>

          {/* Section 3: Next 8 (2x4 grid, minimal cards) */}
          <div className="mb-8 w-full">
            <div className="flex items-center mb-6">
              <div className="w-1 h-7 bg-blue-600 rounded mr-4"></div>
              <h2 className="text-3xl font-extrabold text-blue-900">More stories</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {section3.slice(0, 8).map((item) => (
                <Link key={item.id} to={`/${item.type === 'news' ? 'news' : item.type === 'blog' ? 'blogs' : 'features'}/${item.slug}`} className="block group">
                  <article className="bg-white rounded-lg border border-gray-200 transition-all duration-200 overflow-hidden flex flex-col h-full min-h-[180px] p-3">
                    <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden relative rounded-md mb-3">
                      {renderImageOrPlaceholder(item.thumbnail_url, item.title, "h-full w-full object-cover", "h-10 w-10")}
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                        {item.category}
                      </span>
                      <span className="absolute top-2 right-2 bg-white/80 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2 line-clamp-2 leading-relaxed">
                      {item.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-auto">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" /> {format(new Date(item.created_at), 'MMM dd, yyyy')}
                      <span className="ml-auto text-blue-600 font-semibold flex items-center read-more group-hover:text-blue-800">
                        Read More <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="block sm:hidden mt-8 px-2">
        <ICCRankingsCard />
      </div>
    </>
  );
};