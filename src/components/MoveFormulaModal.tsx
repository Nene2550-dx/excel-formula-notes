import React, { useState } from 'react';
import type { Unit, Formula } from '../types';
import { X, FolderOutput } from 'lucide-react';

interface MoveFormulaModalProps {
  formula: Formula;
  units: Unit[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formulaId: string, targetUnitId: string) => void;
}

export const MoveFormulaModal: React.FC<MoveFormulaModalProps> = ({
  formula, units, isOpen, onClose, onConfirm
}) => {
  if (!isOpen) return null;

  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  
  // Don't show the unit it's currently in
  const availableUnits = units.filter(u => u.id !== formula.unitId);

  const handleConfirm = () => {
    if (selectedUnitId) {
      onConfirm(formula.id, selectedUnitId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[var(--color-vanilla)] w-full max-w-md rounded-3xl shadow-xl flex flex-col overflow-hidden border border-white/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-misty)]/50 bg-white/40">
          <h2 className="text-xl font-extrabold text-[var(--color-midnight)] flex items-center gap-2">
            <FolderOutput className="w-5 h-5 text-[var(--color-rosewood)]" />
            Move "{formula.name}" to...
          </h2>
          <button onClick={onClose} className="p-1.5 bg-white rounded-full text-stone-400 hover:text-stone-700 shadow-sm transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 bg-white/20">
          <p className="text-sm text-[var(--color-midnight)]/80 mb-4 font-medium">Select a destination unit for this formula:</p>
          
          {availableUnits.length === 0 ? (
            <div className="text-center p-4 bg-white/50 rounded-xl border border-[var(--color-misty)] text-sm text-[var(--color-midnight)]/70">
              No other units available. Please create another unit first.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {availableUnits.map(unit => (
                <label 
                  key={unit.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedUnitId === unit.id 
                      ? 'bg-[var(--color-sage)]/10 border-[var(--color-sage)] text-[var(--color-midnight)]' 
                      : 'bg-white border-[var(--color-misty)]/50 text-[var(--color-midnight)]/70 hover:bg-white/80'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="targetUnit" 
                    value={unit.id} 
                    checked={selectedUnitId === unit.id}
                    onChange={() => setSelectedUnitId(unit.id)}
                    className="w-4 h-4 text-[var(--color-sage)] focus:ring-[var(--color-sage)]"
                  />
                  <div className="flex items-center gap-2 font-bold">
                    <span>{unit.icon || '📁'}</span>
                    <span>{unit.unitNumber} — {unit.title}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-[var(--color-misty)]/50 bg-white/40 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[var(--color-misty)] hover:bg-stone-50 rounded-xl text-sm font-bold text-[var(--color-midnight)] transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedUnitId}
            className="px-4 py-2 bg-[var(--color-rosewood)] hover:bg-[#905158] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            Move Formula
          </button>
        </div>
      </div>
    </div>
  );
};
