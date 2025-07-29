import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowLeft, Share2, BookOpen } from "lucide-react";
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
  updated_at: string;
  author_id: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail_url: string | null;
  created_at: string;
}

export const FeatureDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [recommended, setRecommended] = useState<
    {
      type: string;
      id: string;
      title: string;
      slug: string;
      category: string;
      thumbnail_url: string | null;
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchRecommended();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("type", "feature")
        .eq("is_published", true)
        .single();

      if (postError) {
        setError("Feature article not found");
        return;
      }

      setPost(postData);

      // Fetch related posts
      const { data: relatedData } = await supabase
        .from("posts")
        .select("id, title, slug, category, thumbnail_url, created_at")
        .eq("type", "feature")
        .eq("is_published", true)
        .eq("category", postData.category)
        .neq("id", postData.id)
        .limit(4);

      setRelatedPosts(relatedData || []);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load feature article");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const types = ["news", "blog", "feature"];
      let all: any[] = [];
      for (const type of types) {
        const { data } = await supabase
          .from("posts")
          .select("id, title, slug, category, thumbnail_url, created_at, type")
          .eq("type", type)
          .eq("is_published", true)
          .neq("slug", slug)
          .order("created_at", { ascending: false })
          .limit(2);
        if (data)
          all = all.concat(data.map((item: any) => ({ ...item, type })));
      }
      all.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecommended(all);
    } catch (e) {
      // fail silently
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.replace(/<[^>]*>/g, "").substring(0, 200),
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Feature Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/features"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Features
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.content.replace(/<[^>]*>/g, "").substring(0, 160)}
        keywords={post.tags.join(", ")}
        image={post.thumbnail_url || undefined}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        url={`/features/${post.slug}`}
      />

      <article className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
          {/* Main Content (left) */}
          <div className="w-full lg:w-2/3">
            {/* Header */}
            <header className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                  to="/features"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Features
                </Link>

                <div className="mb-6">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-normal">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {format(new Date(post.created_at), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <span>CricNews Feature Team</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.thumbnail_url && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="detail-content max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center mb-4">
                    <Tag className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-gray-700 font-semibold">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="bg-gray-50 py-16 mt-8 rounded-xl">
                <div className="">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Related Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <article
                        key={relatedPost.id}
                        className="bg-white rounded-lg overflow-hidden border border-blue-100"
                      >
                        <div className="h-32 bg-gray-200 flex items-center justify-center">
                          {relatedPost.thumbnail_url ? (
                            <img
                              src={relatedPost.thumbnail_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <Calendar className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Feature</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-blue-500 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                              {relatedPost.category}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3">
                            {format(
                              new Date(relatedPost.created_at),
                              "MMM dd, yyyy"
                            )}
                          </p>
                          <Link
                            to={`/features/${relatedPost.slug}`}
                            className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors duration-200 read-more"
                          >
                            Read More →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
          {/* Recommended Articles (right) */}
          {recommended.length > 0 && (
            <aside className="w-full lg:w-1/3 flex-shrink-0 mt-10 lg:mt-[40px]">
              <div className="bg-gray-50 rounded-xl p-4 sticky top-28 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Recommended Articles
                </h2>
                <div className="flex flex-col gap-4">
                  {recommended.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white rounded-lg overflow-hidden flex flex-row items-center min-h-[72px] border border-blue-100"
                    >
                      <div className="h-16 w-16 bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: "center",
                              borderRadius: 0,
                            }}
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <BookOpen className="h-6 w-6 mx-auto mb-1" />
                            <p className="text-xs capitalize">
                              {item.type === "news"
                                ? "News"
                                : item.type === "blog"
                                ? "Feature"
                                : "Analysis"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-2 flex-1 min-w-0">
                        <div className="text-xs text-blue-500 mb-1 truncate">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {format(new Date(item.created_at), "MMM dd, yyyy")}
                        </p>
                        <Link
                          to={`/${
                            item.type === "feature"
                              ? "features"
                              : item.type === "blog"
                              ? "blogs"
                              : "news"
                          }/${item.slug}`}
                          className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors duration-200 read-more"
                        >
                          Read More →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </article>
    </>
  );
};
