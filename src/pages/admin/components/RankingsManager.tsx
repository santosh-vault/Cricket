import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface Ranking {
  id: string;
  format: 'test' | 'odi' | 't20';
  category: 'team';
  rank: number;
  team_name: string;
  flag_emoji: string;
  rating: number;
  updated_at: string;
}

const formats = ['test', 'odi', 't20'] as const;
const categories = ['team'] as const;

export const RankingsManager: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'test'|'odi'|'t20'>('test');
  const [rankings, setRankings] = useState<Record<string, Ranking[]>>({
    team: []
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Ranking>>({ format: 'test', category: 'team' });
  const [editingId, setEditingId] = useState<string|null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => { fetchAllRankings(); }, [selectedFormat]);

  async function fetchAllRankings() {
    setLoading(true);
    const newRankings: Record<string, Ranking[]> = {
      team: []
    };

    try {
      const { data, error } = await supabase
        .from('icc_rankings')
        .select('*')
        .eq('format', selectedFormat)
        .eq('category', 'team')
        .order('rank', { ascending: true });
      
      if (!error) {
        newRankings.team = data || [];
      }

      setRankings(newRankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
    setLoading(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.team_name || !form.rank || !form.rating) return;
    
    if (editingId) {
      await supabase.from('icc_rankings').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editingId);
    } else {
      await supabase.from('icc_rankings').insert([{ ...form, updated_at: new Date().toISOString() }]);
    }
    setShowForm(false); 
    setForm({ format: selectedFormat, category: 'team' }); 
    setEditingId(null);
    fetchAllRankings();
  }

  async function handleEdit(r: Ranking) {
    setForm(r); 
    setShowForm(true); 
    setEditingId(r.id);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Delete this ranking?')) {
      await supabase.from('icc_rankings').delete().eq('id', id);
      fetchAllRankings();
    }
  }

  function getDisplayName(ranking: Ranking) {
    return ranking.team_name || 'Unknown';
  }

  console.log('RankingsManager render - showForm:', showForm);
  return (
    <div className="max-w-7xl mx-auto py-8 admin-panel">
      <h1 className="text-3xl font-bold mb-6">Manage ICC Rankings</h1>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          User: {user?.email || 'Not logged in'} | Admin: {isAdmin ? 'Yes' : 'No'}
        </p>
      </div>
      
      {/* Format Selection and Add Button Row */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-4">
          {formats.map(f => (
            <button 
              key={f} 
              onClick={() => setSelectedFormat(f)} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedFormat===f
                  ?'bg-blue-900 text-white shadow-md'
                  :'bg-blue-50 text-blue-900 hover:bg-blue-100'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        
        {isAdmin ? (
          <div className="flex gap-2">
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200 shadow-md" 
              onClick={()=>{
                console.log('Add New Ranking button clicked');
                setShowForm(true);
                setForm({format:selectedFormat,category:'team'});
                setEditingId(null);
                console.log('showForm set to true');
              }}
            >
              <Plus className="h-5 w-5 mr-2"/>Add New Ranking
            </button>
            <button 
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md" 
              onClick={()=>{
                console.log('Test modal button clicked');
                alert('Test modal button clicked!');
                setShowForm(true);
              }}
            >
              Test Modal
            </button>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">You need admin privileges to add/edit rankings.</p>
          </div>
        )}
      </div>
      
      {/* Popup Modal for Add/Edit Form */}
      {showForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingId ? 'Edit Ranking' : 'Add New Ranking'} - MODAL IS WORKING!
                </h3>
                <button 
                  onClick={() => {setShowForm(false); setEditingId(null);}}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select name="format" value={form.format} onChange={handleInput} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {formats.map(f=>(<option key={f} value={f}>{f.toUpperCase()}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input name="category" value="team" readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                    <input name="rank" type="number" min={1} value={form.rank||''} onChange={handleInput} placeholder="Rank" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input name="team_name" value={form.team_name||''} onChange={handleInput} placeholder="Team Name" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Flag Emoji</label>
                    <input name="flag_emoji" value={form.flag_emoji||''} onChange={handleInput} placeholder="Flag Emoji" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input name="rating" type="number" min={0} step="0.01" value={form.rating||''} onChange={handleInput} placeholder="Rating" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                    {editingId?'Update':'Add'} Ranking
                  </button>
                  <button 
                    type="button" 
                    className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold" 
                    onClick={()=>{setShowForm(false);setEditingId(null);}}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rankings Grid - Separate Columns for Each Category */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rankings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900">
              Team Rankings
            </h3>
            <p className="text-sm text-blue-700">{rankings.team?.length || 0} entries</p>
          </div>
          
          <div className="p-4">
            {rankings.team?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No team rankings found.</p>
            ) : (
              <div className="space-y-3">
                {rankings.team?.map(ranking => (
                  <div key={ranking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {ranking.rank}
                      </span>
                      <span className="text-2xl">{ranking.flag_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{getDisplayName(ranking)}</p>
                        <p className="text-sm text-gray-600">{ranking.rating}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200" 
                          onClick={()=>handleEdit(ranking)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4"/>
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200" 
                          onClick={()=>handleDelete(ranking.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4"/>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 