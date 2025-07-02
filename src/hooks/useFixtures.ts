import { useState, useEffect, useCallback } from 'react';

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

export const useFixtures = (limit?: number, autoRefresh: boolean = true) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFixtures = useCallback(async () => {
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

        // Sort fixtures: live first, then upcoming, then completed
        processedFixtures.sort((a, b) => {
          const statusOrder = { live: 0, upcoming: 1, completed: 2 };
          const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
          const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
          
          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }
          
          // Within same status, sort by date
          return new Date(a.dateTimeGMT || a.date).getTime() - new Date(b.dateTimeGMT || b.date).getTime();
        });

        // Apply limit if specified
        if (limit) {
          processedFixtures = processedFixtures.slice(0, limit);
        }

        setFixtures(processedFixtures);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      console.error('Error fetching fixtures:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fixtures');
      // Don't clear fixtures on error, keep showing last known data
      if (fixtures.length === 0) {
        setFixtures([]);
      }
    } finally {
      setLoading(false);
    }
  }, [limit, fixtures.length]);

  useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

  // Auto-refresh for live matches
  useEffect(() => {
    if (!autoRefresh) return;

    const hasLiveMatches = fixtures.some(fixture => fixture.status === 'live');
    
    if (hasLiveMatches) {
      const interval = setInterval(() => {
        fetchFixtures();
      }, 30000); // Refresh every 30 seconds for live matches

      return () => clearInterval(interval);
    }
  }, [fixtures, autoRefresh, fetchFixtures]);

  const refreshFixtures = () => {
    fetchFixtures();
  };

  const getLiveMatchesCount = () => {
    return fixtures.filter(fixture => fixture.status === 'live').length;
  };

  return {
    fixtures,
    loading,
    error,
    lastUpdated,
    refreshFixtures,
    getLiveMatchesCount
  };
};