import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  Trophy,
  ChevronRight,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { SEOHead } from "../components/seo/SEOHead";
import { format } from "date-fns";
import { fetchOptimizedPosts, OptimizedPost } from "../lib/optimizedQueries";

interface Post extends OptimizedPost {}

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
  }, [searchParams]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const search = searchParams.get("search");
      const category = searchParams.get("category");

      const data = await fetchOptimizedPosts(
        "news",
        50,
        category || undefined,
        search || undefined
      );
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
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
        title="Cricket News - Latest Updates & Breaking Stories | CricNews"
        description="Stay updated with the latest cricket news, breaking stories, and match updates from around the world. Your trusted source for international cricket, IPL, and domestic cricket news."
        keywords="cricket news, breaking cricket news, IPL news, international cricket, Test cricket, ODI news, T20 news, cricket updates"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Newspaper className="h-16 w-16 text-blue-200" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                Cricket News
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Stay updated with the latest cricket news, breaking stories, and
                match updates from around the world
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All News
                </button>
                {predefinedCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="h-48 bg-gray-100 overflow-hidden relative">
                        {article.thumbnail_url ? (
                          <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <TrendingUp className="h-12 w-12 text-blue-400" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {article.excerpt || "No description available"}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(
                              new Date(article.created_at),
                              "MMM dd, yyyy"
                            )}
                          </div>
                          <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800">
                            Read More
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No news found
                </h3>
                <p className="text-gray-500">
                  {searchParams.get("search") || searchParams.get("category")
                    ? "Try adjusting your search criteria"
                    : "Check back later for the latest cricket news"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
