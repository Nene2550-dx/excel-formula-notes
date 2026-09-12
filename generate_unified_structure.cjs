const fs = require('fs');

// 1. Update Types
let typesCode = fs.readFileSync('src/types/index.ts', 'utf8');
if (!typesCode.includes("type?: 'formula' | 'tool'")) {
  typesCode = typesCode.replace("export interface Formula {", "export interface Formula {\n  type?: 'formula' | 'tool';\n  stepsText?: string;");
  typesCode = typesCode.replace("'dashboard' | 'unit' | 'favorites'", "'dashboard' | 'unit' | 'library' | 'favorites'");
  fs.writeFileSync('src/types/index.ts', typesCode);
}

// 2. Update FormulaCard.tsx to handle both types
const cardCode = `
import React, { useState } from 'react';
import type { Formula } from '../types';
import { Star, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface FormulaCardProps {
  formula: Formula;
  onViewDetails?: (formula: Formula) => void;
  onToggleFavorite?: (formulaId: string) => void;
  onEdit?: (formula: Formula) => void;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ formula, onViewDetails, onToggleFavorite, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  const isTool = formula.type === 'tool';

  const handleCopy = (text: string, isExample: boolean) => {
    navigator.clipboard.writeText(text);
    if (isExample) {
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    } else {
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--color-powder)] shadow-sm hover:border-[var(--color-dusty)] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-bold text-[var(--color-ink)] uppercase tracking-tight">{formula.name}</h3>
            {isTool ? (
               <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">🛠 Tool</span>
            ) : (
               <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">🧮 Formula</span>
            )}
          </div>
          <p className="text-stone-500 font-medium">{formula.shortDescription || formula.purpose}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && <button onClick={() => onEdit(formula)} className="text-xs font-bold text-stone-400 hover:text-[var(--color-ink)]">Edit</button>}
          {onToggleFavorite && (
            <button onClick={() => onToggleFavorite(formula.id)} className={\`p-1.5 rounded-full \${formula.isFavorite ? 'text-amber-400' : 'text-stone-300 hover:text-stone-400'}\`}>
              <Star className={formula.isFavorite ? 'fill-current' : ''} size={18} />
            </button>
          )}
        </div>
      </div>

      {isTool ? (
        // EXCEL TOOL LAYOUT
        <div className="space-y-4">
          <div className="bg-stone-50 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-2">How to use</h4>
            <p className="font-mono text-sm text-[var(--color-ink)] whitespace-pre-wrap">{formula.stepsText || '1. ...'}</p>
          </div>
          <button onClick={() => handleCopy(formula.stepsText || '', false)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-powder)] text-stone-600 font-bold text-xs rounded-xl hover:bg-stone-50 transition-colors">
            {copiedFormula ? <><Check size={14} className="text-emerald-500"/> Copied</> : <><Copy size={14}/> Copy Steps</>}
          </button>
        </div>
      ) : (
        // FORMULA LAYOUT
        <div className="space-y-4">
          <div className="bg-[var(--color-ink)] p-4 rounded-2xl">
            <code className="font-mono font-bold text-white text-lg">{formula.formula}</code>
          </div>
          <button onClick={() => handleCopy(formula.formula, false)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-powder)] text-stone-600 font-bold text-xs rounded-xl hover:bg-stone-50 transition-colors">
            {copiedFormula ? <><Check size={14} className="text-emerald-500"/> Copied</> : <><Copy size={14}/> Copy Formula</>}
          </button>
          
          {formula.example && (
            <div className="mt-4 border-t border-[var(--color-powder)] pt-4">
              <h4 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-2">Example</h4>
              <div className="bg-stone-50 p-4 rounded-2xl mb-3">
                <code className="font-mono font-bold text-[var(--color-ink)] text-sm">{formula.example}</code>
              </div>
              <button onClick={() => handleCopy(formula.example!, true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-powder)] text-stone-600 font-bold text-xs rounded-xl hover:bg-stone-50 transition-colors">
                {copiedExample ? <><Check size={14} className="text-emerald-500"/> Copied</> : <><Copy size={14}/> Copy Example</>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* EXPANDABLE DETAILS */}
      <div className="mt-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-stone-500 font-bold text-sm hover:text-[var(--color-ink)]">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />} {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[var(--color-powder)] space-y-4 animate-in slide-in-from-top-2">
            {!isTool && formula.syntax && (
              <div>
                <h4 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">Syntax</h4>
                <p className="font-mono text-sm text-stone-600 bg-stone-50 p-2 rounded-lg">{formula.syntax}</p>
              </div>
            )}
            {formula.commonError && (
              <div>
                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Common Mistake</h4>
                <p className="text-sm text-stone-600">{formula.commonError}</p>
              </div>
            )}
            {formula.teacherNote && (
              <div>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Tips / Exam Note</h4>
                <p className="text-sm text-stone-600">{formula.teacherNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/components/FormulaCard.tsx', cardCode);

