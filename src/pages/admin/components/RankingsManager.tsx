import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Ranking {
  id: string;
  format: 'test' | 'odi' | 't20';
  category: 'team' | 'batter' | 'bowler' | 'allrounder';
  rank: number;
  team_name: string;
  flag_emoji: string;
  rating: number;
  updated_at: string;
}

const formats = ['test', 'odi', 't20'] as const;
const categories = ['team', 'batter', 'bowler', 'allrounder'] as const;

export const RankingsManager: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'test'|'odi'|'t20'>('test');
  const [selectedCategory, setSelectedCategory] = useState<'team'|'batter'|'bowler'|'allrounder'>('team');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Ranking>>({ format: 'test', category: 'team' });
  const [editingId, setEditingId] = useState<string|null>(null);

  useEffect(() => { fetchRankings(); }, [selectedFormat, selectedCategory]);

  async function fetchRankings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('icc_rankings')
      .select('*')
      .eq('format', selectedFormat)
      .eq('category', selectedCategory)
      .order('rank', { ascending: true });
    if (!error) setRankings(data || []);
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
    setShowForm(false); setForm({ format: selectedFormat, category: selectedCategory }); setEditingId(null);
    fetchRankings();
  }

  async function handleEdit(r: Ranking) {
    setForm(r); setShowForm(true); setEditingId(r.id);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Delete this ranking?')) {
      await supabase.from('icc_rankings').delete().eq('id', id);
      fetchRankings();
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage ICC Rankings</h1>
      <div className="flex gap-4 mb-4">
        {formats.map(f => (
          <button key={f} onClick={() => setSelectedFormat(f)} className={`px-4 py-2 rounded ${selectedFormat===f?'bg-blue-900 text-white':'bg-blue-50 text-blue-900'}`}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div className="flex gap-4 mb-6">
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1 rounded ${selectedCategory===c?'bg-blue-900 text-white':'bg-blue-50 text-blue-900'}`}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>
        ))}
      </div>
      <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded flex items-center" onClick={()=>{setShowForm(true);setForm({format:selectedFormat,category:selectedCategory});setEditingId(null);}}><Plus className="h-4 w-4 mr-2"/>Add Ranking</button>
      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3">
          <div className="flex gap-3">
            <select name="format" value={form.format} onChange={handleInput} className="border rounded px-2 py-1">
              {formats.map(f=>(<option key={f} value={f}>{f.toUpperCase()}</option>))}
            </select>
            <select name="category" value={form.category} onChange={handleInput} className="border rounded px-2 py-1">
              {categories.map(c=>(<option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>))}
            </select>
            <input name="rank" type="number" min={1} value={form.rank||''} onChange={handleInput} placeholder="Rank" className="border rounded px-2 py-1 w-20"/>
            <input name="team_name" value={form.team_name||''} onChange={handleInput} placeholder="Team/Player Name" className="border rounded px-2 py-1 flex-1"/>
            <input name="flag_emoji" value={form.flag_emoji||''} onChange={handleInput} placeholder="Flag Emoji" className="border rounded px-2 py-1 w-20"/>
            <input name="rating" type="number" min={0} value={form.rating||''} onChange={handleInput} placeholder="Rating" className="border rounded px-2 py-1 w-24"/>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">{editingId?'Update':'Add'}</button>
            <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={()=>{setShowForm(false);setEditingId(null);}}>Cancel</button>
          </div>
        </form>
      )}
      <div className="bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Flag</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Updated</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : rankings.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8">No rankings found.</td></tr>
            ) : rankings.map(r => (
              <tr key={r.id} className="hover:bg-blue-50">
                <td className="px-4 py-2">{r.rank}</td>
                <td className="px-4 py-2 text-xl">{r.flag_emoji}</td>
                <td className="px-4 py-2">{r.team_name}</td>
                <td className="px-4 py-2">{r.rating}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{r.updated_at ? new Date(r.updated_at).toLocaleDateString() : ''}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-600" onClick={()=>handleEdit(r)}><Edit className="h-4 w-4"/></button>
                  <button className="text-red-600" onClick={()=>handleDelete(r.id)}><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 