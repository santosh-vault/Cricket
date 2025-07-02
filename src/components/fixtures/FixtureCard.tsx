import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Trophy, ExternalLink, Globe } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Fixture } from '../../hooks/useFixtures';

interface FixtureCardProps {
  fixture: Fixture;
  compact?: boolean;
  showScore?: boolean;
}

export const FixtureCard: React.FC<FixtureCardProps> = ({ 
  fixture, 
  compact = false, 
  showScore = true 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-red-100 text-red-800 animate-pulse';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return {
        date: format(date, 'MMM dd, yyyy'),
        time: format(date, 'hh:mm a')
      };
    } catch {
      return {
        date: 'TBD',
        time: 'TBD'
      };
    }
  };

  const { date, time } = formatDate(fixture.dateTimeGMT || fixture.date);

  // Function to determine if a match is international
  const isInternationalMatch = (): boolean => {
    const internationalKeywords = [
      'ICC', 'World Cup', 'T20 World Cup', 'ODI World Cup', 'Champions Trophy',
      'Asia Cup', 'Test Championship', 'WTC', 'International', 'vs', 'Tour',
      'Series', 'Ashes', 'Border-Gavaskar', 'Bilateral'
    ];
    
    const domesticKeywords = [
      'IPL', 'Indian Premier League', 'Big Bash', 'BBL', 'CPL', 'Caribbean Premier League',
      'PSL', 'Pakistan Super League', 'The Hundred', 'County', 'Ranji', 'Duleep'
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
      'sri lanka', 'bangladesh', 'west indies', 'afghanistan', 'zimbabwe', 'ireland'
    ];
    
    const hasCountryTeams = fixture.teams?.some(team => 
      countryNames.includes(team.toLowerCase())
    ) || false;
    
    return isInternational || hasCountryTeams;
  };

  const getScoreDisplay = () => {
    if (!fixture.score || fixture.score.length === 0) return null;
    
    // Display actual scores from API
    const scores = fixture.score.map(s => `${s.r}/${s.w} (${s.o})`);
    return scores.join(' vs ');
  };

  const CardContent = () => {
    if (compact) {
      return (
        <div className="min-w-[280px] bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex-shrink-0 cursor-pointer group">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fixture.status)}`}>
              {fixture.status === 'live' ? '🔴 LIVE' : fixture.status.toUpperCase()}
            </span>
            {isInternationalMatch() && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Globe className="h-3 w-3 mr-1" />
                INT'L
              </span>
            )}
            <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto" />
          </div>
          
          <div className="mb-2">
            <span className="text-xs text-gray-500 truncate block">{fixture.name}</span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 text-sm truncate">
              {fixture.teams[0] || 'Team 1'}
            </span>
            <span className="text-gray-500 mx-2 text-sm">vs</span>
            <span className="font-semibold text-gray-900 text-sm truncate">
              {fixture.teams[1] || 'Team 2'}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 mb-2 truncate">{fixture.venue}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
            <span>{date}</span>
            <span>{time}</span>
          </div>
          
          {showScore && getScoreDisplay() && (
            <div className="text-green-700 font-bold text-xs bg-green-50 rounded px-2 py-1 text-center">
              {getScoreDisplay()}
            </div>
          )}
          
          {fixture.status === 'live' && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center text-xs text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                Live Updates
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fixture.status)}`}>
                  {fixture.status === 'live' ? '🔴 LIVE' : fixture.matchType?.toUpperCase() || 'MATCH'}
                </span>
                {isInternationalMatch() && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Globe className="h-3 w-3 mr-1" />
                    International
                  </span>
                )}
                <span className="text-sm text-gray-600 font-medium">{fixture.name}</span>
                <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-6 text-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {fixture.teams[0] || 'Team 1'}
                    </h3>
                  </div>
                  <div className="px-4">
                    <span className="text-2xl font-bold text-gray-400">vs</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {fixture.teams[1] || 'Team 2'}
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center md:col-span-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{fixture.venue}</span>
                </div>
              </div>
              
              {showScore && getScoreDisplay() && (
                <div className="mt-4 text-green-700 font-bold text-sm bg-green-50 rounded px-3 py-2 inline-block">
                  {getScoreDisplay()}
                </div>
              )}
              
              {fixture.status === 'live' && (
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm text-red-600 font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Live Updates Available
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Make the entire card clickable by wrapping it in a Link
  return (
    <Link 
      to={`/scorecard/${fixture.id}`}
      className="block hover:no-underline"
    >
      <CardContent />
    </Link>
  );
};