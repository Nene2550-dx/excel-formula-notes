import React, { useState, useEffect, useRef } from 'react';
import type { Formula, Unit } from '../types';
import { Search, X, Folder } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  formulas: Formula[];
  units: Unit[];
  onSelectFormula: (formula: Formula) => void;
  onSelectUnit: (unit: Unit) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, formulas, units, onSelectFormula, onSelectUnit }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase();
  
  const searchResults = formulas.filter(f => 
    f.name.toLowerCase().includes(q) || 
    (f.shortDescription && f.shortDescription.toLowerCase().includes(q)) ||
    f.formula.toLowerCase().includes(q) ||
    (f.purpose && f.purpose.toLowerCase().includes(q))
  ).slice(0, 10);

  const unitResults = units.filter(u => 
    u.title.toLowerCase().includes(q) || 
    u.description.toLowerCase().includes(q)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 pb-4 px-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-4 border-b border-[var(--color-powder)]">
          <Search className="text-stone-400 mr-3" size={24} />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search formulas, notes, examples... (e.g. หาค่าเฉลี่ย, IF)" 
            className="flex-1 text-xl font-serif text-[var(--color-ink)] bg-transparent border-none focus:outline-none focus:ring-0"
          />
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-[var(--color-ink)] transition-colors rounded-full bg-[var(--color-ivory)]">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[var(--color-ivory)]/30">
          {!query ? (
            <div className="py-12 text-center text-stone-400">
              <p className="font-serif italic">Type anything to start searching...</p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono">
                <span className="bg-stone-100 px-2 py-1 rounded">esc to close</span>
                <span className="bg-stone-100 px-2 py-1 rounded">⌘K to open</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {unitResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 px-2">Units</h3>
                  <div className="space-y-2">
                    {unitResults.map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => { onSelectUnit(u); onClose(); }}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--color-powder)] hover:border-[var(--color-dusty)] cursor-pointer transition-colors"
                      >
                        <div className="text-2xl">{u.icon || '📁'}</div>
                        <div>
                          <div className="font-bold text-[var(--color-ink)] text-sm">{u.title}</div>
                          <div className="text-xs text-stone-500 truncate">{u.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 px-2">Formulas</h3>
                  <div className="space-y-3">
                    {searchResults.map(f => (
                      <div key={f.id} className="bg-white rounded-2xl border border-[var(--color-powder)] hover:shadow-md transition-shadow overflow-hidden">
                        <div 
                          onClick={() => { onSelectFormula(f); onClose(); }}
                          className="p-4 cursor-pointer hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-[var(--color-ink)] text-lg">{f.name}</h4>
                            <div className="flex gap-2">
                              {f.category && <span className="text-[10px] bg-stone-100 px-2 py-1 rounded font-bold text-stone-500 uppercase">{f.category}</span>}
                            </div>
                          </div>
                          <p className="text-sm text-stone-600 line-clamp-1">{f.shortDescription || f.purpose}</p>
                        </div>
                        
                        <div className="bg-[var(--color-ink)] p-3 flex items-center justify-between gap-4">
                          <code className="text-[var(--color-ivory)] font-mono text-sm truncate flex-1">{f.formula}</code>
                          <CopyButton textToCopy={f.formula} variant="primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && unitResults.length === 0 && (
                <div className="py-12 text-center text-stone-500">
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
