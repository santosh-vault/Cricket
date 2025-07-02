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

  // Enhanced function to determine if a match is international
  const isInternationalMatch = (fixture: Fixture): boolean => {
    // Define country names and their variations
    const countryTeams = [
      // Full country names
      'india', 'australia', 'england', 'south africa', 'new zealand', 'pakistan',
      'sri lanka', 'bangladesh', 'west indies', 'afghanistan', 'zimbabwe', 'ireland',
      'scotland', 'netherlands', 'nepal', 'oman', 'uae', 'united arab emirates',
      'papua new guinea', 'namibia', 'kenya', 'uganda', 'canada', 'usa', 'united states',
      
      // Common abbreviations and variations
      'ind', 'aus', 'eng', 'sa', 'nz', 'pak', 'sl', 'ban', 'wi', 'afg', 'zim', 'ire',
      'sco', 'ned', 'nep', 'oma', 'png', 'nam', 'ken', 'uga', 'can',
      
      // Youth teams
      'india u19', 'australia u19', 'england u19', 'south africa u19', 'new zealand u19',
      'pakistan u19', 'sri lanka u19', 'bangladesh u19', 'west indies u19', 'afghanistan u19',
      'india under 19', 'australia under 19', 'england under 19', 'south africa under 19',
      
      // Women's teams
      'india women', 'australia women', 'england women', 'south africa women', 'new zealand women',
      'pakistan women', 'sri lanka women', 'bangladesh women', 'west indies women',
      'india w', 'australia w', 'england w', 'south africa w', 'new zealand w',
      
      // A teams and emerging teams
      'india a', 'australia a', 'england a', 'south africa a', 'new zealand a',
      'pakistan a', 'sri lanka a', 'bangladesh a'
    ];

    // International tournament keywords
    const internationalTournaments = [
      'world cup', 'icc', 't20 world cup', 'odi world cup', 'champions trophy',
      'asia cup', 'test championship', 'wtc', 'world test championship',
      'bilateral', 'tour', 'series', 'ashes', 'border-gavaskar', 'trophy',
      'international', 'tri-series', 'quadrangular', 'emerging teams',
      'under 19 world cup', 'u19 world cup', 'women\'s world cup',
      'commonwealth games', 'asian games'
    ];

    // Domestic league keywords (to exclude)
    const domesticLeagues = [
      'ipl', 'indian premier league', 'big bash', 'bbl', 'cpl', 'caribbean premier league',
      'psl', 'pakistan super league', 'the hundred', 'county', 'ranji', 'duleep',
      'syed mushtaq ali', 'vijay hazare', 'sheffield shield', 'plunket shield',
      'royal london', 'vitality blast', 'natwest', 'friends provident',
      'super smash', 'ford trophy', 'mzansi super league', 'csa t20',
      'bangladesh premier league', 'bpl', 'afghanistan premier league', 'apl',
      'everest premier league', 'epl', 'lanka premier league', 'lpl'
    ];

    const matchName = fixture.name?.toLowerCase() || '';
    const matchType = fixture.matchType?.toLowerCase() || '';
    const venue = fixture.venue?.toLowerCase() || '';
    
    // Check if it's explicitly a domestic league
    const isDomestic = domesticLeagues.some(keyword => 
      matchName.includes(keyword) || matchType.includes(keyword) || venue.includes(keyword)
    );
    
    if (isDomestic) return false;

    // Check team names for country teams
    const hasCountryTeams = fixture.teams?.some(team => {
      const teamLower = team.toLowerCase().trim();
      return countryTeams.some(country => {
        // Exact match or team name contains country name
        return teamLower === country || 
               teamLower.includes(country) ||
               // Handle cases like "India vs Australia"
               teamLower.split(' ').some(word => word === country);
      });
    }) || false;

    // Check for international tournament keywords
    const hasInternationalKeywords = internationalTournaments.some(keyword => 
      matchName.includes(keyword) || matchType.includes(keyword)
    );

    // Additional checks for international matches
    const hasVsInName = matchName.includes(' vs ') || matchName.includes(' v ');
    const isTestOdiT20 = ['test', 'odi', 't20i', 't20 international'].some(format => 
      matchType.includes(format) || matchName.includes(format)
    );

    // Return true if any international indicators are found
    return hasCountryTeams || hasInternationalKeywords || (hasVsInName && isTestOdiT20);
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

        // Enhanced sorting with strict international priority
        processedFixtures.sort((a, b) => {
          const aIsInternational = isInternationalMatch(a);
          const bIsInternational = isInternationalMatch(b);
          
          // Status priority: live > upcoming > completed
          const statusOrder = { live: 0, upcoming: 1, completed: 2 };
          const aStatusOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
          const bStatusOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
          
          // Primary sort: International matches always come first
          if (aIsInternational !== bIsInternational) {
            return aIsInternational ? -1 : 1;
          }
          
          // Secondary sort: Within same type (international/domestic), sort by status
          if (aStatusOrder !== bStatusOrder) {
            return aStatusOrder - bStatusOrder;
          }
          
          // Tertiary sort: Within same status and type, sort by date
          const aDate = new Date(a.dateTimeGMT || a.date).getTime();
          const bDate = new Date(b.dateTimeGMT || b.date).getTime();
          
          // For live and upcoming matches, show sooner matches first
          // For completed matches, show more recent matches first
          if (a.status === 'completed') {
            return bDate - aDate; // Newer completed matches first
          } else {
            return aDate - bDate; // Sooner upcoming/live matches first
          }
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
    getInternationalMatchesCount,
    isInternationalMatch
  };
};