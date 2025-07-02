import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          category: string;
          type: 'news' | 'blog';
          tags: string[];
          author_id: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          thumbnail_url: string | null;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          category: string;
          type: 'news' | 'blog';
          tags?: string[];
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          category?: string;
          type?: 'news' | 'blog';
          tags?: string[];
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
        };
      };
      fixtures: {
        Row: {
          id: string;
          match_id: string;
          team1: string;
          team2: string;
          venue: string;
          match_date: string;
          status: 'upcoming' | 'live' | 'completed';
          tournament: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          team1: string;
          team2: string;
          venue: string;
          match_date: string;
          status?: 'upcoming' | 'live' | 'completed';
          tournament: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          team1?: string;
          team2?: string;
          venue?: string;
          match_date?: string;
          status?: 'upcoming' | 'live' | 'completed';
          tournament?: string;
          created_at?: string;
        };
      };
      scorecards: {
        Row: {
          id: string;
          match_id: string;
          json_data: any;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          json_data: any;
          updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          json_data?: any;
          updated_at?: string;
        };
      };
    };
  };
};