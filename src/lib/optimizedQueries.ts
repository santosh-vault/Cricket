import { supabase } from './supabase';

// Cache for storing frequently accessed data
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>();
  
  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void { // Default 5 minutes TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const dataCache = new DataCache();

// Optimized post fetching functions
export interface OptimizedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  type: 'news' | 'blog' | 'feature';
  thumbnail_url: string | null;
  created_at: string;
}

export interface FullPost extends OptimizedPost {
  content: string;
  tags: string[];
  author_id: string;
  updated_at: string;
  is_published: boolean;
}

// Fetch posts with minimal data for listing pages
export async function fetchOptimizedPosts(
  type?: 'news' | 'blog' | 'feature',
  limit = 20,
  category?: string,
  searchQuery?: string
): Promise<OptimizedPost[]> {
  const cacheKey = `posts:${type || 'all'}:${limit}:${category || 'all'}:${searchQuery || 'all'}`;
  
  // Check cache first
  const cached = dataCache.get<OptimizedPost[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // For now, always use the main posts table to avoid materialized view issues
    // TODO: Re-enable materialized view after fixing the concurrent refresh issue
    let data: any[] = [];
    let error: any = null;
    let useView = false; // Temporarily disabled
    
    // Temporarily commenting out materialized view usage due to concurrent refresh issues
    /*
    try {
      let viewQuery = supabase
        .from('post_summaries')
        .select('id, title, slug, excerpt, category, type, thumbnail_url, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type) {
        viewQuery = viewQuery.eq('type', type);
      }

      if (category) {
        viewQuery = viewQuery.eq('category', category);
      }

      if (searchQuery) {
        viewQuery = viewQuery.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const viewResult = await viewQuery;
      data = viewResult.data || [];
      error = viewResult.error;
    } catch (viewError) {
      console.log('Materialized view not available, using main table');
      useView = false;
    */
      
      // Use main posts table directly
      let tableQuery = supabase
        .from('posts')
        .select('id, title, slug, content, category, type, thumbnail_url, created_at, is_published')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type) {
        tableQuery = tableQuery.eq('type', type);
      }

      if (category) {
        tableQuery = tableQuery.eq('category', category);
      }

      if (searchQuery) {
        tableQuery = tableQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const tableResult = await tableQuery;
      data = tableResult.data || [];
      error = tableResult.error;
    // }

    if (error) throw error;

    const posts = data.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: useView ? post.excerpt : (post.content?.replace(/<[^>]*>/g, '').substring(0, 200) || ''),
      category: post.category,
      type: post.type,
      thumbnail_url: post.thumbnail_url,
      created_at: post.created_at
    }));

    // Cache the results for 3 minutes
    dataCache.set(cacheKey, posts, 3 * 60 * 1000);
    
    return posts;
  } catch (error) {
    console.error('Error fetching optimized posts:', error);
    return [];
  }
}

// Fetch full post content for detail pages
export async function fetchFullPost(slug: string): Promise<FullPost | null> {
  const cacheKey = `post:${slug}`;
  
  // Check cache first
  const cached = dataCache.get<FullPost>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    if (data) {
      const post: FullPost = {
        ...data,
        excerpt: data.content.replace(/<[^>]*>/g, '').substring(0, 200)
      };

      // Cache the full post for 10 minutes
      dataCache.set(cacheKey, post, 10 * 60 * 1000);
      
      return post;
    }

    return null;
  } catch (error) {
    console.error('Error fetching full post:', error);
    return null;
  }
}

// Optimized rankings fetching
export interface RankingItem {
  id: string;
  rank: number;
  format: 'test' | 'odi' | 't20';
  category: 'team' | 'batter' | 'bowler' | 'allrounder';
  team_name: string;
  player_name?: string | null;
  flag_emoji: string | null;
  rating: number;
  points?: number | null;
  matches?: number | null;
  updated_at: string;
}

export async function fetchOptimizedRankings(
  format: 'test' | 'odi' | 't20',
  category: 'team' | 'batter' | 'bowler' | 'allrounder',
  limit = 10
): Promise<RankingItem[]> {
  const cacheKey = `rankings:${format}:${category}:${limit}`;
  
  // Check cache first (rankings change less frequently, cache for 15 minutes)
  const cached = dataCache.get<RankingItem[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('icc_rankings')
      .select('*')
      .eq('format', format)
      .eq('category', category)
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) throw error;

    const rankings = data || [];
    
    // Cache rankings for 15 minutes
    dataCache.set(cacheKey, rankings, 15 * 60 * 1000);
    
    return rankings;
  } catch (error) {
    console.error('Error fetching optimized rankings:', error);
    return [];
  }
}

// Fetch all rankings for a category at once (more efficient than separate calls)
export async function fetchAllRankingsForCategory(
  category: 'team' | 'batter' | 'bowler' | 'allrounder'
): Promise<Record<'test' | 'odi' | 't20', RankingItem[]>> {
  const cacheKey = `all-rankings:${category}`;
  
  // Check cache first
  const cached = dataCache.get<Record<'test' | 'odi' | 't20', RankingItem[]>>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('icc_rankings')
      .select('*')
      .eq('category', category)
      .order('rank', { ascending: true });

    if (error) throw error;

    const rankings = data || [];
    
    // Group by format
    const grouped: Record<'test' | 'odi' | 't20', RankingItem[]> = {
      test: rankings.filter(r => r.format === 'test'),
      odi: rankings.filter(r => r.format === 'odi'),
      t20: rankings.filter(r => r.format === 't20')
    };

    // Cache for 15 minutes
    dataCache.set(cacheKey, grouped, 15 * 60 * 1000);
    
    return grouped;
  } catch (error) {
    console.error('Error fetching all rankings:', error);
    return { test: [], odi: [], t20: [] };
  }
}

// Batch fetch recent posts for home page
export async function fetchHomeFeed(): Promise<OptimizedPost[]> {
  const cacheKey = 'home-feed';
  
  // Check cache first
  const cached = dataCache.get<OptimizedPost[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Temporarily disable materialized view usage due to concurrent refresh issues
    let data: any[] = [];
    let error: any = null;
    let useView = false; // Temporarily disabled
    
    // Use main posts table directly
    const tableResult = await supabase
      .from('posts')
      .select('id, title, slug, content, category, type, thumbnail_url, created_at, is_published')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20);
    
    data = tableResult.data || [];
    error = tableResult.error;

    if (error) throw error;

    const posts = data.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: useView ? post.excerpt : (post.content?.replace(/<[^>]*>/g, '').substring(0, 200) || ''),
      category: post.category,
      type: post.type,
      thumbnail_url: post.thumbnail_url,
      created_at: post.created_at
    }));

    // Cache home feed for 2 minutes (since it's the most accessed page)
    dataCache.set(cacheKey, posts, 2 * 60 * 1000);
    
    return posts;
  } catch (error) {
    console.error('Error fetching home feed:', error);
    return [];
  }
}

// Utility function to invalidate related caches when data is updated
export function invalidatePostCaches(type?: 'news' | 'blog' | 'feature'): void {
  console.log('Invalidating post caches for type:', type);
  
  // Clear specific cache entries instead of all
  if (type) {
    dataCache.invalidate(`posts:${type}`);
  } else {
    dataCache.invalidate('posts:');
  }
  
  // Always clear home feed since it shows all types
  dataCache.invalidate('home-feed');
  
  console.log('Cache invalidation completed');
}

export function invalidateRankingCaches(): void {
  dataCache.invalidate('rankings:');
  dataCache.invalidate('all-rankings:');
}

// Emergency cache clear function
export function clearAllCaches(): void {
  console.log('Clearing all caches...');
  dataCache.clear();
  console.log('All caches cleared');
}

// Force refresh function that bypasses cache
export async function forceRefreshPosts(type?: 'news' | 'blog' | 'feature'): Promise<OptimizedPost[]> {
  console.log('Force refreshing posts, bypassing cache...');
  
  try {
    let query = supabase
      .from('posts')
      .select('id, title, slug, content, category, type, thumbnail_url, created_at, is_published')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;

    const posts = (data || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.content?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
      category: post.category,
      type: post.type,
      thumbnail_url: post.thumbnail_url,
      created_at: post.created_at
    }));

    // Update cache with fresh data
    const cacheKey = `posts:${type || 'all'}:20:all:all`;
    dataCache.set(cacheKey, posts, 3 * 60 * 1000);

    console.log(`Force refresh completed, got ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('Error in force refresh:', error);
    return [];
  }
}

// Preload function for critical data
export async function preloadCriticalData(): Promise<void> {
  try {
    // Preload home feed
    await fetchHomeFeed();
    
    // Preload team rankings for all formats
    await fetchAllRankingsForCategory('team');
    
    console.log('Critical data preloaded successfully');
  } catch (error) {
    console.error('Error preloading critical data:', error);
  }
}
