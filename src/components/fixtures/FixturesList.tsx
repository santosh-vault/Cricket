import React from 'react';
import { Trophy, RefreshCw, Clock, Globe } from 'lucide-react';
import { FixtureCard } from './FixtureCard';
import { useFixtures } from '../../hooks/useFixtures';
import { format } from 'date-fns';

interface FixturesListProps {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
  autoRefresh?: boolean;
}

export const FixturesList: React.FC<FixturesListProps> = ({ 
  limit, 
  compact = false, 
  showHeader = true,
  className = "",
  autoRefresh = true
}) => {
  const { 
    fixtures, 
    loading, 
    error, 
    lastUpdated, 
    refreshFixtures, 
    getLiveMatchesCount, 
    getInternationalMatchesCount 
  } = useFixtures(limit, autoRefresh);

  if (loading && fixtures.length === 0) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading fixtures...</span>
      </div>
    );
  }

  if (error && fixtures.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-4">Failed to load fixtures</p>
        <button
          onClick={refreshFixtures}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (fixtures.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No fixtures available at the moment</p>
      </div>
    );
  }

  const liveMatchesCount = getLiveMatchesCount();
  const internationalMatchesCount = getInternationalMatchesCount();

  if (compact) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Cricket Fixtures</h3>
              <div className="flex items-center space-x-2">
                {liveMatchesCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                    {liveMatchesCount} Live
                  </span>
                )}
                {internationalMatchesCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Globe className="h-3 w-3 mr-1" />
                    {internationalMatchesCount} Int'l
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated {format(lastUpdated, 'HH:mm')}
                </span>
              )}
              <button
                onClick={refreshFixtures}
                disabled={loading}
                className="text-green-600 hover:text-green-700 p-1 rounded-md transition-colors duration-200 disabled:opacity-50"
                title="Refresh fixtures"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        )}
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {fixtures.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              compact={true}
              showScore={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">Cricket Fixtures</h2>
            <div className="flex items-center space-x-2">
              {liveMatchesCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  {liveMatchesCount} Live Match{liveMatchesCount > 1 ? 'es' : ''}
                </span>
              )}
              {internationalMatchesCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Globe className="h-4 w-4 mr-2" />
                  {internationalMatchesCount} International
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {format(lastUpdated, 'HH:mm:ss')}
              </div>
            )}
            <button
              onClick={refreshFixtures}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            compact={false}
            showScore={true}
          />
        ))}
      </div>
    </div>
  );
};