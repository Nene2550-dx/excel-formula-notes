import React, { useState, useEffect } from 'react';
import type { Unit, Formula, UserProfile } from '../types';
import { storageService } from '../services/storage';
import { Folder, ArrowRight, BookOpen, Clock, Edit3, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { FormulaCard } from './FormulaCard';

interface DashboardProps {
  units: Unit[];
  formulas: Formula[];
  onSelectUnit: (unitId: string) => void;
  onOpenAddUnit: () => void;
  onOpenAddFormula: () => void;
  onOpenAIImport: () => void;
  onEditUnit: (unit: Unit) => void;
  onDeleteUnit: (unitId: string) => void;
  onMoveUnit: (unitId: string, direction: 'up' | 'down') => void;
  onReorderUnits: (newOrder: Unit[]) => void;
}

const FOLDER_COLORS = [
  { base: 'var(--color-dusty)', light: '#E8B6C0' },
  { base: 'var(--color-sage)', light: '#C4D1B6' },
  { base: 'var(--color-powder)', light: '#C9D8E6' },
  { base: 'var(--color-mauve)', light: '#CD98A1' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  units,
  formulas,
  onSelectUnit,
  onOpenAddUnit,
  onEditUnit,
  onDeleteUnit,
  onMoveUnit,
  onReorderUnits,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [profile, setProfile] = useState<UserProfile>({ name: '', bio: '' });
  
  useEffect(() => {
    setProfile(storageService.getProfile());
    const handleProfileUpdate = () => setProfile(storageService.getProfile());
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);
  
  const getFormulaCountForUnit = (unitId: string) => {
    return formulas.filter((f) => f.unitId === unitId).length;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newUnits = [...units];
    const [movedUnit] = newUnits.splice(draggedIndex, 1);
    newUnits.splice(targetIndex, 0, movedUnit);
    
    const updatedUnits = newUnits.map((u, i) => ({ ...u, order: i + 1 }));
    onReorderUnits(updatedUnits);
    setDraggedIndex(null);
  };

  const favoritesCount = formulas.filter(f => f.isFavorite).length;
  const draftsCount = formulas.filter(f => f.isDraft).length;
  const recentFormulas = [...formulas].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  const continueUnit = units.length > 0 ? units[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-24 w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-normal text-[var(--color-ink)] mb-2 tracking-tight">
          Good morning ✿
        </h1>
        <p className="text-[var(--color-ink)]/70 text-base font-medium">
          Ready to learn Excel?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="flex flex-wrap gap-4 mb-12">
        <div className="bg-white px-5 py-3 rounded-2xl border border-[var(--color-powder)] shadow-sm flex items-center gap-3">
          <Folder className="w-5 h-5 text-[var(--color-dusty)]" />
          <span className="font-bold">{units.length} <span className="text-[var(--color-ink)]/60 font-medium ml-1">Units</span></span>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-[var(--color-powder)] shadow-sm flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[var(--color-sage)]" />
          <span className="font-bold">{formulas.length} <span className="text-[var(--color-ink)]/60 font-medium ml-1">Formulas</span></span>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-[var(--color-powder)] shadow-sm flex items-center gap-3">
          <span className="text-[var(--color-mauve)] font-serif italic font-bold">★</span>
          <span className="font-bold">{favoritesCount} <span className="text-[var(--color-ink)]/60 font-medium ml-1">Favorites</span></span>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-[var(--color-powder)] shadow-sm flex items-center gap-3">
          <Edit3 className="w-5 h-5 text-[var(--color-powder)]" />
          <span className="font-bold">{draftsCount} <span className="text-[var(--color-ink)]/60 font-medium ml-1">Drafts</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column: Units */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">My Units</h2>
          </div>
          
          {units.length === 0 ? (
            <div className="paper-note p-10 text-center">
              <h3 className="text-xl font-serif font-bold mb-2">Let's start your digital notebook!</h3>
              <p className="text-sm opacity-70 mb-6">Create your first unit to start learning.</p>
              <button onClick={onOpenAddUnit} className="px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-white font-semibold text-sm transition-all">+ New Unit</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
              {units.map((unit, index) => {
                const formulaCount = getFormulaCountForUnit(unit.id);
                const colorPair = FOLDER_COLORS[index % FOLDER_COLORS.length];
                
                return (
                  <div
                    key={unit.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`folder-container relative h-48 cursor-pointer group ${draggedIndex === index ? 'opacity-40' : ''}`}
                    onClick={() => onSelectUnit(unit.id)}
                  >
                    {/* Folder Tab */}
                    <div 
                      className="folder-tab absolute -top-4 left-0 w-1/2 h-5 rounded-tr-lg rounded-tl-md shadow-sm border border-black/5"
                      style={{ backgroundColor: colorPair.base }}
                    ></div>
                    
                    {/* Back of Folder */}
                    <div 
                      className="absolute inset-0 rounded-2xl rounded-tl-none shadow-md border border-black/5"
                      style={{ backgroundColor: colorPair.base }}
                    >
                      {/* Paper sheets sticking out */}
                      <div className="absolute inset-x-2 top-2 bottom-4 bg-[var(--color-ivory)] notebook-texture rounded-xl shadow-sm transform -rotate-1 border border-stone-200"></div>
                      <div className="absolute inset-x-2 top-2 bottom-4 bg-white rounded-xl shadow-sm transform rotate-2 border border-stone-200"></div>
                    </div>

                    {/* Front of Folder */}
                    <div 
                      className="folder-front absolute inset-0 rounded-2xl rounded-tl-none shadow-sm flex flex-col justify-between p-5 border-t border-white/40"
                      style={{ backgroundColor: colorPair.light, backdropFilter: 'blur(4px)' }}
                    >
                      {/* Controls (Hidden until hover) */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 rounded-full px-2 py-1 shadow-sm" onClick={e => e.stopPropagation()}>
                        <button onClick={() => onMoveUnit(unit.id, 'up')} disabled={index === 0} className="p-1 hover:text-[var(--color-dusty)] disabled:opacity-20"><ArrowUp size={14}/></button>
                        <button onClick={() => onMoveUnit(unit.id, 'down')} disabled={index === units.length - 1} className="p-1 hover:text-[var(--color-dusty)] disabled:opacity-20"><ArrowDown size={14}/></button>
                        <div className="w-px h-3 bg-stone-300 mx-1"></div>
                        <button onClick={() => onEditUnit(unit)} className="p-1 hover:text-[var(--color-ink)]"><Edit3 size={14}/></button>
                        <button onClick={() => onDeleteUnit(unit.id)} className="p-1 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>

                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-md bg-white/70 text-[10px] font-bold text-[var(--color-ink)] uppercase mb-3 border border-white/50 backdrop-blur-sm shadow-sm">
                          {unit.icon || '📁'} UNIT {unit.unitNumber}
                        </span>
                        <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] leading-tight mb-2 line-clamp-2">
                          {unit.title}
                        </h3>
                      </div>

                      <div className="text-xs font-medium text-[var(--color-ink)]/70 flex items-center justify-between">
                        <span>{formulaCount} formulas</span>
                        <ArrowRight size={14} className="text-[var(--color-ink)]/40" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Continue & Recent */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Continue Learning */}
          {continueUnit && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-4">Continue Learning</h2>
              <div 
                onClick={() => onSelectUnit(continueUnit.id)}
                className="paper-note p-5 cursor-pointer hover:border-[var(--color-dusty)] transition-colors group relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 text-8xl">✿</div>
                <div className="text-xs font-bold text-[var(--color-sage)] uppercase mb-1">Last Opened</div>
                <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-[var(--color-dusty)] transition-colors">{continueUnit.title}</h3>
                <p className="text-sm text-[var(--color-ink)]/60 line-clamp-2 mb-4">{continueUnit.description || "Pick up where you left off."}</p>
                <div className="flex items-center text-xs font-bold gap-1 text-[var(--color-ink)]">
                  Open Unit <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {/* Recent Notes */}
          <div>
             <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[var(--color-powder)]" /> Recent Notes
             </h2>
             <div className="space-y-3">
               {recentFormulas.length === 0 ? (
                 <p className="text-sm text-stone-400">No notes yet.</p>
               ) : (
                 recentFormulas.map(formula => (
                   <div key={formula.id} className="bg-white border border-[var(--color-ivory)] shadow-sm rounded-xl p-3 flex flex-col gap-1">
                     <div className="flex items-center justify-between">
                       <span className="font-mono text-xs font-bold text-[var(--color-sage)]">{formula.name}</span>
                       <span className="text-[10px] text-stone-400">{new Date(formula.updatedAt).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-[var(--color-ink)] line-clamp-1">{formula.shortDescription || formula.purpose}</p>
                   </div>
                 ))
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
