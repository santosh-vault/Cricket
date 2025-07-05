import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

// Interface for Rank remains the same
interface RankingItem {
  id: string;
  rank: number;
  format: 'test' | 'odi' | 't20';
  category: 'team';
  team_name: string | null;
  flag_emoji: string | null;
  rating: number;
  // Add any other fields you might have in your icc_rankings table
}

const categories = ['team'] as const;

export const Ranking: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'team'>('team');
  const [allRankings, setAllRankings] = useState<Record<'test' | 'odi' | 't20', RankingItem[]>>({
    test: [],
    odi: [],
    t20: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRankings();
  }, [selectedCategory]); // Fetch all formats when category changes

  async function fetchAllRankings() {
    setLoading(true);
    const formatsToFetch = ['test', 'odi', 't20'];
    const newRankings: Record<'test' | 'odi' | 't20', RankingItem[]> = {
      test: [],
      odi: [],
      t20: [],
    };

    try {
      const promises = formatsToFetch.map(async (format) => {
        const { data, error } = await supabase
          .from('icc_rankings')
          .select('*')
          .eq('format', format)
          .eq('category', selectedCategory)
          .order('rank', { ascending: true })
          .limit(10); // Limit to top 10 for each column to keep it concise

        if (error) {
          console.error(`Error fetching ${format} rankings:`, error.message);
          return { format, data: [] };
        }
        return { format, data: data || [] };
      });

      const results = await Promise.all(promises);

      results.forEach(({ format, data }) => {
        newRankings[format as 'test' | 'odi' | 't20'] = data as RankingItem[];
      });

      setAllRankings(newRankings);
    } catch (error) {
      console.error('Error fetching all rankings:', error);
    } finally {
      setLoading(false);
    }
  }

  // Define custom-scrollbar and animate-bounce-slow in your global CSS (e.g., globals.css)
  // .custom-scrollbar::-webkit-scrollbar { width: 8px; }
  // .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  // .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  // .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  // .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  // .scrollbar-hide::-webkit-scrollbar { display: none; }
  // @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  // .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }

  return (
    <>
      <SEOHead
        title="ICC Cricket Rankings - CricNews"
        description="Explore the latest official ICC cricket rankings for teams, batters, bowlers, and allrounders across Test, ODI, and T20 formats. Stay updated with the best in international cricket."
        keywords="ICC rankings, cricket rankings, team rankings, player rankings, test, odi, t20, batters, bowlers, allrounders, live rankings"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans py-20 px-4 sm:px-6 lg:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col text-gray-900 border border-gray-100">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-10 flex flex-col sm:flex-row items-center justify-center text-center">
              <Trophy className="h-10 w-10 sm:h-12 sm:w-12 mr-0 sm:mr-4 text-yellow-500 animate-bounce-slow mb-4 sm:mb-0" />
              ICC Cricket Rankings
            </h1>

            {/* Team Rankings Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-blue-700">Team Rankings</h2>
              <p className="text-gray-600 mt-2">Official ICC team rankings across all formats</p>
            </div>

            {/* Three Columns for Formats */}
            {loading ? (
              <div className="text-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-5"></div>
                <p className="text-xl font-medium">Loading all formats for {selectedCategory} rankings...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {['test', 'odi', 't20'].map(format => (
                  <div key={format} className="flex flex-col bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center border-b pb-3 border-blue-200">
                      {format.toUpperCase()} Rankings
                    </h2>
                    <div className="flex-grow divide-y divide-gray-100 custom-scrollbar max-h-[500px] overflow-y-auto">
                      {allRankings[format as 'test' | 'odi' | 't20'].length > 0 ? (
                        allRankings[format as 'test' | 'odi' | 't20'].map((row: RankingItem) => (
                          <div key={row.id} className="flex items-center py-3 text-base justify-between hover:bg-blue-100 rounded-md px-2 -mx-2 transition-colors duration-200">
                            <span className="w-8 text-gray-700 font-bold text-lg">{row.rank}.</span>
                            {row.flag_emoji && <span className="w-8 h-8 flex items-center justify-center text-xl mr-3 flex-shrink-0">{row.flag_emoji}</span>}
                            <span className="flex-1 text-gray-900 font-semibold truncate mr-2">{row.team_name}</span>
                            <span className="font-bold text-blue-700 text-lg">{row.rating}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-10 text-md">No {selectedCategory} rankings available for {format.toUpperCase()}.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

           
          </div>
        </div>
      </div>
    </>
  );
};