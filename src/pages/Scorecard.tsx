import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, MapPin, Users, Target, Activity } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Fixture {
  id: string;
  match_id: string;
  team1: string;
  team2: string;
  venue: string;
  match_date: string;
  status: 'upcoming' | 'live' | 'completed';
  tournament: string;
}

interface Scorecard {
  id: string;
  match_id: string;
  json_data: any;
  updated_at: string;
}

export const Scorecard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch fixture
      const { data: fixtureData, error: fixtureError } = await supabase
        .from('fixtures')
        .select('*')
        .eq('match_id', matchId)
        .single();

      if (fixtureError) {
        setError('Match not found');
        return;
      }

      setFixture(fixtureData);

      // Fetch scorecard if exists
      const { data: scorecardData } = await supabase
        .from('scorecards')
        .select('*')
        .eq('match_id', matchId)
        .single();

      setScorecard(scorecardData);
    } catch (error) {
      console.error('Error fetching match data:', error);
      setError('Failed to load match data');
    } finally {
      setLoading(false);
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

  if (error || !fixture) {
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
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mockScoreData = {
    team1_score: { runs: 187, wickets: 8, overs: 20.0 },
    team2_score: { runs: 145, wickets: 10, overs: 19.3 },
    current_batsmen: [
      { name: 'Virat Kohli', runs: 45, balls: 32, fours: 4, sixes: 1, strike_rate: 140.63, on_strike: true },
      { name: 'AB de Villiers', runs: 23, balls: 18, fours: 2, sixes: 1, strike_rate: 127.78, on_strike: false }
    ],
    current_bowler: {
      name: 'Jasprit Bumrah',
      overs: 3.4,
      maidens: 0,
      runs: 28,
      wickets: 2,
      economy: 7.64
    },
    recent_overs: [
      '1 4 6 0 1 2',
      '0 1 4 0 0 W',
      '2 1 0 4 1 1',
      '0 0 1 6 4 0',
      '1 2 0 4 1'
    ],
    partnership: { runs: 68, balls: 45, partnership_rate: 9.07 }
  };

  return (
    <>
      <SEOHead
        title={`${fixture.team1} vs ${fixture.team2} Scorecard`}
        description={`Live scorecard and match updates for ${fixture.team1} vs ${fixture.team2} in ${fixture.tournament}`}
        keywords={`${fixture.team1}, ${fixture.team2}, cricket scorecard, live score, ${fixture.tournament}`}
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  fixture.status === 'live' ? 'bg-red-500' : 
                  fixture.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {fixture.status === 'live' ? 'LIVE' : fixture.status.toUpperCase()}
                </span>
                <span className="text-green-100 font-medium">{fixture.tournament}</span>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center md:text-right">
                  <h2 className="text-2xl font-bold mb-2">{fixture.team1}</h2>
                  {fixture.status !== 'upcoming' && scorecard?.json_data ? (
                    <div className="text-lg">
                      <span className="font-semibold">{mockScoreData.team1_score.runs}/{mockScoreData.team1_score.wickets}</span>
                      <span className="text-green-200 ml-2">({mockScoreData.team1_score.overs} overs)</span>
                    </div>
                  ) : null}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">VS</div>
                  {fixture.status === 'completed' && (
                    <div className="text-green-200 text-sm">
                      {fixture.team1} won by 42 runs
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">{fixture.team2}</h2>
                  {fixture.status !== 'upcoming' && scorecard?.json_data ? (
                    <div className="text-lg">
                      <span className="font-semibold">{mockScoreData.team2_score.runs}/{mockScoreData.team2_score.wickets}</span>
                      <span className="text-green-200 ml-2">({mockScoreData.team2_score.overs} overs)</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Match Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-100">
                <div className="flex items-center justify-center md:justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{format(new Date(fixture.match_date), 'MMM dd, yyyy • hh:mm a')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{fixture.venue}</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>{fixture.tournament}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {fixture.status === 'upcoming' ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Match Not Started</h3>
              <p className="text-gray-600 mb-4">
                This match is scheduled to start on {format(new Date(fixture.match_date), 'MMMM dd, yyyy at hh:mm a')}
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
                {fixture.status === 'live' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-600" />
                      Current Partnership
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {mockScoreData.current_batsmen.map((batsman, index) => (
                        <div key={index} className={`p-4 rounded-lg ${batsman.on_strike ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{batsman.name}</h4>
                            {batsman.on_strike && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Batting</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Runs: <span className="font-semibold">{batsman.runs}</span></div>
                            <div>Balls: <span className="font-semibold">{batsman.balls}</span></div>
                            <div>4s: <span className="font-semibold">{batsman.fours}</span></div>
                            <div>6s: <span className="font-semibold">{batsman.sixes}</span></div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            SR: {batsman.strike_rate}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-700">
                        <strong>Partnership:</strong> {mockScoreData.partnership.runs} runs off {mockScoreData.partnership.balls} balls 
                        (Rate: {mockScoreData.partnership.partnership_rate}/over)
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Bowler (Live matches only) */}
                {fixture.status === 'live' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-red-600" />
                      Current Bowler
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">{mockScoreData.current_bowler.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>Overs: <span className="font-semibold">{mockScoreData.current_bowler.overs}</span></div>
                        <div>Runs: <span className="font-semibold">{mockScoreData.current_bowler.runs}</span></div>
                        <div>Wickets: <span className="font-semibold">{mockScoreData.current_bowler.wickets}</span></div>
                        <div>Economy: <span className="font-semibold">{mockScoreData.current_bowler.economy}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Overs */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Overs
                  </h3>
                  <div className="space-y-2">
                    {mockScoreData.recent_overs.map((over, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600 w-16">
                          Over {mockScoreData.recent_overs.length - index}:
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Match Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tournament:</span>
                      <span className="font-medium">{fixture.tournament}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium">{fixture.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{format(new Date(fixture.match_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(fixture.status)}`}>
                        {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Stats</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Highest Individual Score</span>
                      </div>
                      <div className="font-semibold">Virat Kohli - 45* (32 balls)</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Best Bowling Figures</span>
                      </div>
                      <div className="font-semibold">J. Bumrah - 2/28 (3.4 overs)</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Most Runs in Over</span>
                      </div>
                      <div className="font-semibold">18 runs (Over 15)</div>
                    </div>
                  </div>
                </div>

                {/* Weather Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">28°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Humidity:</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wind:</span>
                      <span className="font-medium">15 kmph</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conditions:</span>
                      <span className="font-medium">Partly Cloudy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};