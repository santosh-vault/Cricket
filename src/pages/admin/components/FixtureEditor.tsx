import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';

interface FixtureFormData {
  api_url: string;
  match_id?: string;
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
      api_url: '',
      match_id: '',
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
      setValue('api_url', data.api_url || '');
      setValue('match_id', data.match_id || '');
      if (data.api_url) {
        await handleFetchApi(data.api_url);
      }
    } catch (error) {
      console.error('Error fetching fixture:', error);
      alert('Failed to load fixture');
      navigate('/admin/fixtures');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FixtureFormData) => {
    setSaving(true);
    try {
      const fixtureData = {
        api_url: data.api_url,
        match_id: data.match_id,
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

  const handleFetchApi = async (url?: string) => {
    setFetchError('');
    setFixtureDetails(null);
    try {
      const response = await fetch(url || watch('api_url'));
      if (!response.ok) throw new Error('Failed to fetch API');
      const data = await response.json();
      setFixtureDetails(data);
    } catch (err) {
      setFetchError('Could not fetch or parse fixture details from API.');
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
            {/* API URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match API URL *
              </label>
              <input
                type="url"
                {...register('api_url', { required: 'API URL is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/api/match/123"
              />
              {errors.api_url && (
                <p className="mt-1 text-sm text-red-600">{errors.api_url.message}</p>
              )}
              <button
                type="button"
                onClick={() => handleFetchApi()}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Fetch Fixture Details
              </button>
              {fetchError && <p className="mt-2 text-sm text-red-600">{fetchError}</p>}
            </div>

            {/* Display fetched fixture details */}
            {fixtureDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h2 className="text-lg font-semibold mb-2">Fixture Details</h2>
                <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(fixtureDetails, null, 2)}</pre>
              </div>
            )}
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