import React from 'react';
import { Trash2, X, FolderMinus } from 'lucide-react';
import type { Formula } from '../types';

interface DeleteFormulaModalProps {
  formula: Formula;
  onClose: () => void;
  onRemoveFromUnit: () => void;
  onDeleteCompletely: () => void;
}

export const DeleteFormulaModal: React.FC<DeleteFormulaModalProps> = ({ formula, onClose, onRemoveFromUnit, onDeleteCompletely }) => {
  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-powder)]">
          <h2 className="text-xl font-bold text-rose-600 flex items-center gap-2">
            <Trash2 size={24} /> ลบข้อมูล
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6">
          <p className="text-stone-600 mb-6 font-medium text-center">
            คุณต้องการลบ <strong>{formula.name}</strong> ออกจาก Unit นี้ หรือลบออกจากระบบทั้งหมด?
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={onRemoveFromUnit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
            >
              <FolderMinus size={18} /> Remove from Unit (เก็บไว้ใน Library)
            </button>
            
            <button 
              onClick={onDeleteCompletely}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-xl transition-colors"
            >
              <Trash2 size={18} /> Delete Completely (ลบทิ้งถาวร)
            </button>
            
            <button 
              onClick={onClose}
              className="w-full flex items-center justify-center px-4 py-3 text-stone-500 font-bold hover:bg-stone-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
