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

  // Function to determine if a match is international
  const isInternationalMatch = (fixture: Fixture): boolean => {
    const internationalKeywords = [
      'ICC', 'World Cup', 'T20 World Cup', 'ODI World Cup', 'Champions Trophy',
      'Asia Cup', 'Test Championship', 'WTC', 'International', 'vs', 'Tour',
      'Series', 'Ashes', 'Border-Gavaskar', 'Bilateral'
    ];
    
    const domesticKeywords = [
      'IPL', 'Indian Premier League', 'Big Bash', 'BBL', 'CPL', 'Caribbean Premier League',
      'PSL', 'Pakistan Super League', 'The Hundred', 'County', 'Ranji', 'Duleep',
      'Syed Mushtaq Ali', 'Vijay Hazare', 'Sheffield Shield', 'Plunket Shield'
    ];

    const matchName = fixture.name?.toLowerCase() || '';
    const matchType = fixture.matchType?.toLowerCase() || '';
    
    // Check if it's explicitly domestic
    const isDomestic = domesticKeywords.some(keyword => 
      matchName.includes(keyword.toLowerCase()) || matchType.includes(keyword.toLowerCase())
    );
    
    if (isDomestic) return false;
    
    // Check if it's international
    const isInternational = internationalKeywords.some(keyword => 
      matchName.includes(keyword.toLowerCase()) || matchType.includes(keyword.toLowerCase())
    );
    
    // Also check team names - if they are country names, it's likely international
    const countryNames = [
      'india', 'australia', 'england', 'south africa', 'new zealand', 'pakistan',
      'sri lanka', 'bangladesh', 'west indies', 'afghanistan', 'zimbabwe', 'ireland',
      'scotland', 'netherlands', 'nepal', 'oman', 'uae'
    ];
    
    const hasCountryTeams = fixture.teams?.some(team => 
      countryNames.includes(team.toLowerCase())
    ) || false;
    
    return isInternational || hasCountryTeams;
  };

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

        // Sort fixtures with priority:
        // 1. Live international matches
        // 2. Live domestic matches
        // 3. Upcoming international matches
        // 4. Upcoming domestic matches
        // 5. Completed international matches
        // 6. Completed domestic matches
        processedFixtures.sort((a, b) => {
          const aIsInternational = isInternationalMatch(a);
          const bIsInternational = isInternationalMatch(b);
          
          // Status priority: live > upcoming > completed
          const statusOrder = { live: 0, upcoming: 1, completed: 2 };
          const aStatusOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
          const bStatusOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
          
          // If different status, prioritize by status first
          if (aStatusOrder !== bStatusOrder) {
            return aStatusOrder - bStatusOrder;
          }
          
          // Within same status, prioritize international matches
          if (aIsInternational !== bIsInternational) {
            return aIsInternational ? -1 : 1;
          }
          
          // Within same status and type, sort by date
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

  const getInternationalMatchesCount = () => {
    return fixtures.filter(fixture => isInternationalMatch(fixture)).length;
  };

  return {
    fixtures,
    loading,
    error,
    lastUpdated,
    refreshFixtures,
    getLiveMatchesCount,
    getInternationalMatchesCount
  };
};