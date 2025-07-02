import React, { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

const API_URL = 'https://your-api-url.com?apikey=YOUR_API_KEY'; // <-- Replace with your real API URL

export const Fixtures: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMatches(data.data || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div></div>;

  return (
    <>
      <SEOHead
        title="Cricket Fixtures"
        description="Check upcoming cricket matches, live games, and completed fixtures. Stay updated with match schedules, venues, and tournament information."
        keywords="cricket fixtures, cricket schedule, upcoming matches, live cricket, cricket calendar"
      />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-green-900 mb-1">Cricket Fixtures</h2>
              <p className="text-sm text-gray-600">Upcoming matches, live games, and tournament schedules</p>
            </div>
            <div className="w-full md:w-1/3 flex justify-end">
              <img src="/public/fixtures-banner.jpg" alt="Cricket Fixtures Banner" className="h-20 w-full object-cover rounded-lg shadow" />
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-y-auto max-h-[70vh] space-y-4 pr-2">
              {matches.length === 0 ? (
                <div className="text-center text-gray-500">No fixtures found.</div>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {match.matchType?.toUpperCase() || 'MATCH'}
                            </span>
                            <span className="text-sm text-gray-600 font-medium">{match.name}</span>
                          </div>
                          <div className="mb-4">
                            <div className="flex items-center justify-center space-x-6 text-center">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{match.teams?.[0]}</h3>
                              </div>
                              <div className="px-4">
                                <span className="text-2xl font-bold text-gray-400">vs</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{match.teams?.[1]}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{match.dateTimeGMT || match.date}</span>
                            </div>
                            <div className="flex items-center md:col-span-2">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                          {match.status && (
                            <div className="mt-2 text-green-700 font-bold text-xs bg-green-50 rounded px-2 py-1 inline-block">
                              {match.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};