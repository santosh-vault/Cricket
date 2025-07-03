import React, { useState, useEffect } from 'react';
import { FileText, BookOpen, Calendar, Trophy, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Link } from 'react-router-dom';

interface Stats {
  totalNews: number;
  totalBlogs: number;
  totalFixtures: number;
  liveMatches: number;
}

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    totalBlogs: 0,
    totalFixtures: 0,
    liveMatches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsResult, blogsResult, fixturesResult, liveResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'news'),
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'blog'),
        supabase.from('fixtures').select('id', { count: 'exact' }),
        supabase.from('fixtures').select('id', { count: 'exact' }).eq('status', 'live'),
      ]);

      setStats({
        totalNews: newsResult.count || 0,
        totalBlogs: blogsResult.count || 0,
        totalFixtures: fixturesResult.count || 0,
        liveMatches: liveResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total News Articles',
      value: stats.totalNews,
      icon: FileText,
      color: 'bg-green-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Blog Posts',
      value: stats.totalBlogs,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Total Fixtures',
      value: stats.totalFixtures,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: '+3%',
      changeType: 'increase',
    },
    {
      name: 'Live Matches',
      value: stats.liveMatches,
      icon: Trophy,
      color: 'bg-red-500',
      change: '0',
      changeType: 'neutral',
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-300 rounded"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Section */}
   

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-md bg-blue-500`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-blue-900">{item.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold text-blue-700`}>
                        {item.changeType === 'increase' && <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1" />}
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
      <div className="bg-white shadow rounded-lg font-sans">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-blue-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/admin/news/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors duration-200 block">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-medium text-blue-900">Create News Article</h4>
              <p className="text-xs text-blue-700">Add new cricket news</p>
            </Link>
            <Link to="/admin/blogs/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors duration-200 block">
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-medium text-blue-900">Write Blog Post</h4>
              <p className="text-xs text-blue-700">Create analysis content</p>
            </Link>
            <Link to="/admin/fixtures/new" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors duration-200 block">
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-medium text-blue-900">Add Fixture</h4>
              <p className="text-xs text-blue-700">Schedule new match</p>
            </Link>
            <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors duration-200 block cursor-not-allowed" disabled>
              <Trophy className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-medium text-blue-900">Update Scorecard</h4>
              <p className="text-xs text-blue-700">Manage live scores</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg font-sans">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-blue-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <FileText className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-blue-700">
                          Published <span className="font-medium text-blue-900">new cricket article</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-blue-700">
                        <time>2 hours ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Calendar className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-blue-700">
                          Added <span className="font-medium text-blue-900">new fixture</span> for upcoming match
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-blue-700">
                        <time>5 hours ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Trophy className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-blue-700">
                          Updated <span className="font-medium text-blue-900">live scorecard</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-blue-700">
                        <time>1 day ago</time>
                      </div>
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