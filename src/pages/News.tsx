import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  Tag,
  Trophy,
  ChevronRight,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { SEOHead } from "../components/seo/SEOHead";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

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

export const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [categories, setCategories] = useState<string[]>([]);

  const predefinedCategories = [
    "International",
    "Domestic",
    "IPL",
    "T20 World Cup",
    "ODI World Cup",
    "Test Cricket",
    "Women's Cricket",
    "U19 Cricket",
  ];

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [searchParams]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("type", "news")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      const search = searchParams.get("search");
      const category = searchParams.get("category");

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from("posts")
        .select("category")
        .eq("type", "news")
        .eq("is_published", true);

      const uniqueCategories = [
        ...new Set(data?.map((item) => item.category) || []),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
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

      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Header Section with Search and Filter */}
        <section className="bg-gray-50 pt-6 pb-2 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              News & Updates
            </h2>
          </div>
        </section>

        {/* News and Sidebar Section */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
            {/* Main News (75%) - left side */}
            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl">
                  <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
                  <p className="ml-4 text-xl text-blue-700 font-semibold mt-4">
                    Loading the latest cricket headlines...
                  </p>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl p-8">
                  <Trophy className="h-20 w-20 text-blue-400 mx-auto mb-6 opacity-70" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No News Found!
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    It seems your search or filter criteria didn't match any
                    articles. Try broadening your search or selecting a
                    different category.
                  </p>
                  {searchQuery || selectedCategory ? (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                        setSearchParams({});
                      }}
                      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
                    >
                      Reset Filters
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {news.map((article) => (
                    <Link
                      key={article.id}
                      to={`/news/${article.slug}`}
                      className="block group"
                    >
                      <article className="bg-white rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                        {/* Image */}
                        <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                          {article.thumbnail_url ? (
                            <img
                              src={article.thumbnail_url}
                              alt={article.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-blue-400 text-center p-6 opacity-70">
                              <Newspaper className="h-16 w-16 mx-auto mb-3" />
                              <p className="text-lg font-medium">No Image</p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <span className="absolute bottom-4 left-6 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            {article.category}
                          </span>
                        </div>
                        {/* Text content */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                              {article.title}
                            </h3>
                            <p className="text-gray-700 text-base mb-4 line-clamp-3 leading-relaxed">
                              {article.content
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 180)}
                              ...
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />{" "}
                              {format(
                                new Date(article.created_at),
                                "MMM dd, yyyy"
                              )}
                            </span>
                            <span className="text-blue-600 font-semibold flex items-center group-hover:text-blue-800 read-more">
                              Read More{" "}
                              <ChevronRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Most Read News (25%) - right side */}
            <aside className="w-full lg:w-1/4">
              <div className="bg-white rounded-xl p-6 sticky top-28 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-red-500" /> Most Read
                </h3>
                <div className="flex flex-col divide-y divide-gray-100">
                  {/*
                    This section currently uses 'news.slice(0, 5)' as a placeholder for "Most Read".
                    In a real application, you'd fetch a separate list of truly most-read articles
                    from your backend here.
                  */}
                  {news.slice(0, 5).map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/news/${article.slug}`}
                      className="block py-3 group"
                    >
                      <h4 className="font-semibold text-base text-gray-800 mb-1 leading-snug line-clamp-3 group-hover:text-blue-700 transition-colors duration-200">
                        <span className="text-blue-500 mr-2 font-bold">
                          {index + 1}.
                        </span>{" "}
                        {article.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>
                          {format(new Date(article.created_at), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    to="/most-read"
                    className="mt-4 block text-blue-600 text-sm font-semibold hover:underline flex items-center justify-center pt-3"
                  >
                    View More <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
};

// Add custom animation to your global CSS or a dedicated styles file (e.g., globals.css)
/*
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}
*/
