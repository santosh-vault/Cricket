import { useState, useEffect } from 'react';

export interface Fixture {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo?: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
}

interface ApiResponse {
  apikey: string;
  data: Fixture[];
  status: string;
  info: {
    hitsToday: number;
    hitsUsed: number;
    hitsLimit: number;
    credits: number;
    server: number;
    offsetRows: number;
    totalRows: number;
    queryTime: number;
    s: number;
    cache: number;
  };
}

export const useFixtures = (limit?: number) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/fixtures');
      if (!response.ok) {
        throw new Error('Failed to fetch fixtures');
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.status === 'success' && data.data) {
        let processedFixtures = data.data.map(match => ({
          ...match,
          // Ensure we have proper team names
          teams: match.teams || [],
          // Format the date properly
          date: match.dateTimeGMT || match.date,
          // Determine status based on match state
          status: match.matchEnded ? 'completed' : 
                  match.matchStarted ? 'live' : 'upcoming'
        }));

        // Apply limit if specified
        if (limit) {
          processedFixtures = processedFixtures.slice(0, limit);
        }

        setFixtures(processedFixtures);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      console.error('Error fetching fixtures:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fixtures');
      // Fallback to empty array
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshFixtures = () => {
    fetchFixtures();
  };

  return {
    fixtures,
    loading,
    error,
    refreshFixtures
  };
};