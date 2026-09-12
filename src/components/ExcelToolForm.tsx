import React, { useState, useEffect } from 'react';
import type { Formula, Unit, ToolStep } from '../types';
import { ToolStepEditor } from './ToolStepEditor';
import { FormulaCard } from './FormulaCard';
import { Check, X } from 'lucide-react';

interface ExcelToolFormProps {
  initialFormula: Formula | null;
  units: Unit[];
  activeUnitId: string;
  onSave: (formula: Partial<Formula>) => void;
  onCancel: () => void;
}

const CATEGORIES = ['Editing', 'Data', 'Formatting', 'View', 'Table', 'Review', 'Other'];

export const ExcelToolForm: React.FC<ExcelToolFormProps> = ({ initialFormula, units, activeUnitId, onSave, onCancel }) => {
  const [unitId, setUnitId] = useState(activeUnitId);
  const [name, setName] = useState(initialFormula?.name || '');
  const [category, setCategory] = useState(initialFormula?.category || 'Editing');
  const [shortDescription, setShortDescription] = useState(initialFormula?.shortDescription || '');
  const [toolSteps, setToolSteps] = useState<ToolStep[]>(initialFormula?.toolSteps || []);
  const [toolExampleResult, setToolExampleResult] = useState(initialFormula?.toolExampleResult || '');
  const [keyboardShortcut, setKeyboardShortcut] = useState(initialFormula?.keyboardShortcut || '');
  const [tips, setTips] = useState(initialFormula?.tips || '');
  const [warnings, setWarnings] = useState(initialFormula?.warnings || '');
  const [examNote, setExamNote] = useState(initialFormula?.teacherNote || '');

  // Keep unitId synced in case activeUnitId changes
  useEffect(() => {
    if (activeUnitId) setUnitId(activeUnitId);
  }, [activeUnitId]);

  const previewData: Formula = {
    id: initialFormula?.id || 'preview',
    type: 'tool',
    unitId,
    name: name || 'Tool Name',
    category,
    shortDescription: shortDescription || 'คำอธิบายสั้นๆ',
    toolSteps,
    toolExampleResult,
    keyboardShortcut,
    tips,
    warnings,
    teacherNote: examNote, // Reusing teacherNote for Exam Note internally, or use examNote if we added it
    formula: '', // Not used
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleSave = () => {
    if (!name.trim()) return alert('กรุณาระบุชื่อเครื่องมือ');
    onSave(previewData);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[60vh] max-h-[85vh]">
      {/* Left Column: Form */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar pb-20">
        
        {/* 1. ข้อมูลพื้นฐาน */}
        <section className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] border-b border-[var(--color-powder)] pb-2">1. ข้อมูลพื้นฐาน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">ชื่อเครื่องมือ / คำสั่ง *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Freeze Panes" className="w-full px-4 py-3 bg-stone-50 border border-[var(--color-powder)] rounded-xl font-bold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">📍 Unit ที่เกี่ยวข้อง *</label>
              <select value={unitId} onChange={e => setUnitId(e.target.value)} className="w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400">
                {units.map(u => <option key={u.id} value={u.id}>{u.unitNumber}: {u.title}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">หมวดหมู่ *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-[var(--color-powder)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)]">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </section>

        {/* 2. คำอธิบาย */}
        <section className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] border-b border-[var(--color-powder)] pb-2">2. เครื่องมือนี้ใช้ทำอะไร?</h3>
          <textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="คำอธิบายสั้นๆ e.g. ใช้สำหรับล็อกแถวหรือคอลัมน์ไม่ให้เลื่อน" rows={2} className="w-full px-4 py-3 bg-stone-50 border border-[var(--color-powder)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] resize-none" />
        </section>

        {/* 3. ขั้นตอน */}
        <section className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] border-b border-[var(--color-powder)] pb-2">3. ขั้นตอนการทำงาน</h3>
          <ToolStepEditor steps={toolSteps} onChange={setToolSteps} />
        </section>

        {/* 4. ตัวอย่าง */}
        <section className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] border-b border-[var(--color-powder)] pb-2">4. ตัวอย่างการใช้งาน (Example)</h3>
          <textarea value={toolExampleResult} onChange={e => setToolExampleResult(e.target.value)} placeholder="ผลลัพธ์ หรือคำอธิบายตัวอย่างการใช้งาน..." rows={3} className="w-full px-4 py-3 bg-stone-50 border border-[var(--color-powder)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] resize-none" />
        </section>

        {/* 5. Shortcut */}
        <section className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] border-b border-[var(--color-powder)] pb-2">5. Keyboard Shortcut</h3>
          <input type="text" value={keyboardShortcut} onChange={e => setKeyboardShortcut(e.target.value)} placeholder="e.g. Ctrl + Shift + L" className="w-full px-4 py-3 bg-stone-50 border border-[var(--color-powder)] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)]" />
        </section>

        {/* 6. Tips & Warnings */}
        <section className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--color-ink)] border-b border-[var(--color-powder)] pb-2">6. Tips & Notes</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">💡 Tips (เทคนิค)</label>
              <input type="text" value={tips} onChange={e => setTips(e.target.value)} className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">⚠️ ข้อควรระวัง</label>
              <input type="text" value={warnings} onChange={e => setWarnings(e.target.value)} className="w-full px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">📌 Exam Note (สิ่งที่ต้องจำก่อนสอบ)</label>
              <input type="text" value={examNote} onChange={e => setExamNote(e.target.value)} className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Live Preview */}
      <div className="hidden lg:flex w-[400px] flex-col bg-stone-100 rounded-2xl p-4 border border-[var(--color-powder)] h-full overflow-hidden">
        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>Live Preview</span>
          <span className="text-[10px] bg-stone-200 px-2 py-1 rounded-full">Real-time</span>
        </h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
          <FormulaCard formula={previewData} />
        </div>
      </div>

      {/* Footer Buttons (Fixed bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-powder)] flex justify-end gap-3 z-10 rounded-b-3xl">
        <button onClick={onCancel} className="px-6 py-3 font-bold text-stone-500 hover:bg-stone-100 rounded-xl transition-colors">
          ยกเลิก
        </button>
        <button onClick={handleSave} className="px-8 py-3 bg-[var(--color-ink)] hover:bg-stone-800 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
          <Check size={18} /> บันทึก Excel Tool
        </button>
      </div>
    </div>
  );
};
