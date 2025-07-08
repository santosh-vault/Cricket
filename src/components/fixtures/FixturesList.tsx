import React from 'react';
import { Trophy, RefreshCw, Clock, Globe, Star } from 'lucide-react';
import { FixtureCard } from './FixtureCard';
import { useFixtures } from '../../hooks/useFixtures';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fixtures-droppable" direction="horizontal">
            {(provided: DroppableProvided) => (
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide" ref={provided.innerRef} {...provided.droppableProps}>
                {fixtureOrder.map((id, idx) => {
                  const fixture = fixtures.find(f => f.id === id);
                  if (!fixture) return null;
                  return (
                    <Draggable key={fixture.id} draggableId={fixture.id} index={idx}>
                      {(provided: DraggableProvided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <FixtureCard
                            fixture={fixture}
                            compact={true}
                            showScore={true}
                            isInternational={isInternationalMatch(fixture)}
                          />
                        </div>
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
        <div className="flex items-center justify-end mb-8">
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
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-semibold shadow-md"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Manual refresh notice - only show in non-compact mode */}
      {!compact && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-semibold">
              Automatic updates are disabled. Click "Refresh" to get the latest scores and updates.
            </span>
          </div>
        </div>
      )}

      {/* Priority notice for international matches - only show in non-compact mode */}
      {!compact && internationalMatchesCount > 0 && (
        <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-semibold">
              International matches are prioritized and shown first
            </span>
          </div>
        </div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fixtures-droppable-list" direction="vertical">
          {(provided: DroppableProvided) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={provided.innerRef} {...provided.droppableProps}>
              {fixtureOrder.map((id, idx) => {
                const fixture = fixtures.find(f => f.id === id);
                if (!fixture) return null;
                return (
                  <Draggable key={fixture.id} draggableId={fixture.id} index={idx}>
                    {(provided: DraggableProvided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <FixtureCard
                          fixture={fixture}
                          compact={false}
                          showScore={true}
                          isInternational={isInternationalMatch(fixture)}
                        />
                      </div>
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