import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Formula } from '../types';
import { FormulaCard } from './FormulaCard';

export const FormulaLibraryView: React.FC = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'formula' | 'tool' | 'favorite' | 'exam'>('all');

  useEffect(() => {
    storageService.getFormulas().then(setFormulas);
  }, []);

  const filtered = formulas.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterType === 'formula') return f.type !== 'tool';
    if (filterType === 'tool') return f.type === 'tool';
    if (filterType === 'favorite') return f.isFavorite;
    if (filterType === 'exam') return f.importance === 'exam';
    return true;
  });

  return (
    <div className="h-full bg-[var(--color-ivory)] overflow-y-auto p-8 relative">
      <div className="max-w-5xl mx-auto space-y-8 pb-32">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[var(--color-ink)] mb-2">Formula Library</h1>
            <p className="text-stone-500 font-medium">รวมสูตร Excel และเครื่องมือทั้งหมด</p>
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl w-max shadow-sm border border-[var(--color-powder)]">
          <button onClick={() => setFilterType('all')} className={filterType === 'all' ? 'px-6 py-2 rounded-xl font-bold text-sm transition-all bg-[var(--color-ink)] text-white shadow-sm' : 'px-6 py-2 rounded-xl font-bold text-sm transition-all text-stone-500 hover:text-[var(--color-ink)]'}>All</button>
          <button onClick={() => setFilterType('formula')} className={filterType === 'formula' ? 'px-6 py-2 rounded-xl font-bold text-sm transition-all bg-blue-600 text-white shadow-sm' : 'px-6 py-2 rounded-xl font-bold text-sm transition-all text-stone-500 hover:text-blue-600'}>🧮 Formulas</button>
          <button onClick={() => setFilterType('tool')} className={filterType === 'tool' ? 'px-6 py-2 rounded-xl font-bold text-sm transition-all bg-amber-600 text-white shadow-sm' : 'px-6 py-2 rounded-xl font-bold text-sm transition-all text-stone-500 hover:text-amber-600'}>🛠 Excel Tools</button>
          <button onClick={() => setFilterType('favorite')} className={filterType === 'favorite' ? 'px-6 py-2 rounded-xl font-bold text-sm transition-all bg-amber-400 text-white shadow-sm' : 'px-6 py-2 rounded-xl font-bold text-sm transition-all text-stone-500 hover:text-amber-500'}>⭐ Favorites</button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text" 
            placeholder="🔍 Search (e.g. VLOOKUP, Freeze Panes)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-[var(--color-powder)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-medium text-[var(--color-ink)]"
          />
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-medium bg-white rounded-3xl border border-dashed border-[var(--color-powder)]">ยังไม่มีข้อมูลในหมวดหมู่นี้</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(f => (
              <FormulaCard key={f.id} formula={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
