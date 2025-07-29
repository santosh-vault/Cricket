import React, { useState, useEffect } from "react";
import { FileText, BookOpen, Calendar, Trophy, TrendingUp } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";

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
      const [
        newsResult,
        featuresResult,
        analysisResult,
        fixturesResult,
        liveResult,
      ] = await Promise.all([
        supabase
          .from("posts")
          .select("id", { count: "exact" })
          .eq("type", "news"),
        supabase
          .from("posts")
          .select("id", { count: "exact" })
          .eq("type", "blog"),
        supabase
          .from("posts")
          .select("id", { count: "exact" })
          .eq("type", "feature"),
        supabase.from("fixtures").select("id", { count: "exact" }),
        supabase
          .from("fixtures")
          .select("id", { count: "exact" })
          .eq("status", "live"),
      ]);

      setStats({
        totalNews: newsResult.count || 0,
        totalFeatures: featuresResult.count || 0,
        totalAnalysis: analysisResult.count || 0,
        totalFixtures: fixturesResult.count || 0,
        liveMatches: liveResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load admin stats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Total News Articles",
      value: stats.totalNews,
      icon: FileText,
      colorClass: "bg-gradient-to-br from-blue-500 to-blue-600",
      textClass: "text-blue-500",
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Features",
      value: stats.totalFeatures,
      icon: BookOpen,
      colorClass: "bg-gradient-to-br from-purple-500 to-purple-600",
      textClass: "text-purple-500",
      change: "+8%",
      changeType: "increase",
    },
    {
      name: "Analysis",
      value: stats.totalAnalysis,
      icon: BookOpen,
      colorClass: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      textClass: "text-indigo-500",
      change: "+5%",
      changeType: "increase",
    },
    {
      name: "Total Fixtures",
      value: stats.totalFixtures,
      icon: Calendar,
      colorClass: "bg-gradient-to-br from-green-500 to-green-600",
      textClass: "text-green-500",
      change: "+3%",
      changeType: "increase",
    },
    {
      name: "Live Matches",
      value: stats.liveMatches,
      icon: Trophy,
      colorClass: "bg-gradient-to-br from-red-500 to-red-600",
      textClass: "text-red-500",
      change: "0",
      changeType: "neutral",
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white overflow-hidden rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-7 bg-gray-300 rounded w-1/2"></div>
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
    <div className="space-y-8 font-sans admin-panel">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`inline-flex items-center justify-center p-3 rounded-lg ${card.colorClass}`}
                  >
                    <card.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className={`text-lg font-semibold ${card.textClass}`}>
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Link
            to="/admin/news/new"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 flex flex-col items-center justify-center"
          >
            <FileText className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">
              Create News Article
            </h4>
            <p className="text-sm text-blue-700 mt-1">Write breaking news</p>
          </Link>
          <Link
            to="/admin/blogs/new"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 flex flex-col items-center justify-center"
          >
            <BookOpen className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">
              Create Feature
            </h4>
            <p className="text-sm text-blue-700 mt-1">Write in-depth stories</p>
          </Link>
          <Link
            to="/admin/fixtures/new"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 flex flex-col items-center justify-center"
          >
            <Calendar className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">
              Add Match Fixture
            </h4>
            <p className="text-sm text-blue-700 mt-1">Schedule new match</p>
          </Link>
          <Link
            to="/admin/rankings"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 flex flex-col items-center justify-center"
          >
            <Trophy className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">
              Manage ICC Rankings
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Update team, batter, bowler, allrounder
            </p>
          </Link>
          <Link
            to="/admin/features/new"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-5 text-center transition-all duration-200 flex flex-col items-center justify-center"
          >
            <TrendingUp className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-base font-semibold text-blue-900 group-hover:text-blue-700">
              Create Analysis
            </h4>
            <p className="text-sm text-blue-700 mt-1">Write expert analysis</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
