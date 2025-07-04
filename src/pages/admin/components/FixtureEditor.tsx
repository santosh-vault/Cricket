import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';

interface FixtureFormData {
  match_id?: string;
  team1: string;
  team2: string;
  match_date: string;
  match_time: string;
  venue: string;
  tournament: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface FixtureEditorProps {
  onSave: () => void;
}

export const FixtureEditor: React.FC<FixtureEditorProps> = ({ onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(id);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FixtureFormData>({
    defaultValues: {
      match_id: '',
      team1: '',
      team2: '',
      match_date: '',
      match_time: '',
      venue: '',
      tournament: '',
      status: 'upcoming',
    }
  });

  const [fixtureDetails, setFixtureDetails] = useState<any>(null);
  const [fetchError, setFetchError] = useState('');

  const commonTeams = [
    'India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 
    'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan', 'Zimbabwe', 'Ireland',
    'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 
    'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings', 'Rajasthan Royals',
    'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants'
  ];

  const tournaments = [
    'ICC Cricket World Cup', 'ICC T20 World Cup', 'ICC Champions Trophy',
    'Indian Premier League', 'Big Bash League', 'Caribbean Premier League',
    'Pakistan Super League', 'The Hundred', 'County Championship',
    'Ranji Trophy', 'Duleep Trophy', 'Border-Gavaskar Trophy',
    'Ashes Series', 'Asia Cup', 'Bilateral Series'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchFixture();
    } else {
      // Auto-generate match_id for new fixture
      setValue('match_id', `MATCH_${Date.now()}`);
    }
  }, [id]);

  const fetchFixture = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setValue('match_id', data.match_id || '');
      setValue('team1', data.team1 || '');
      setValue('team2', data.team2 || '');
      setValue('match_date', data.match_date || '');
      setValue('match_time', data.match_time || '');
      setValue('venue', data.venue || '');
      setValue('tournament', data.tournament || '');
      setValue('status', data.status || 'upcoming');
    } catch (error) {
      console.error('Error fetching fixture:', error);
      alert('Failed to load fixture');
      navigate('/admin/fixtures');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FixtureFormData) => {
    if (!window.confirm('Are you sure you want to save this fixture?')) return;
    setSaving(true);
    try {
      const fixtureData = {
        match_id: data.match_id,
        team1: data.team1,
        team2: data.team2,
        match_date: data.match_date,
        match_time: data.match_time,
        venue: data.venue,
        tournament: data.tournament,
        status: data.status,
        created_at: new Date().toISOString(),
      };
      let error;
      if (isEditing) {
        ({ error } = await supabase
          .from('fixtures')
          .update(fixtureData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('fixtures')
          .insert(fixtureData));
      }
      if (error) throw error;
      onSave();
      navigate('/admin/fixtures');
    } catch (error) {
      console.error('Error saving fixture:', error);
      alert('Failed to save fixture');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/fixtures"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fixtures
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit' : 'Create'} Fixture
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Add manual match details fields to the form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team 1 *</label>
                <input type="text" {...register('team1', { required: 'Team 1 is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Team 1" />
                {errors.team1 && <p className="mt-1 text-sm text-brand-600">{errors.team1.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team 2 *</label>
                <input type="text" {...register('team2', { required: 'Team 2 is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Team 2" />
                {errors.team2 && <p className="mt-1 text-sm text-brand-600">{errors.team2.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Date *</label>
                <input type="date" {...register('match_date', { required: 'Match date is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                {errors.match_date && <p className="mt-1 text-sm text-brand-600">{errors.match_date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Time *</label>
                <input type="time" {...register('match_time', { required: 'Match time is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                {errors.match_time && <p className="mt-1 text-sm text-brand-600">{errors.match_time.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                <input type="text" {...register('venue', { required: 'Venue is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Venue" />
                {errors.venue && <p className="mt-1 text-sm text-brand-600">{errors.venue.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tournament *</label>
                <input type="text" {...register('tournament', { required: 'Tournament is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Tournament" />
                {errors.tournament && <p className="mt-1 text-sm text-brand-600">{errors.tournament.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select {...register('status', { required: 'Status is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-brand-600">{errors.status.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/fixtures"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Fixture'}
          </button>
        </div>
      </form>
    </div>
  );
};