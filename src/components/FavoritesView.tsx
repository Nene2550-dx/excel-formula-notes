import React, { useState } from 'react';
import type { Unit, Formula } from '../types';
import { FormulaCard } from './FormulaCard';
import { FormulaDetailModal } from './FormulaDetailModal';
import { ArrowLeft, Search, Star, Sparkles, BookOpen } from 'lucide-react';

interface FavoritesViewProps {
  units: Unit[];
  formulas: Formula[];
  onBack: () => void;
  onEditFormula: (formula: Formula) => void;
  onDeleteFormula: (formulaId: string) => void;
  onMoveFormula: (formula: Formula) => void;
  onToggleFavorite: (formulaId: string) => void;
  onOpenImage: (imageUrl: string, title: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  units, formulas, onBack, onEditFormula, onDeleteFormula, onMoveFormula, onToggleFavorite, onOpenImage, onNotify
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'favorites_only' | 'exam_only'>('all');
  const [selectedFormulaForDetail, setSelectedFormulaForDetail] = useState<Formula | null>(null);

  const reviewFormulas = formulas.filter((f) => f.isFavorite || f.importance === 'exam');

  const filteredFormulas = reviewFormulas.filter((f) => {
    if (selectedUnitId !== 'all' && f.unitId !== selectedUnitId) return false;
    if (filterType === 'favorites_only' && !f.isFavorite) return false;
    if (filterType === 'exam_only' && f.importance !== 'exam') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !(f.shortDescription || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
      <button onClick={onBack} className="flex items-center gap-1.5 text-stone-500 hover:text-[var(--color-rosewood)] transition-colors mb-6 font-bold text-sm">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="bg-[var(--color-vanilla)] rounded-3xl p-8 border border-[var(--color-misty)] shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-midnight)] flex items-center gap-2 mb-2">
            ⭐ Exam Prep & Favorites
          </h1>
          <p className="text-[var(--color-midnight)]/70 text-sm font-medium max-w-xl">
            สูตรที่คุณติดดาวและเนื้อหาออกสอบรวมกันอยู่ที่นี่ เพื่อการทบทวนที่รวดเร็ว
          </p>
        </div>
        <div className="flex gap-2 bg-white/50 p-2 rounded-2xl border border-[var(--color-misty)] backdrop-blur-sm">
           <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterType === 'all' ? 'bg-[var(--color-midnight)] text-white' : 'text-stone-600'}`}>All</button>
           <button onClick={() => setFilterType('favorites_only')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${filterType === 'favorites_only' ? 'bg-amber-400 text-amber-900' : 'text-stone-600'}`}><Star size={14}/> Favs</button>
           <button onClick={() => setFilterType('exam_only')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${filterType === 'exam_only' ? 'bg-rose-500 text-white' : 'text-stone-600'}`}><Sparkles size={14}/> Exam</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFormulas.length === 0 ? (
          <div className="col-span-full text-center py-20 text-stone-400">
            <Star className="w-12 h-12 mx-auto mb-4 text-stone-300" />
            <p className="font-bold">No formulas here yet.</p>
          </div>
        ) : (
          filteredFormulas.map(formula => (
            <FormulaCard 
              key={formula.id} 
              formula={formula} 
              onViewDetails={setSelectedFormulaForDetail}
              onToggleFavorite={onToggleFavorite} 
            />
          ))
        )}
      </div>

      <FormulaDetailModal 
        isOpen={!!selectedFormulaForDetail}
        formula={selectedFormulaForDetail!}
        onClose={() => setSelectedFormulaForDetail(null)}
        onEdit={onEditFormula}
        onDelete={onDeleteFormula}
        onMove={onMoveFormula}
        onOpenImage={onOpenImage}
      />
    </div>
  );
};
