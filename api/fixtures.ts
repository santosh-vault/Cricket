import { createClient } from '@supabase/supabase-js';

const API_KEY = '11cb8225-0dfc-494e-a48b-32957bbd2887';
const API_URL = 'https://api.cricapi.com/v1/currentMatches?apikey=' + API_KEY + '&offset=0';

// Use environment variables for Supabase config (server-side only)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Environment check:', {
  hasSupabaseUrl: !!supabaseUrl,
  hasSupabaseKey: !!supabaseAnonKey,
  supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
  supabaseKey: supabaseAnonKey ? 'Set' : 'Missing'
});

// Initialize Supabase client only if we have the credentials
let supabase: any = undefined;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('Supabase credentials not available, will use fallback data');
}

export default async function handler(request, response) {
  try {
    console.log('Fetching fixtures from API...');
    const apiRes = await fetch(API_URL);
    console.log('API response status:', apiRes.status);
    
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('API responded with error:', apiRes.status, errorText);
      // If quota exceeded or API fails, try Supabase fallback
      if (errorText.includes('hits today exceeded hits limit') || apiRes.status >= 400) {
        console.log('API failed, trying Supabase fallback...');
        if (!supabase) {
          console.log('No Supabase client available, returning sample data');
          return response.status(200).json({ 
            status: 'sample', 
            data: [
              {
                id: 'sample-1',
                name: 'India vs Australia - T20I Series',
                matchType: 'T20I',
                status: 'upcoming',
                venue: 'Melbourne Cricket Ground',
                date: new Date(Date.now() + 86400000).toISOString(),
                dateTimeGMT: new Date(Date.now() + 86400000).toISOString(),
                teams: ['India', 'Australia'],
                series_id: 'sample-series',
                fantasyEnabled: false,
                bbbEnabled: false,
                hasSquad: false,
                matchStarted: false,
                matchEnded: false,
              },
              {
                id: 'sample-2',
                name: 'IPL 2025 - Mumbai Indians vs Chennai Super Kings',
                matchType: 'T20',
                status: 'upcoming',
                venue: 'Wankhede Stadium, Mumbai',
                date: new Date(Date.now() + 172800000).toISOString(),
                dateTimeGMT: new Date(Date.now() + 172800000).toISOString(),
                teams: ['Mumbai Indians', 'Chennai Super Kings'],
                series_id: 'sample-domestic',
                fantasyEnabled: false,
                bbbEnabled: false,
                hasSquad: false,
                matchStarted: false,
                matchEnded: false,
              }
            ]
          });
        }
        const { data, error } = await supabase
          .from('fixtures')
          .select('*')
          .order('match_date', { ascending: true });
        if (error) {
          console.error('Supabase error:', error);
          return response.status(500).json({ error: 'Failed to fetch manual fixtures', details: error.message });
        }
        console.log('Manual fixtures fetched successfully:', data?.length || 0, 'fixtures');
        return response.status(200).json({ status: 'manual', data });
      }
      return response.status(apiRes.status).json({ error: 'Failed to fetch fixtures', details: errorText });
    }
    const data = await apiRes.json();
    console.log('API fixtures fetched successfully:', data?.data?.length || 0, 'fixtures');
    response.status(200).json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    // On fetch error, try Supabase fallback
    try {
      console.log('Falling back to manual fixtures due to API error...');
      if (!supabase) {
        console.log('No Supabase client available, returning sample data');
        return response.status(200).json({ 
          status: 'sample', 
          data: [
            {
              id: 'sample-1',
              name: 'India vs Australia - T20I Series',
              matchType: 'T20I',
              status: 'upcoming',
              venue: 'Melbourne Cricket Ground',
              date: new Date(Date.now() + 86400000).toISOString(),
              dateTimeGMT: new Date(Date.now() + 86400000).toISOString(),
              teams: ['India', 'Australia'],
              series_id: 'sample-series',
              fantasyEnabled: false,
              bbbEnabled: false,
              hasSquad: false,
              matchStarted: false,
              matchEnded: false,
            },
            {
              id: 'sample-2',
              name: 'IPL 2025 - Mumbai Indians vs Chennai Super Kings',
              matchType: 'T20',
              status: 'upcoming',
              venue: 'Wankhede Stadium, Mumbai',
              date: new Date(Date.now() + 172800000).toISOString(),
              dateTimeGMT: new Date(Date.now() + 172800000).toISOString(),
              teams: ['Mumbai Indians', 'Chennai Super Kings'],
              series_id: 'sample-domestic',
              fantasyEnabled: false,
              bbbEnabled: false,
              hasSquad: false,
              matchStarted: false,
              matchEnded: false,
            }
          ]
        });
      }
      const { data, error: supabaseError } = await supabase
        .from('fixtures')
        .select('*')
        .order('match_date', { ascending: true });
      if (supabaseError) {
        console.error('Supabase fallback error:', supabaseError);
        return response.status(500).json({ error: 'Failed to fetch manual fixtures', details: supabaseError.message });
      }
      console.log('Manual fixtures fallback successful:', data?.length || 0, 'fixtures');
      return response.status(200).json({ status: 'manual', data });
    } catch (fallbackError) {
      console.error('Final fallback error:', fallbackError);
      return response.status(500).json({ error: 'Internal server error', details: fallbackError?.message || fallbackError });
    }
  }
} 