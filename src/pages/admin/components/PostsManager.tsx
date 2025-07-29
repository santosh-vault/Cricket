import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Calendar, Tag } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { PostEditor } from "./PostEditor";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  type: "news" | "blog" | "feature";
  tags: string[];
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PostsManagerProps {
  type: "news" | "blog" | "feature";
}

export const PostsManager: React.FC<PostsManagerProps> = ({ type }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [type]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) throw error;
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    if (
      !confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)
    )
      return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .in("id", selectedPosts);

      if (error) throw error;
      setPosts(posts.filter((post) => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
    } catch (error) {
      console.error("Error deleting posts:", error);
      alert("Failed to delete posts");
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;

      setPosts(
        posts.map((post) =>
          post.id === id ? { ...post, is_published: !currentStatus } : post
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
      alert("Failed to update post status");
    }
  };

  const PostsList = () => (
    <div className="space-y-6 font-sans admin-panel">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 font-sans">
            {type === "news"
              ? "News Articles"
              : type === "blog"
              ? "Features"
              : "Analysis"}
          </h2>
          <p className="text-blue-700 font-sans">
            Manage your{" "}
            {type === "news"
              ? "news articles"
              : type === "blog"
              ? "features"
              : "analysis"}
          </p>
        </div>
        <Link
          to={`/admin/${type}/new`}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200 flex items-center font-sans"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add{" "}
          {type === "news" ? "News" : type === "blog" ? "Feature" : "Analysis"}
        </Link>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 font-sans">
              {selectedPosts.length} posts selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-200 font-sans"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {loading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center font-sans">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-blue-700 font-sans">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center font-sans">
          <p className="text-blue-700 font-sans">
            No{" "}
            {type === "news"
              ? "news"
              : type === "blog"
              ? "feature"
              : "analysis"}{" "}
            posts found.
          </p>
          <Link
            to={`/admin/${type}/new`}
            className="mt-4 inline-block bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200 font-sans"
          >
            Create your first{" "}
            {type === "news"
              ? "news"
              : type === "blog"
              ? "feature"
              : "analysis"}{" "}
            post
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg font-sans">
          <table className="min-w-full divide-y divide-blue-200 font-sans">
            <thead className="bg-blue-50 font-sans">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider font-sans">
                  <input
                    type="checkbox"
                    className="rounded border-blue-300 text-blue-900 focus:ring-blue-500 font-sans"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPosts(posts.map((post) => post.id));
                      } else {
                        setSelectedPosts([]);
                      }
                    }}
                    checked={
                      selectedPosts.length === posts.length && posts.length > 0
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider font-sans">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider font-sans">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider font-sans">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider font-sans">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider font-sans">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={selectedPosts.includes(post.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPosts([...selectedPosts, post.id]);
                        } else {
                          setSelectedPosts(
                            selectedPosts.filter((id) => id !== post.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {post.thumbnail_url ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={post.thumbnail_url}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePublish(post.id, post.is_published)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(post.created_at), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/${type}/${post.slug}`}
                        className="text-gray-400 hover:text-gray-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/${type}/${post.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <Routes>
      <Route index element={<PostsList />} />
      <Route
        path="new"
        element={<PostEditor type={type} onSave={fetchPosts} />}
      />
      <Route
        path=":id/edit"
        element={<PostEditor type={type} onSave={fetchPosts} />}
      />
    </Routes>
  );
};
