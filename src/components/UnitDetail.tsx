import React, { useState } from 'react';
import type { Formula, Unit } from '../types';
import { ArrowLeft, Edit3, Paintbrush, Filter, PlusCircle, Search } from 'lucide-react';
import { FormulaCard } from './FormulaCard';
import { FormulaDetailModal } from './FormulaDetailModal';
import { RichNoteEditor } from './RichNoteEditor';
import { validateFormula } from '../utils/formulaValidator';

interface UnitDetailProps {
  unit: Unit;
  formulas: Formula[];
  onBack: () => void;
  onOpenAddFormula: (unitId: string) => void;
  onOpenQuickNote: (unitId: string) => void;
  onEditUnit: (unit: Unit) => void;
  onDeleteUnit: (unitId: string) => void;
  onEditFormula: (formula: Formula) => void;
  onDeleteFormula: (formulaId: string) => void;
  onMoveFormula: (formula: Formula) => void;
  onToggleFavorite: (formulaId: string) => void;
  onOpenImage: (imageUrl: string, title: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type ViewMode = 'all' | 'study' | 'formula' | 'example' | 'steps' | 'exam';

export const UnitDetail = ({
  unit, formulas, onBack, onOpenAddFormula, onOpenQuickNote,
  onEditUnit, onDeleteUnit, onEditFormula, onDeleteFormula, onMoveFormula,
  onToggleFavorite, onOpenImage, onNotify
}: UnitDetailProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedFormulaForDetail, setSelectedFormulaForDetail] = useState<Formula | null>(null);

  const unitFormulas = formulas.filter((f) => f.unitId === unit.id || f.unitId === String(unit.id));
  console.log('Unit Formulas for', unit.id, unitFormulas);

  const handleSaveContent = async (updatedUnit: Unit) => {
    onEditUnit(updatedUnit);
  };

  const ViewSelector = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar my-6 items-center w-full">
       <button onClick={() => setViewMode('all')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${viewMode === 'all' ? 'bg-[var(--color-ink)] text-white' : 'bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-50'}`}>All</button>
       <button onClick={() => setViewMode('study')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${viewMode === 'study' ? 'bg-[var(--color-ink)] text-white' : 'bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-50'}`}>Study</button>
       <button onClick={() => setViewMode('formula')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${viewMode === 'formula' ? 'bg-[var(--color-ink)] text-white' : 'bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-50'}`}>Formula</button>
       <button onClick={() => setViewMode('example')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${viewMode === 'example' ? 'bg-[var(--color-ink)] text-white' : 'bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-50'}`}>Example</button>
       <button onClick={() => setViewMode('steps')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${viewMode === 'steps' ? 'bg-[var(--color-ink)] text-white' : 'bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-50'}`}>Steps</button>
       <button onClick={() => setViewMode('exam')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${viewMode === 'exam' ? 'bg-[var(--color-dusty)] text-white' : 'bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-50'}`}>⭐ Exam</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#faf9f6] overflow-y-auto custom-scrollbar relative">
      
      <div className="w-full max-w-4xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-stone-500 hover:text-[var(--color-ink)] transition-colors mb-6 font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{unit.icon || '📁'}</span>
                <span className="text-xs font-bold text-[var(--color-dusty)] uppercase tracking-wider bg-[var(--color-dusty)]/10 px-2 py-1 rounded">
                  UNIT {unit.unitNumber}
                </span>
              </div>
              <h1 className="text-4xl font-serif font-extrabold text-[var(--color-ink)] mb-2">{unit.title}</h1>
              <p className="text-[var(--color-ink)]/60 text-base font-medium max-w-2xl">{unit.description || 'Everything I learned in this chapter.'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => onEditUnit(unit)} className="px-3 py-2 bg-white border border-[var(--color-powder)] rounded-full text-stone-500 hover:text-[var(--color-ink)] shadow-sm font-bold text-xs flex items-center gap-1"><Edit3 size={14}/> Edit Info</button>
            </div>
          </div>
        </div>

        <ViewSelector />

        {/* Content Area - Vertical Stacking */}
        <div className="space-y-12 pb-32">
          
          {/* STUDY CONTENT (Visible in All, Study) */}
          {(viewMode === 'all' || viewMode === 'study') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-powder)] pb-2">
                 <h2 className="text-lg font-serif font-bold text-[var(--color-ink)] flex items-center gap-2">
                   📖 Study Content
                 </h2>
                 <div className="text-xs font-bold text-stone-400">Expand / Collapse in Editor</div>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-powder)] overflow-hidden">
                <RichNoteEditor unit={unit} onSave={handleSaveContent} />
              </div>
            </div>
          )}

          {/* FORMULAS (Visible in All, Formula, Exam) */}
          {(viewMode === 'all' || viewMode === 'formula' || viewMode === 'exam') && (
            <div className="space-y-4">
               <div className="flex items-center justify-between border-b border-[var(--color-powder)] pb-2">
                 <h2 className="text-lg font-serif font-bold text-[var(--color-ink)] flex items-center gap-2">
                   🧮 Formulas & Excel Tools
                 </h2>
                 <button onClick={() => onOpenAddFormula(unit.id)} className="px-3 py-1 bg-[var(--color-ink)] text-white text-xs font-bold rounded-full shadow-sm hover:bg-stone-800 transition-colors">+ Add Formula / Tool</button>
              </div>

              {unitFormulas.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-[var(--color-powder)] border-dashed text-stone-400 font-medium text-sm">
                  ยังไม่มีสูตรหรือเครื่องมือใน Unit นี้ (Current Unit ID: {unit.id})<br/><br/>
                  <span className="text-xs text-rose-400">DEBUG: Formulas in database: {formulas.length}. Unit IDs found: {formulas.map(f => f.unitId).join(', ')}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {unitFormulas.map(formula => (
                    <FormulaCard 
                      key={formula.id} 
                      formula={formula} 
                      onViewDetails={setSelectedFormulaForDetail}
                      onToggleFavorite={onToggleFavorite} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EXAMPLES (Visible in All, Example) */}
          {(viewMode === 'all' || viewMode === 'example') && (
            <div className="space-y-4">
               <div className="flex items-center justify-between border-b border-[var(--color-powder)] pb-2">
                 <h2 className="text-lg font-serif font-bold text-[var(--color-ink)] flex items-center gap-2">
                   📝 Examples
                 </h2>
              </div>
              {unitFormulas.filter(f => f.example).length === 0 ? (
                <div className="text-center py-10 text-stone-400 font-medium text-sm">No examples found in formulas.</div>
              ) : (
                <div className="space-y-3">
                  {unitFormulas.filter(f => f.example).map(f => (
                    <div key={f.id} className="bg-white p-4 rounded-2xl border border-[var(--color-powder)] shadow-sm">
                      <h4 className="font-bold text-[var(--color-ink)] text-sm mb-2">{f.name} Example</h4>
                      <code className="bg-stone-100 px-3 py-2 rounded-lg text-sm font-mono text-[var(--color-sage)] block">{f.example}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

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
