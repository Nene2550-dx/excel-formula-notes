import React, { useState, useMemo } from 'react';
import type { Formula } from '../types';
import { Search, Filter, BookOpen } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface ExamModeViewProps {
  formulas: Formula[];
  onBack: () => void;
}

const CATEGORIES = ['All', 'Favorites', 'Math', 'Logical', 'Lookup', 'Text', 'Date & Time', 'Statistics', 'Financial', 'Other'];

export const ExamModeView: React.FC<ExamModeViewProps> = ({ formulas, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFormulas = useMemo(() => {
    return formulas.filter(f => {
      // Filter by Category
      if (activeCategory === 'Favorites' && !f.isFavorite) return false;
      if (activeCategory !== 'All' && activeCategory !== 'Favorites') {
        const cat = f.category || 'Other';
        if (cat !== activeCategory) return false;
      }

      // Filter by Search
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        (f.shortDescription && f.shortDescription.toLowerCase().includes(q)) ||
        f.formula.toLowerCase().includes(q) ||
        (f.syntax && f.syntax.toLowerCase().includes(q)) ||
        (f.purpose && f.purpose.toLowerCase().includes(q)) ||
        (f.example && f.example.toLowerCase().includes(q))
      );
    });
  }, [formulas, searchQuery, activeCategory]);

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-50">
      {/* Header - Minimal & Distraction Free */}
      <div className="px-6 py-4 md:px-12 md:py-6 bg-white border-b border-[var(--color-powder)] sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-black text-[var(--color-ink)] flex items-center gap-2">
            <BookOpen size={24} className="text-[var(--color-dusty)]" /> EXAM MODE
          </h1>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mt-1">Find. Read. Copy. Use.</p>
        </div>
        
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Search for any formula (e.g. IF, Lookup, หาผลรวม)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-stone-100 border-none rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-medium transition-all"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400 bg-white px-2 py-0.5 rounded border shadow-sm hidden md:block">
            /
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-[var(--color-powder)] px-6 md:px-12 py-3 flex gap-2 overflow-x-auto custom-scrollbar sticky top-[80px] md:top-[92px] z-10">
        <Filter size={16} className="text-stone-400 shrink-0 mt-1 mr-2" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
              activeCategory === cat 
                ? cat === 'Favorites' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-[var(--color-ink)] border-[var(--color-ink)] text-white'
                : 'bg-white border-[var(--color-powder)] text-stone-600 hover:bg-stone-100'
            }`}
          >
            {cat === 'Favorites' ? '⭐ My Important Formulas' : cat}
          </button>
        ))}
      </div>

      {/* Cheat Sheet Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
          
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-20 text-stone-500 font-medium">
              <p className="text-lg">No formulas found.</p>
              <p className="text-sm opacity-80 mt-2">Try searching with a different keyword or category.</p>
            </div>
          ) : (
            filteredFormulas.map(f => (
              <div key={f.id} className="bg-white rounded-2xl border border-[var(--color-powder)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Visual Anchor: The Formula */}
                <div className="bg-[var(--color-ink)] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <code className="text-lg md:text-xl font-mono font-bold text-[var(--color-ivory)] break-all flex-1">
                    {f.formula}
                  </code>
                  <CopyButton textToCopy={f.formula} label="Copy Formula" className="shrink-0 py-2.5 px-6 text-sm" />
                </div>
                
                {/* Info Hierarchy */}
                <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-black text-stone-900 tracking-tight">{f.name}</h2>
                        {f.isFavorite && <span title="Favorite" className="text-amber-400">⭐</span>}
                      </div>
                      <p className="text-stone-700 font-medium leading-relaxed">{f.purpose || f.shortDescription}</p>
                    </div>

                    {f.syntax && (
                      <div>
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Syntax</h4>
                        <div className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded-lg border border-stone-100">
                          <code className="text-sm font-mono text-stone-700 truncate mr-2">{f.syntax}</code>
                          <CopyButton textToCopy={f.syntax} variant="ghost" label="Copy Syntax" />
                        </div>
                      </div>
                    )}
                    
                    {f.example && (
                      <div>
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Example</h4>
                        <div className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded-lg border border-stone-100">
                          <code className="text-sm font-mono text-stone-700 truncate mr-2">{f.example}</code>
                          <CopyButton textToCopy={f.example} variant="ghost" label="Copy Example" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Info (Warning / Tips) */}
                  <div className="space-y-4 lg:pl-6 lg:border-l lg:border-[var(--color-powder)]">
                    {f.teacherNote && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          ⚠ Common Error / Tips
                        </h4>
                        <p className="text-sm text-amber-900 leading-relaxed">{f.teacherNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
        </div>
      </div>
    </div>
  );
};
