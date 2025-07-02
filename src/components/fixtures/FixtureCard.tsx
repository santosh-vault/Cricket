import React from 'react';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';
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
        return 'bg-red-100 text-red-800';
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

  const getScoreDisplay = () => {
    if (!fixture.score || fixture.score.length === 0) return null;
    
    const team1Score = fixture.score.find(s => s.inning.includes('1st') || s.inning.includes('first'));
    const team2Score = fixture.score.find(s => s.inning.includes('2nd') || s.inning.includes('second'));
    
    if (team1Score && team2Score) {
      return `${team1Score.r}/${team1Score.w} (${team1Score.o}) vs ${team2Score.r}/${team2Score.w} (${team2Score.o})`;
    } else if (team1Score) {
      return `${team1Score.r}/${team1Score.w} (${team1Score.o})`;
    }
    
    return null;
  };

  if (compact) {
    return (
      <div className="min-w-[280px] bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fixture.status)}`}>
            {fixture.status === 'live' ? 'LIVE' : fixture.status.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 truncate">{fixture.name}</span>
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fixture.status)}`}>
                {fixture.matchType?.toUpperCase() || 'MATCH'}
              </span>
              <span className="text-sm text-gray-600 font-medium">{fixture.name}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};