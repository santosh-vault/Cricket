import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Image, Tag, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

interface PostFormData {
  title: string;
  content: string;
  category: string;
  tags: string;
  thumbnail_url: string;
  is_published: boolean;
  type: 'news' | 'blog' | 'feature';
}

interface PostEditorProps {
  type: 'news' | 'blog' | 'feature';
  onSave: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ type: initialType, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(id);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PostFormData>({
    defaultValues: {
      title: '',
      content: '',
      category: '',
      tags: '',
      thumbnail_url: '',
      is_published: false,
      type: initialType || 'news',
    }
  });

  const type = watch('type');
  const title = watch('title');

  const categories = type === 'news' 
    ? ['International', 'Domestic', 'IPL', 'T20 World Cup', 'ODI World Cup', 'Test Cricket', 'Women\'s Cricket', 'U19 Cricket']
    : type === 'blog'
    ? ['Analysis', 'Opinion', 'Player Profiles', 'Match Analysis', 'Statistics', 'History', 'Coaching Tips', 'Fantasy Cricket']
    : ['Exclusive', 'Spotlight', 'Interviews', 'Behind the Scenes', 'Special Reports', 'Features', 'Stories', 'Editorial'];

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchPost = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setValue('title', data.title);
      setValue('content', data.content);
      setValue('category', data.category);
      setValue('tags', data.tags?.join(', ') || '');
      setValue('thumbnail_url', data.thumbnail_url || '');
      setValue('is_published', data.is_published);
      setValue('type', data.type || 'news');
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
      navigate(`/admin/${type}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    if (!window.confirm('Are you sure you want to save this post?')) return;
    if (!user) return;

    setSaving(true);
    try {
      const slug = generateSlug(data.title);
      const tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const postData = {
        title: data.title,
        slug,
        content: data.content,
        category: data.category,
        type: data.type,
        tags,
        thumbnail_url: data.thumbnail_url || null,
        is_published: data.is_published,
        author_id: user.id,
        updated_at: new Date().toISOString(),
        ...(data.is_published && { published_at: new Date().toISOString() }),
      };

      let error;
      if (isEditing) {
        ({ error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('posts')
          .insert({
            ...postData,
            created_at: new Date().toISOString(),
          }));
      }

      if (error) throw error;

      onSave();
      if (data.type === 'blog') {
        navigate('/admin/blogs');
      } else if (data.type === 'feature') {
        navigate('/admin/features');
      } else {
        navigate('/admin/news');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log('Uploading image to Supabase storage...');
      const { data, error } = await supabase.storage.from('post-images').upload(fileName, file);
      
      if (error) {
        console.error('Supabase storage error:', error);
        
        // If bucket doesn't exist, try to create it or use a different approach
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          alert('Storage bucket not configured. Please contact administrator to set up image storage.');
          return;
        }
        
        throw error;
      }
      
      console.log('Image uploaded successfully:', data);
      
      // Get the public URL
      const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
      const publicURL = urlData.publicUrl;
      
      console.log('Public URL:', publicURL);
      setValue('thumbnail_url', publicURL);
      
    } catch (error) {
      console.error('Image upload error:', error);
      alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/admin/${type}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {type === 'news' ? 'News' : type === 'blog' ? 'Blogs' : 'Features'}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit' : 'Create'} {type === 'news' ? 'News Article' : type === 'blog' ? 'Blog Post' : 'Feature'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="news">News</option>
                  <option value="blog">Blog</option>
                  <option value="feature">Feature</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter post title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
                {title && (
                  <p className="mt-1 text-sm text-gray-500">
                    Slug: {generateSlug(title)}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Write your content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Publishing
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('is_published')}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="cricket, ipl, world cup (comma separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separate tags with commas
                </p>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">News Image</label>
                
                {/* File Upload */}
                <div className="mb-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                  />
                  {uploading && <p className="text-green-600 text-sm mt-2">Uploading...</p>}
                </div>
                
                {/* OR Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>
                
                {/* External URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={watch('thumbnail_url') || ''}
                    onChange={(e) => setValue('thumbnail_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a direct link to an image (optional)
                  </p>
                </div>
                
                {/* Image Preview */}
                {watch('thumbnail_url') && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img 
                      src={watch('thumbnail_url')} 
                      alt="Preview" 
                      className="rounded-lg max-h-40 border object-cover w-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        alert('Failed to load image preview. Please check the URL.');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/admin/${type}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </Link>
          <div className="flex space-x-3">
            {title && (
              <Link
                to={`/${type}/${generateSlug(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};