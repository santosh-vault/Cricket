import React from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { FixtureCard } from './FixtureCard';
import { useFixtures } from '../../hooks/useFixtures';

interface FixturesListProps {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const FixturesList: React.FC<FixturesListProps> = ({ 
  limit, 
  compact = false, 
  showHeader = true,
  className = ""
}) => {
  const { fixtures, loading, error, refreshFixtures } = useFixtures(limit);

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading fixtures...</span>
      </div>
    );
  }

  if (error) {
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

  if (compact) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Fixtures</h3>
            <button
              onClick={refreshFixtures}
              className="text-green-600 hover:text-green-700 p-1 rounded-md transition-colors duration-200"
              title="Refresh fixtures"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
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
          <h2 className="text-2xl font-bold text-gray-900">Cricket Fixtures</h2>
          <button
            onClick={refreshFixtures}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
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