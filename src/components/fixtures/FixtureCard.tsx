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

export const FixtureCard: React.FC<FixtureCardProps & { draggableProps?: any; dragHandleProps?: any; }> = ({ 
  fixture, 
  compact = false, 
  showScore = true,
  isInternational = false,
  draggableProps = {},
  dragHandleProps = {}
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-brand text-white font-bold animate-pulse shadow-lg';
      case 'upcoming':
        return 'bg-brand-light text-white font-semibold';
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
        ? 'border-1 border-brand shadow-lg ring-1 ring-brand-200' 
        : 'border-1 border-brand-dark shadow-md';
    }
    return 'border border-gray-200';
  };

  const CardContent = () => {
    if (compact) {
      return (
        <div {...draggableProps} {...dragHandleProps} className={`w-80 h-48 bg-white rounded-lg p-3 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 cursor-pointer group transform hover:-translate-y-1 ${getCardBorder()}`}> 
          {/* Header with status and international badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-sans ${getStatusColor(fixture.status)}`}>{fixture.status === 'live' ? '🔵 LIVE' : fixture.status.toUpperCase()}</span>
              {isInternational && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-brand to-brand-dark text-white shadow-sm font-sans">
                  <Globe className="h-3 w-3 mr-1" />INT'L
                </span>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
          {/* Tournament name */}
          <div className="mb-1">
            <span className="text-xs font-sans text-gray-700 line-clamp-1 max-w-[12rem] block truncate" title={fixture.name}>{fixture.name.length > 24 ? fixture.name.slice(0, 22) + '…' : fixture.name}</span>
          </div>
          {/* Teams */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 text-center">
              <span className="font-bold text-brand text-base block truncate font-serif max-w-[7.5rem]" title={fixture.teams[0] || 'Team 1'}>{(fixture.teams[0] || 'Team 1').length > 16 ? (fixture.teams[0] || 'Team 1').slice(0, 14) + '…' : fixture.teams[0] || 'Team 1'}</span>
            </div>
            <div className="px-2">
              <span className="text-gray-500 font-bold text-lg font-sans">vs</span>
            </div>
            <div className="flex-1 text-center">
              <span className="font-bold text-brand text-base block truncate font-serif max-w-[7.5rem]" title={fixture.teams[1] || 'Team 2'}>{(fixture.teams[1] || 'Team 2').length > 16 ? (fixture.teams[1] || 'Team 2').slice(0, 14) + '…' : fixture.teams[1] || 'Team 2'}</span>
            </div>
          </div>
          {/* Venue */}
          <div className="mb-1">
            <p className="text-xs text-gray-600 truncate flex items-center font-sans"><MapPin className="h-3 w-3 mr-1 flex-shrink-0" />{fixture.venue}</p>
          </div>
          {/* Date and Time */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-sans">
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{date}</span>
            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{time}</span>
          </div>
          {/* Score Display */}
          {showScore && getScoreDisplay() && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-2 py-1 mb-1">
              <div className="text-blue-800 font-bold text-xs text-center font-sans">{getScoreDisplay()}</div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div {...draggableProps} {...dragHandleProps} className={`w-[28rem] h-52 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 ${getCardBorder()} p-4 mx-auto flex flex-col justify-between`}> 
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans ${getStatusColor(fixture.status)}`}>{fixture.status === 'live' ? '🔵 LIVE' : fixture.matchType?.toUpperCase() || 'MATCH'}</span>
              {isInternational && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-brand to-brand-dark text-white shadow-md font-sans"><Globe className="h-4 w-4 mr-1" />International</span>
              )}
              <span className="text-base text-brand font-semibold font-serif max-w-[16rem] truncate block" title={fixture.name}>{fixture.name.length > 32 ? fixture.name.slice(0, 30) + '…' : fixture.name}</span>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
          {/* Teams section */}
          <div className="mb-2">
            <div className="flex items-center justify-center space-x-8 text-center">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand mb-1 font-serif max-w-[10rem] truncate" title={fixture.teams[0] || 'Team 1'}>{(fixture.teams[0] || 'Team 1').length > 18 ? (fixture.teams[0] || 'Team 1').slice(0, 16) + '…' : fixture.teams[0] || 'Team 1'}</h3>
              </div>
              <div className="px-4">
                <span className="text-2xl font-bold text-gray-400 font-sans">vs</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand mb-1 font-serif max-w-[10rem] truncate" title={fixture.teams[1] || 'Team 2'}>{(fixture.teams[1] || 'Team 2').length > 18 ? (fixture.teams[1] || 'Team 2').slice(0, 16) + '…' : fixture.teams[1] || 'Team 2'}</h3>
              </div>
            </div>
          </div>
          {/* Match details */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-sans">
            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{fixture.venue}</span>
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{date}</span>
            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{time}</span>
          </div>
        </div>
        {/* Score Display */}
        {showScore && getScoreDisplay() && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-2 py-1 mb-1">
            <div className="text-blue-800 font-bold text-xs text-center font-sans">{getScoreDisplay()}</div>
          </div>
        )}
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