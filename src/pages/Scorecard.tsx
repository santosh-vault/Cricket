import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, MapPin, Users, Target, Activity, RefreshCw } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { format, parseISO } from 'date-fns';

interface MatchData {
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
  matchStarted: boolean;
  matchEnded: boolean;
}

export const Scorecard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  // Auto-refresh for live matches
  useEffect(() => {
    if (matchData?.status === 'live') {
      const interval = setInterval(() => {
        fetchMatchData(false); // Don't show loading on auto-refresh
      }, 15000); // Refresh every 15 seconds for live matches

      return () => clearInterval(interval);
    }
  }, [matchData?.status]);

  const fetchMatchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Fetch all fixtures and find the specific match
      const response = await fetch('/api/fixtures');
      if (!response.ok) {
        throw new Error('Failed to fetch match data');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        const match = data.data.find((m: any) => m.id === matchId);
        
        if (!match) {
          setError('Match not found');
          return;
        }

        const processedMatch: MatchData = {
          ...match,
          status: match.matchEnded ? 'completed' : 
                  match.matchStarted ? 'live' : 'upcoming'
        };

        setMatchData(processedMatch);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
      setError('Failed to load match data');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match data...</p>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Match Not Found</h1>
          <p className="text-gray-600 mb-8">The match you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/fixtures"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Back to Fixtures
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 animate-pulse';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch {
      return 'TBD';
    }
  };

  const getScoreDisplay = (teamIndex: number) => {
    if (!matchData.score || matchData.score.length === 0) return null;
    
    // Find score for this team
    const teamScore = matchData.score.find(s => 
      s.inning.toLowerCase().includes(teamIndex === 0 ? 'first' : 'second') ||
      s.inning.includes(`${teamIndex + 1}`)
    );
    
    if (teamScore) {
      return `${teamScore.r}/${teamScore.w} (${teamScore.o} overs)`;
    }
    
    return null;
  };

  // Mock additional data for demonstration
  const mockLiveData = {
    currentBatsmen: [
      { name: 'Virat Kohli', runs: 45, balls: 32, fours: 4, sixes: 1, strikeRate: 140.63, onStrike: true },
      { name: 'AB de Villiers', runs: 23, balls: 18, fours: 2, sixes: 1, strikeRate: 127.78, onStrike: false }
    ],
    currentBowler: {
      name: 'Jasprit Bumrah',
      overs: 3.4,
      maidens: 0,
      runs: 28,
      wickets: 2,
      economy: 7.64
    },
    recentOvers: [
      '1 4 6 0 1 2',
      '0 1 4 0 0 W',
      '2 1 0 4 1 1',
      '0 0 1 6 4 0',
      '1 2 0 4 1'
    ],
    partnership: { runs: 68, balls: 45, rate: 9.07 }
  };

  return (
    <>
      <SEOHead
        title={`${matchData.teams[0]} vs ${matchData.teams[1]} Scorecard`}
        description={`Live scorecard and match updates for ${matchData.teams[0]} vs ${matchData.teams[1]} in ${matchData.name}`}
        keywords={`${matchData.teams[0]}, ${matchData.teams[1]}, cricket scorecard, live score, ${matchData.name}`}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to="/fixtures"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fixtures
            </Link>

            {/* Match Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(matchData.status)}`}>
                    {matchData.status === 'live' ? '🔴 LIVE' : matchData.status.toUpperCase()}
                  </span>
                  <span className="text-green-100 font-medium">{matchData.name}</span>
                </div>
                {matchData.status === 'live' && (
                  <div className="flex items-center space-x-2">
                    {lastUpdated && (
                      <span className="text-green-200 text-sm">
                        Updated {format(lastUpdated, 'HH:mm:ss')}
                      </span>
                    )}
                    <button
                      onClick={() => fetchMatchData(false)}
                      className="text-green-200 hover:text-white p-1 rounded-md transition-colors duration-200"
                      title="Refresh scorecard"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center md:text-right">
                  <h2 className="text-2xl font-bold mb-2">{matchData.teams[0]}</h2>
                  {matchData.status !== 'upcoming' && (
                    <div className="text-lg">
                      <span className="font-semibold">{getScoreDisplay(0) || 'Yet to bat'}</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">VS</div>
                  {matchData.status === 'completed' && (
                    <div className="text-green-200 text-sm">
                      Match Completed
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">{matchData.teams[1]}</h2>
                  {matchData.status !== 'upcoming' && (
                    <div className="text-lg">
                      <span className="font-semibold">{getScoreDisplay(1) || 'Yet to bat'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-100">
                <div className="flex items-center justify-center md:justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatDate(matchData.dateTimeGMT || matchData.date)}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{matchData.venue}</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>{matchData.matchType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {matchData.status === 'upcoming' ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Match Not Started</h3>
              <p className="text-gray-600 mb-4">
                This match is scheduled to start on {formatDate(matchData.dateTimeGMT || matchData.date)}
              </p>
              <p className="text-sm text-gray-500">
                Check back when the match begins for live updates and scorecard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Scorecard */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Partnership (Live matches only) */}
                {matchData.status === 'live' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-600" />
                      Current Partnership
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {mockLiveData.currentBatsmen.map((batsman, index) => (
                        <div key={index} className={`p-4 rounded-lg ${batsman.onStrike ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{batsman.name}</h4>
                            {batsman.onStrike && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Batting</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Runs: <span className="font-semibold">{batsman.runs}</span></div>
                            <div>Balls: <span className="font-semibold">{batsman.balls}</span></div>
                            <div>4s: <span className="font-semibold">{batsman.fours}</span></div>
                            <div>6s: <span className="font-semibold">{batsman.sixes}</span></div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            SR: {batsman.strikeRate}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-700">
                        <strong>Partnership:</strong> {mockLiveData.partnership.runs} runs off {mockLiveData.partnership.balls} balls 
                        (Rate: {mockLiveData.partnership.rate}/over)
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Bowler (Live matches only) */}
                {matchData.status === 'live' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-red-600" />
                      Current Bowler
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">{mockLiveData.currentBowler.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>Overs: <span className="font-semibold">{mockLiveData.currentBowler.overs}</span></div>
                        <div>Runs: <span className="font-semibold">{mockLiveData.currentBowler.runs}</span></div>
                        <div>Wickets: <span className="font-semibold">{mockLiveData.currentBowler.wickets}</span></div>
                        <div>Economy: <span className="font-semibold">{mockLiveData.currentBowler.economy}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Overs */}
                {matchData.status === 'live' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Overs
                    </h3>
                    <div className="space-y-2">
                      {mockLiveData.recentOvers.map((over, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-600 w-16">
                            Over {mockLiveData.recentOvers.length - index}:
                          </span>
                          <div className="flex space-x-2">
                            {over.split(' ').map((ball, ballIndex) => (
                              <span
                                key={ballIndex}
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  ball === 'W' ? 'bg-red-100 text-red-800' :
                                  ball === '4' ? 'bg-green-100 text-green-800' :
                                  ball === '6' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {ball}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Summary for completed matches */}
                {matchData.status === 'completed' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Summary</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Result</h4>
                        <p className="text-green-800">
                          {matchData.teams[0]} won by 42 runs
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2">{matchData.teams[0]}</h5>
                          <p className="text-gray-700">{getScoreDisplay(0)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2">{matchData.teams[1]}</h5>
                          <p className="text-gray-700">{getScoreDisplay(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Match Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tournament:</span>
                      <span className="font-medium">{matchData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium">{matchData.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(matchData.dateTimeGMT || matchData.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Match Type:</span>
                      <span className="font-medium">{matchData.matchType}</span>
                    </div>
                  </div>
                </div>

                {/* Live Updates Notice */}
                {matchData.status === 'live' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      <h4 className="font-semibold text-red-900">Live Updates</h4>
                    </div>
                    <p className="text-red-800 text-sm">
                      This scorecard updates automatically every 15 seconds during live matches.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};