import React from 'react';
import { Trophy, RefreshCw, Clock, Globe, Star } from 'lucide-react';
import { FixtureCard } from './FixtureCard';
import { useFixtures } from '../../hooks/useFixtures';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    getInternationalMatchesCount,
    isInternationalMatch
  } = useFixtures(limit, autoRefresh);

  const [fixtureOrder, setFixtureOrder] = React.useState(fixtures.map(f => f.id));
  React.useEffect(() => { setFixtureOrder(fixtures.map(f => f.id)); }, [fixtures]);
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(fixtureOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setFixtureOrder(newOrder);
  };

  if (loading && fixtures.length === 0) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-medium">Loading cricket fixtures...</span>
        </div>
      </div>
    );
  }

  if (error && fixtures.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load fixtures</h3>
        <p className="text-gray-600 mb-6">Unable to fetch cricket match data</p>
        <button
          onClick={refreshFixtures}
          className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors duration-200 font-semibold"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (fixtures.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No fixtures available</h3>
        <p className="text-gray-600">Check back later for upcoming cricket matches</p>
      </div>
    );
  }

  const liveMatchesCount = getLiveMatchesCount();
  const internationalMatchesCount = getInternationalMatchesCount();

  if (compact) {
    return (
      <div className={className + ' font-serif'}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-gray-900">Cricket Fixtures</h3>
              <div className="flex items-center space-x-2">
                {liveMatchesCount > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white shadow-md animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    {liveMatchesCount} Live
                  </span>
                )}
                {internationalMatchesCount > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white shadow-md">
                    <Globe className="h-4 w-4 mr-1" />
                    {internationalMatchesCount} Int'l
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500 font-medium">
                  Updated {format(lastUpdated, 'HH:mm')}
                </span>
              )}
              <button
                onClick={refreshFixtures}
                disabled={loading}
                className="text-green-600 hover:text-green-700 p-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                title="Refresh fixtures"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fixtures-droppable" direction="horizontal">
            {(provided) => (
              <div className="flex space-x-4 overflow-x-auto pb-4" ref={provided.innerRef} {...provided.droppableProps}>
                {fixtureOrder.map((id, idx) => {
                  const fixture = fixtures.find(f => f.id === id);
                  if (!fixture) return null;
                  return (
                    <Draggable key={fixture.id} draggableId={fixture.id} index={idx}>
                      {(provided) => (
                        <FixtureCard
                          fixture={fixture}
                          compact={true}
                          showScore={true}
                          isInternational={isInternationalMatch(fixture)}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          ref={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }

  return (
    <div className={className + ' font-serif'}>
      {showHeader && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-900">Cricket Fixtures</h2>
            <div className="flex items-center space-x-3">
              {liveMatchesCount > 0 && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-500 text-white shadow-lg animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {liveMatchesCount} Live Match{liveMatchesCount > 1 ? 'es' : ''}
                </span>
              )}
              {internationalMatchesCount > 0 && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-500 text-white shadow-md">
                  <Globe className="h-5 w-5 mr-2" />
                  {internationalMatchesCount} International
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: {format(lastUpdated, 'HH:mm:ss')}
              </div>
            )}
            <button
              onClick={refreshFixtures}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 font-semibold shadow-md"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Priority notice for international matches */}
      {internationalMatchesCount > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">
              International matches are prioritized and shown first
            </span>
          </div>
        </div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fixtures-droppable-list" direction="vertical">
          {(provided) => (
            <div className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
              {fixtureOrder.map((id, idx) => {
                const fixture = fixtures.find(f => f.id === id);
                if (!fixture) return null;
                return (
                  <Draggable key={fixture.id} draggableId={fixture.id} index={idx}>
                    {(provided) => (
                      <FixtureCard
                        fixture={fixture}
                        compact={false}
                        showScore={true}
                        isInternational={isInternationalMatch(fixture)}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        ref={provided.innerRef}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};