import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
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

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'news')
        .eq('is_published', true)
        .single();

      if (postError) {
        setError('News article not found');
        return;
      }

      setPost(postData);

      // Fetch related posts
      const { data: relatedData } = await supabase
        .from('posts')
        .select('id, title, slug, category, thumbnail_url, created_at')
        .eq('type', 'news')
        .eq('is_published', true)
        .eq('category', postData.category)
        .neq('id', postData.id)
        .limit(4);

      setRelatedPosts(relatedData || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load news article');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.replace(/<[^>]*>/g, '').substring(0, 200),
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">News Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/news"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        keywords={post.tags.join(', ')}
        image={post.thumbnail_url || undefined}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        url={`/news/${post.slug}`}
      />

      <article className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/news"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
            
            <div className="mb-6">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>CricNews Editorial Team</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
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
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
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
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200"
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
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
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
                          <p className="text-xs">News</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                          {relatedPost.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        {format(new Date(relatedPost.created_at), 'MMM dd, yyyy')}
                      </p>
                      <Link
                        to={`/news/${relatedPost.slug}`}
                        className="text-green-600 hover:text-green-700 text-xs font-semibold transition-colors duration-200"
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
      </article>
    </>
  );
};