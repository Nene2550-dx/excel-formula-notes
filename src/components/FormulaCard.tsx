import React, { useState } from 'react';
import type { Formula } from '../types';
import { Star, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Copy, Check } from 'lucide-react';
import { validateFormula } from '../utils/formulaValidator';
import { CopyButton } from './CopyButton';

interface FormulaCardProps {
  formula: Formula;
  onViewDetails: (formula: Formula) => void;
  onToggleFavorite: (id: string) => void;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ formula, onViewDetails, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const validation = validateFormula(formula.formula);

  return (
    <div className="bg-white border border-[var(--color-powder)] rounded-2xl p-5 hover:border-[var(--color-dusty)] transition-all shadow-sm group">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-mono font-bold text-[var(--color-ink)] text-lg cursor-pointer hover:text-[var(--color-dusty)] transition-colors" onClick={() => onViewDetails(formula)}>
              {formula.name}
            </h3>
            {formula.importance === 'exam' && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                ⭐ EXAM
              </span>
            )}
            {formula.category && (
              <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md font-bold uppercase">
                {formula.category}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-600 font-medium leading-relaxed">{formula.shortDescription || formula.purpose}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(formula.id!); }}
          className={`p-2 rounded-full transition-colors ${formula.isFavorite ? 'text-amber-400 bg-amber-50' : 'text-stone-300 hover:text-amber-400 hover:bg-stone-50'}`}
        >
          <Star size={18} className={formula.isFavorite ? 'fill-amber-400' : ''} />
        </button>
      </div>

      {/* Main Formula */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Formula</div>
        <div className="bg-[var(--color-ink)] p-3 rounded-xl flex items-center justify-between gap-4 group/formula">
          <code className="text-white font-mono text-sm">{formula.formula}</code>
          <CopyButton textToCopy={formula.formula} />
        </div>
        {validation.status !== 'valid' && (
          <div className={`mt-2 flex items-start gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${validation.status === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
            {validation.status === 'error' ? <AlertCircle size={14} className="shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
            <span>{validation.message}</span>
          </div>
        )}
      </div>

      {/* Example Formula */}
      {formula.example && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Example</div>
          <p className="text-xs text-stone-600 mb-2 font-medium">ตัวอย่างการใช้งานเบื้องต้น</p>
          <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center justify-between gap-4 group/example">
            <code className="text-[var(--color-sage)] font-mono text-sm">{formula.example}</code>
            <CopyButton textToCopy={formula.example} className="text-stone-400 hover:bg-white hover:text-[var(--color-ink)]" />
          </div>
        </div>
      )}

      {/* Source (If imported by AI) */}
      {formula.source && (
        <div className="text-[10px] text-stone-400 font-medium mb-4 flex items-center gap-1">
          Source: {formula.source}
        </div>
      )}

      {/* Collapsible Details */}
      <div className="border-t border-stone-100 pt-3">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[var(--color-ink)] transition-colors w-full"
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {isExpanded ? 'Hide Details' : 'View Syntax & Tips'}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Syntax */}
            {formula.syntax && (
              <div>
                 <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Syntax</div>
                 <code className="text-xs text-stone-600 font-mono block bg-stone-50 p-2 rounded-lg">{formula.syntax}</code>
              </div>
            )}
            
            {/* How it works */}
            {formula.purpose && (
              <div>
                 <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">How it works</div>
                 <p className="text-xs text-stone-600">{formula.purpose}</p>
              </div>
            )}

            {/* Tips / Teacher Note */}
            {formula.teacherNote && (
              <div>
                 <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Tips</div>
                 <p className="text-xs text-stone-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">{formula.teacherNote}</p>
              </div>
            )}

            {/* Common Error */}
            {formula.commonError && (
              <div>
                 <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Common Error</div>
                 <p className="text-xs text-stone-600 bg-amber-50 p-2 rounded-lg border border-amber-100">{formula.commonError}</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
