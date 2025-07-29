import React, { useState, useEffect } from 'react';
import { FileText, BookOpen, Calendar, Trophy, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Link } from 'react-router-dom';

interface Stats {
  totalNews: number;
  totalFeatures: number;
  totalAnalysis: number;
  totalFixtures: number;
  liveMatches: number;
}

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    totalFeatures: 0,
    totalAnalysis: 0,
    totalFixtures: 0,
    liveMatches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using Promise.allSettled to ensure all promises resolve before setting state,
      // even if one fails. This prevents an unhandled promise rejection.
      const [newsResult, featuresResult, analysisResult, fixturesResult, liveResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'news'),
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'blog'),
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'feature'),
        supabase.from('fixtures').select('id', { count: 'exact' }),
        supabase.from('fixtures').select('id', { count: 'exact' }).eq('status', 'live'),
      ]);

      setStats({
        totalNews: newsResult.count || 0,
        totalFeatures: featuresResult.count || 0,
        totalAnalysis: analysisResult.count || 0,
        totalFixtures: fixturesResult.count || 0,
        liveMatches: liveResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load admin stats. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total News Articles',
      value: stats.totalNews,
      icon: FileText,
      colorClass: 'bg-gradient-to-br from-blue-500 to-blue-600', // Enhanced gradient color
      textClass: 'text-blue-500', // Text color for value
      change: '+12%', // Static for now, can be dynamic
      changeType: 'increase',
    },
    {
      name: 'Features',
      value: stats.totalFeatures,
      icon: BookOpen,
      colorClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textClass: 'text-purple-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Analysis',
      value: stats.totalAnalysis,
      icon: BookOpen,
      colorClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      textClass: 'text-indigo-500',
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Total Fixtures',
      value: stats.totalFixtures,
      icon: Calendar,
      colorClass: 'bg-gradient-to-br from-green-500 to-green-600',
      textClass: 'text-green-500',
      change: '+3%',
      changeType: 'increase',
    },
    },
    {
      name: 'Live Matches',
      value: stats.liveMatches,
      icon: Trophy,
      colorClass: 'bg-gradient-to-br from-red-500 to-red-600',
      textClass: 'text-red-500',
      change: '0',
      changeType: 'neutral',
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden rounded-xl shadow-md p-6"> {/* Larger padding, rounded corners */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div> {/* Larger, rounder placeholder */}
              </div>
              <div className="ml-4 w-0 flex-1"> {/* Adjusted margin */}
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div> {/* Larger placeholder */}
                <div className="h-7 bg-gray-300 rounded w-1/2"></div> {/* Larger placeholder */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-6 text-center mt-8">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 admin-panel"> {/* Added padding-bottom for overall spacing */}
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100"> {/* Softer shadow, rounded-xl */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back, Admin!</h2>
        <p className="text-lg text-gray-600">
          Here's a quick overview of your content and activity today ({new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}).
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"> {/* Increased gap, changed sm:grid-cols-2 lg:grid-cols-4 to make them stack better on smaller screens */}
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100"> {/* Rounded, shadow, hover effect */}
            <div className="p-6"> {/* Increased padding */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-full ${item.colorClass}`}> {/* Rounded-full, larger padding for icon background */}
                    <item.icon className="h-7 w-7 text-white" /> {/* Larger icon */}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt> {/* Changed to gray-500 */}
                    <dd className="flex items-baseline">
                      <div className={`text-3xl font-extrabold ${item.textClass}`}>{item.value}</div> {/* Larger, bold text, dynamic color */}
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'increase' ? 'text-green-600' :
                          item.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                        }`}> {/* Dynamic change color */}
                        {item.changeType === 'increase' && <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1 text-green-500" />}
                        {/* You can add TrendingDown icon for decrease if needed */}
                        <span className="sr-only">
                          {item.changeType === 'increase' ? 'Increased' : item.changeType === 'decrease' ? 'Decreased' : 'No change'} by
                        </span>
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100"> {/* Softer shadow, rounded-xl */}
        <div className="px-6 py-6 sm:p-8"> {/* Increased padding */}
          <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-6">Quick Actions</h3> {/* Larger title, more margin */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> {/* Increased gap */}
            <Link to="/admin/news/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 block group flex flex-col items-center justify-center"> {/* Increased padding, center align content, added flex */}
              <FileText className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" /> {/* Larger icon, hover scale */}
              <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">Create News Article</h4> {/* Stronger text */}
              <p className="text-sm text-blue-700 mt-1">Add new cricket news</p> {/* Slightly larger text */}
            </Link>
            <Link to="/admin/blogs/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 block group flex flex-col items-center justify-center">
              <BookOpen className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">Write Features Post</h4>
              <p className="text-sm text-blue-700 mt-1">Create analysis content</p>
            </Link>
            <Link to="/admin/fixtures/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 block group flex flex-col items-center justify-center">
              <Calendar className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">Add Fixture</h4>
              <p className="text-sm text-blue-700 mt-1">Schedule new match</p>
            </Link>
            <Link to="/admin/rankings" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 block group flex flex-col items-center justify-center">
              <Trophy className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">Manage ICC Rankings</h4>
              <p className="text-sm text-blue-700 mt-1">Update team, batter, bowler, allrounder</p>
            </Link>
            <Link to="/admin/features/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 block group flex flex-col items-center justify-center">
              <BookOpen className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">Create Feature</h4>
              <p className="text-sm text-blue-700 mt-1">Add exclusive cricket features</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100"> {/* Softer shadow, rounded-xl */}
        <div className="px-6 py-6 sm:p-8"> {/* Increased padding */}
          <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-6">Recent Activity</h3> {/* Larger title, more margin */}
          <div className="flow-root">
            <ul className="-mb-6 divide-y divide-gray-200"> {/* Added subtle divider */}
              <li className="py-4"> {/* Increased vertical padding */}
                <div className="relative flex items-start space-x-4"> {/* Used items-start for better alignment */}
                  <div className="relative">
                    <span className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white shadow-md"> {/* Larger ring, added shadow */}
                      <FileText className="h-5 w-5 text-white" /> {/* Larger icon */}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5 flex justify-between space-x-4"> {/* Adjusted vertical padding */}
                    <div>
                      <p className="text-base text-gray-700"> {/* Larger text */}
                        Published <span className="font-semibold text-gray-900">new cricket article</span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500"> {/* Changed text color */}
                      <time dateTime="2025-07-03T16:00:00Z">2 hours ago</time> {/* Added datetime for accessibility */}
                    </div>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="relative flex items-start space-x-4">
                  <div className="relative">
                    <span className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white shadow-md">
                      <Calendar className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-base text-gray-700">
                        Added <span className="font-semibold text-gray-900">new fixture</span> for upcoming match
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2025-07-03T13:00:00Z">5 hours ago</time>
                    </div>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="relative flex items-start space-x-4">
                  <div className="relative">
                    <span className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white shadow-md">
                      <Trophy className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-base text-gray-700">
                        Updated <span className="font-semibold text-gray-900">live scorecard</span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2025-07-02T10:00:00Z">1 day ago</time>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};