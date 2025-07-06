// import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const API_KEY = '11cb8225-0dfc-494e-a48b-32957bbd2887';
const API_URL = 'https://api.cricapi.com/v1/currentMatches?apikey=' + API_KEY + '&offset=0';

// Use environment variables for Supabase config
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  try {
    console.log('Fetching fixtures from API...');
    const response = await fetch(API_URL);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API responded with error:', response.status, errorText);
      // If quota exceeded, fallback to manual fixtures
      if (errorText.includes('hits today exceeded hits limit')) {
        console.log('API quota exceeded, falling back to manual fixtures...');
        const { data, error } = await supabase
          .from('fixtures')
          .select('*')
          .order('match_date', { ascending: true });
        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: 'Failed to fetch manual fixtures', details: error.message });
        }
        console.log('Manual fixtures fetched successfully:', data?.length || 0, 'fixtures');
        return res.status(200).json({ status: 'manual', data });
      }
      return res.status(response.status).json({ error: 'Failed to fetch fixtures', details: errorText });
    }
    
    const data = await response.json();
    console.log('API fixtures fetched successfully:', data?.data?.length || 0, 'fixtures');
    res.status(200).json(data);
  } catch (error: any) {
    console.error('API fetch error:', error);
    // On fetch error, fallback to manual fixtures
    try {
      console.log('Falling back to manual fixtures due to API error...');
      const { data, error: supabaseError } = await supabase
        .from('fixtures')
        .select('*')
        .order('match_date', { ascending: true });
      if (supabaseError) {
        console.error('Supabase fallback error:', supabaseError);
        return res.status(500).json({ error: 'Failed to fetch manual fixtures', details: supabaseError.message });
      }
      console.log('Manual fixtures fallback successful:', data?.length || 0, 'fixtures');
      return res.status(200).json({ status: 'manual', data });
    } catch (fallbackError) {
      console.error('Final fallback error:', fallbackError);
      return res.status(500).json({ error: 'Internal server error', details: fallbackError?.message || fallbackError });
    }
  }
} 