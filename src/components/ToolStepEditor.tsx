import React from 'react';
import { GripVertical, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import type { ToolStep } from '../types';

interface ToolStepEditorProps {
  steps: ToolStep[];
  onChange: (steps: ToolStep[]) => void;
}

export const ToolStepEditor: React.FC<ToolStepEditorProps> = ({ steps, onChange }) => {
  const addStep = (type: ToolStep['type']) => {
    onChange([...steps, { id: `step-${Date.now()}`, type, content: '' }]);
  };

  const updateStep = (id: string, updates: Partial<ToolStep>) => {
    onChange(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStep = (id: string) => {
    onChange(steps.filter(s => s.id !== id));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        updateStep(id, { imageUrl: evt.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="bg-stone-50 border border-[var(--color-powder)] rounded-xl p-4 flex gap-3 group">
          <div className="cursor-move text-stone-300 hover:text-stone-500 mt-2">
            <GripVertical size={20} />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Step {index + 1} • {step.type.replace('_', ' ')}</span>
              <button onClick={() => removeStep(step.id)} className="text-stone-300 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            
            {/* Cell & Data Input */}
            {step.type === 'cell_input' && (
              <div className="flex gap-2">
                <input type="text" placeholder="Cell (e.g. A1)" value={step.cell || ''} onChange={e => updateStep(step.id, { cell: e.target.value })} className="w-1/3 px-3 py-2 bg-white border border-[var(--color-powder)] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[var(--color-dusty)] focus:outline-none" />
                <input type="text" placeholder="ข้อมูลที่ต้องใส่" value={step.content} onChange={e => updateStep(step.id, { content: e.target.value })} className="flex-1 px-3 py-2 bg-white border border-[var(--color-powder)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-dusty)] focus:outline-none" />
              </div>
            )}
            
            {/* Command Input */}
            {step.type === 'command' && (
              <div className="space-y-2">
                <input type="text" placeholder="คำสั่ง Excel (e.g. Fill Handle)" value={step.content} onChange={e => updateStep(step.id, { content: e.target.value })} className="w-full px-3 py-2 bg-white border border-[var(--color-powder)] rounded-lg text-sm font-bold focus:ring-2 focus:ring-[var(--color-dusty)] focus:outline-none" />
                <input type="text" placeholder="รายละเอียด (e.g. ลากลงเพื่อให้เติมอัตโนมัติ)" value={step.detail || ''} onChange={e => updateStep(step.id, { detail: e.target.value })} className="w-full px-3 py-2 bg-white border border-[var(--color-powder)] rounded-lg text-sm text-stone-500 focus:ring-2 focus:ring-[var(--color-dusty)] focus:outline-none" />
              </div>
            )}

            {/* Default Content Input (Description, Result, Shortcut, Formula) */}
            {['description', 'result', 'shortcut', 'formula'].includes(step.type) && (
              <div className="flex gap-2">
                {(step.type === 'formula' || step.type === 'result') && (
                  <input type="text" placeholder="Cell" value={step.cell || ''} onChange={e => updateStep(step.id, { cell: e.target.value })} className="w-20 px-3 py-2 bg-white border border-[var(--color-powder)] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[var(--color-dusty)] focus:outline-none" />
                )}
                <input type="text" placeholder={step.type === 'shortcut' ? "Ctrl + C" : step.type === 'formula' ? "=SUM(A1)" : "รายละเอียด"} value={step.content} onChange={e => updateStep(step.id, { content: e.target.value })} className={`flex-1 px-3 py-2 bg-white border border-[var(--color-powder)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-dusty)] focus:outline-none ${step.type === 'formula' ? 'font-mono' : ''} ${step.type === 'shortcut' ? 'font-bold font-mono text-indigo-600' : ''}`} />
              </div>
            )}

            {/* Image Upload per step */}
            <div className="pt-2">
               {step.imageUrl ? (
                 <div className="relative inline-block group">
                   <img src={step.imageUrl} alt="Step preview" className="h-24 rounded-lg border border-[var(--color-powder)] object-cover" />
                   <button onClick={() => updateStep(step.id, { imageUrl: undefined })} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><X size={12}/></button>
                   <input type="text" placeholder="Caption รูปภาพ..." value={step.caption || ''} onChange={e => updateStep(step.id, { caption: e.target.value })} className="mt-2 w-full text-xs text-stone-500 bg-transparent border-b border-stone-300 focus:outline-none focus:border-[var(--color-ink)]" />
                 </div>
               ) : (
                 <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 text-stone-500 hover:text-[var(--color-ink)] text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm">
                   <ImageIcon size={14} /> แนบรูปภาพประกอบ
                   <input type="file" accept="image/*" onChange={(e) => handleImageUpload(step.id, e)} className="hidden" />
                 </label>
               )}
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex flex-wrap gap-2 pt-2">
        <button onClick={() => addStep('description')} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">+ คำอธิบาย</button>
        <button onClick={() => addStep('cell_input')} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">+ ข้อมูล Cell</button>
        <button onClick={() => addStep('command')} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">+ คำสั่ง Excel</button>
        <button onClick={() => addStep('shortcut')} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">+ Shortcut</button>
        <button onClick={() => addStep('formula')} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">+ Formula</button>
        <button onClick={() => addStep('result')} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">+ ผลลัพธ์</button>
      </div>
    </div>
  );
};

// Add missing X icon import
import { X } from 'lucide-react';
