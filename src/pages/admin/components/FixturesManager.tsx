import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, MapPin, Trophy, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';
import { FixtureEditor } from './FixtureEditor';

interface Fixture {
  id: string;
  match_id: string;
  team1: string;
  team2: string;
  venue: string;
  match_date: string;
  status: 'upcoming' | 'live' | 'completed';
  tournament: string;
  created_at: string;
}

export const FixturesManager: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');

  // --- Import from API URL state ---
  const [apiUrl, setApiUrl] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiMatches, setApiMatches] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      let query = supabase
        .from('fixtures')
        .select('*')
        .order('match_date', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setFixtures(data || []);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fixture?')) return;

    try {
      const { error } = await supabase
        .from('fixtures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFixtures(fixtures.filter(fixture => fixture.id !== id));
    } catch (error) {
      console.error('Error deleting fixture:', error);
      alert('Failed to delete fixture');
    }
  };

  const updateStatus = async (id: string, newStatus: 'upcoming' | 'live' | 'completed') => {
    try {
      const { error } = await supabase
        .from('fixtures')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setFixtures(fixtures.map(fixture => 
        fixture.id === id 
          ? { ...fixture, status: newStatus }
          : fixture
      ));
    } catch (error) {
      console.error('Error updating fixture status:', error);
      alert('Failed to update fixture status');
    }
  };

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

  const FixturesList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cricket Fixtures</h2>
          <p className="text-gray-600">Manage match schedules and fixtures</p>
        </div>
        <Link
          to="/admin/fixtures/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Fixture
        </Link>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        {(['all', 'upcoming', 'live', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filter === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Fixtures List */}
      {loading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading fixtures...</p>
        </div>
      ) : fixtures.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No fixtures found.</p>
          <Link
            to="/admin/fixtures/new"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Add your first fixture
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {fixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <select
                          value={fixture.status}
                          onChange={(e) => updateStatus(fixture.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(fixture.status)}`}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="live">Live</option>
                          <option value="completed">Completed</option>
                        </select>
                        <span className="text-sm text-gray-600 font-medium">{fixture.tournament}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4 text-center mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{fixture.team1}</h3>
                        </div>
                        <div className="px-3">
                          <span className="text-lg font-bold text-gray-400">vs</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{fixture.team2}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(fixture.match_date), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{format(new Date(fixture.match_date), 'hh:mm a')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{fixture.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/admin/fixtures/${fixture.id}/edit`}
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(fixture.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- Import from API URL logic ---
  const handleFetchApi = async () => {
    setApiError('');
    setApiLoading(true);
    setApiMatches([]);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch API');
      const data = await res.json();
      if (!data.data || !Array.isArray(data.data)) throw new Error('Invalid API response');
      setApiMatches(data.data);
    } catch (err: any) {
      setApiError(err.message || 'Unknown error');
    } finally {
      setApiLoading(false);
    }
  };

  // --- Import a match into the editor ---
  const handleImportMatch = (match: any) => {
    // Map API match fields to FixtureEditor fields via state
    const matchDate = match.dateTimeGMT || match.date;
    const dt = matchDate ? new Date(matchDate) : new Date();
    const state = {
      match_id: match.id || '',
      team1: match.teams?.[0] || '',
      team2: match.teams?.[1] || '',
      venue: match.venue || '',
      match_date: dt.toISOString().slice(0, 10),
      match_time: dt.toISOString().slice(11, 16),
      status: match.status?.toLowerCase().includes('live') ? 'live' : (match.status?.toLowerCase().includes('completed') ? 'completed' : 'upcoming'),
      tournament: match.name || '',
    };
    navigate('/admin/fixtures/new', { state });
  };

  return (
    <Routes>
      <Route index element={<FixturesList />} />
      <Route 
        path="new" 
        element={<FixtureEditor onSave={fetchFixtures} />} 
      />
      <Route 
        path=":id/edit" 
        element={<FixtureEditor onSave={fetchFixtures} />} 
      />
    </Routes>
  );
};