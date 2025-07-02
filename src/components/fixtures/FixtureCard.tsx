import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Trophy, ExternalLink, Globe, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Fixture } from '../../hooks/useFixtures';

interface FixtureCardProps {
  fixture: Fixture;
  compact?: boolean;
  showScore?: boolean;
  isInternational?: boolean;
}

export const FixtureCard: React.FC<FixtureCardProps> = ({ 
  fixture, 
  compact = false, 
  showScore = true,
  isInternational = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-red-500 text-white font-bold animate-pulse shadow-lg';
      case 'upcoming':
        return 'bg-blue-500 text-white font-semibold';
      case 'completed':
        return 'bg-gray-500 text-white font-medium';
      default:
        return 'bg-gray-400 text-white font-medium';
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

  const getScoreDisplay = () => {
    if (!fixture.score || fixture.score.length === 0) return null;
    
    // Enhanced score display with better formatting
    if (fixture.score.length === 1) {
      const score = fixture.score[0];
      return `${score.r}/${score.w} (${score.o} ov)`;
    } else if (fixture.score.length === 2) {
      const score1 = fixture.score[0];
      const score2 = fixture.score[1];
      return `${score1.r}/${score1.w} (${score1.o}) vs ${score2.r}/${score2.w} (${score2.o})`;
    }
    
    return fixture.score.map(s => `${s.r}/${s.w} (${s.o})`).join(' • ');
  };

  const getCardBorder = () => {
    if (isInternational) {
      return fixture.status === 'live' 
        ? 'border-2 border-red-400 shadow-lg ring-2 ring-red-200' 
        : 'border-2 border-green-400 shadow-md';
    }
    return 'border border-gray-200';
  };

  const CardContent = () => {
    if (compact) {
      return (
        <div className={`min-w-[300px] bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 cursor-pointer group transform hover:-translate-y-1 ${getCardBorder()}`}>
          {/* Header with status and international badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(fixture.status)}`}>
                {fixture.status === 'live' ? '🔴 LIVE' : fixture.status.toUpperCase()}
              </span>
              {isInternational && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                  <Globe className="h-3 w-3 mr-1" />
                  INT'L
                </span>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
          
          {/* Tournament name */}
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700 line-clamp-1">{fixture.name}</span>
          </div>
          
          {/* Teams */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 text-center">
              <span className="font-bold text-gray-900 text-base block truncate">
                {fixture.teams[0] || 'Team 1'}
              </span>
            </div>
            <div className="px-3">
              <span className="text-gray-500 font-bold text-lg">vs</span>
            </div>
            <div className="flex-1 text-center">
              <span className="font-bold text-gray-900 text-base block truncate">
                {fixture.teams[1] || 'Team 2'}
              </span>
            </div>
          </div>
          
          {/* Venue */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 truncate flex items-center">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              {fixture.venue}
            </p>
          </div>
          
          {/* Date and Time */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {date}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {time}
            </span>
          </div>
          
          {/* Score Display */}
          {showScore && getScoreDisplay() && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg px-3 py-2 mb-2">
              <div className="text-green-800 font-bold text-sm text-center">
                {getScoreDisplay()}
              </div>
            </div>
          )}
          
          {/* Live indicator */}
          {fixture.status === 'live' && (
            <div className="text-center">
              <span className="inline-flex items-center text-sm text-red-600 font-bold">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Live Updates
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 ${getCardBorder()}`}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              {/* Header with badges */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(fixture.status)}`}>
                    {fixture.status === 'live' ? '🔴 LIVE' : fixture.matchType?.toUpperCase() || 'MATCH'}
                  </span>
                  {isInternational && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                      <Globe className="h-4 w-4 mr-1" />
                      International
                    </span>
                  )}
                  <span className="text-base text-gray-700 font-semibold">{fixture.name}</span>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
              </div>
              
              {/* Teams section */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-8 text-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {fixture.teams[0] || 'Team 1'}
                    </h3>
                  </div>
                  <div className="px-4">
                    <span className="text-3xl font-bold text-gray-400">vs</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {fixture.teams[1] || 'Team 2'}
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* Match details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{time}</span>
                </div>
                <div className="flex items-center md:col-span-1">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium truncate">{fixture.venue}</span>
                </div>
              </div>
              
              {/* Score display */}
              {showScore && getScoreDisplay() && (
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg px-4 py-3 inline-block">
                    <div className="text-green-800 font-bold text-lg">
                      {getScoreDisplay()}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Live indicator */}
              {fixture.status === 'live' && (
                <div className="mt-4">
                  <span className="inline-flex items-center text-base text-red-600 font-bold">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
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