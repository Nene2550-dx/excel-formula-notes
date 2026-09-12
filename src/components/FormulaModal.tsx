import React, { useState, useEffect, useRef } from 'react';
import type { Formula, Unit, Step } from '../types';
import { X, Check, Upload, ImageIcon, AlertCircle } from 'lucide-react';
import { validateFormula, type ValidationResult } from '../utils/formulaValidator';
import { StepListEditor } from './StepListEditor';

interface FormulaModalProps {
  isOpen: boolean;
  units: Unit[];
  activeUnitId?: string;
  initialFormula: Formula | null;
  onClose: () => void;
  onSave: (formula: Partial<Formula>) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({
  isOpen,
  units,
  activeUnitId,
  initialFormula,
  onClose,
  onSave,
  onNotify,
}) => {
  const [unitId, setUnitId] = useState(activeUnitId || units[0]?.id || '');
  useEffect(() => {
    if (activeUnitId) {
      setUnitId(activeUnitId);
    }
  }, [activeUnitId]);
  useEffect(() => { console.log('FormulaModal mounted with unitId:', unitId, 'activeUnitId prop:', activeUnitId); }, [activeUnitId]);
  const [name, setName] = useState(initialFormula?.name || '');
  const [shortDescription, setShortDescription] = useState(initialFormula?.shortDescription || '');
  const [formula, setFormula] = useState(initialFormula?.formula || '');
  const [type, setType] = useState<'formula' | 'tool'>(initialFormula?.type || 'formula');
  const [stepsText, setStepsText] = useState(initialFormula?.stepsText || '');
  const [purpose, setPurpose] = useState(initialFormula?.purpose || '');
  const [syntax, setSyntax] = useState(initialFormula?.syntax || '');
  const [example, setExample] = useState(initialFormula?.example || '');
  const [teacherNote, setTeacherNote] = useState(initialFormula?.teacherNote || '');
  const [importance, setImportance] = useState<Formula['importance']>(initialFormula?.importance || 'normal');
  const [isFavorite, setIsFavorite] = useState(initialFormula?.isFavorite || false);
  const [isDraft, setIsDraft] = useState(initialFormula?.isDraft || false);
  const [category, setCategory] = useState(initialFormula?.category || '');
  const [imageData, setImageData] = useState<string | undefined>(initialFormula?.imageData);
  const [steps, setSteps] = useState<Step[]>(initialFormula?.steps || []);

  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (formula) {
        setValidation(validateFormula(formula));
      } else {
        setValidation(null);
      }
    }, 500); // Debounce
    return () => clearTimeout(timer);
  }, [formula, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onNotify('ไฟล์ภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageData(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyFix = () => {
    if (validation?.fixedFormula) {
      setFormula(validation.fixedFormula);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (type === 'formula' && !formula) || (type === 'tool' && !stepsText)) {
      onNotify('กรุณากรอกชื่อสูตรและสูตร', 'error');
      return;
    }

// Validation confirm removed to prevent silent failure

    const newFormula: Partial<Formula> = {
      id: initialFormula?.id || `f-${Date.now()}`,
      type,
      stepsText,
      unitId,
      name,
      shortDescription,
      formula,
      purpose,
      syntax,
      example,
      teacherNote,
      importance,
      isFavorite,
      isDraft, category,
      imageData,
      steps,
      createdAt: initialFormula?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newFormula);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-powder)] bg-[var(--color-ivory)]/50">
          <h2 className="text-xl font-serif font-extrabold text-[var(--color-ink)]">
            {initialFormula ? 'แก้ไขสูตร (Edit Formula)' : 'เพิ่มสูตรใหม่ (New Formula)'}
          </h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-stone-400 hover:text-[var(--color-ink)] shadow-sm transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          
          <div className="flex gap-4 p-1 bg-stone-100 rounded-xl mb-6 w-max">
            <button type="button" onClick={() => setType('formula')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${type === 'formula' ? 'bg-white shadow-sm text-blue-600' : 'text-stone-500 hover:text-stone-700'}`}>🧮 Excel Formula</button>
            <button type="button" onClick={() => setType('tool')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${type === 'tool' ? 'bg-white shadow-sm text-amber-600' : 'text-stone-500 hover:text-stone-700'}`}>🛠 Excel Tool</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">ชื่อสูตร (Formula Name)*</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SUM, VLOOKUP" required className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-bold text-[var(--color-ink)] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">บทเรียน (Unit)*</label>
              <select value={unitId} onChange={(e) => setUnitId(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] text-[var(--color-ink)] font-bold transition-all">
                {units.map((u) => <option key={u.id} value={u.id}>{u.unitNumber}: {u.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">หมวดหมู่สูตร (Category)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] text-[var(--color-ink)] font-bold transition-all">
                <option value="">Uncategorized</option>
                <option value="Math">Math (คณิตศาสตร์)</option>
                <option value="Logical">Logical (ตรรกะ)</option>
                <option value="Lookup">Lookup (ค้นหาข้อมูล)</option>
                <option value="Text">Text (ข้อความ)</option>
                <option value="Date & Time">Date & Time (วันที่และเวลา)</option>
                <option value="Statistics">Statistics (สถิติ)</option>
                <option value="Financial">Financial (การเงิน)</option>
                <option value="Other">Other (อื่นๆ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">คำอธิบายสั้นๆ (Short Description)</label>
            <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="e.g. การหาผลรวมของตัวเลข" className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] text-sm transition-all" />
          </div>

          {/* FORMULA INPUT & VALIDATOR */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">สูตร (Formula)*</label>
            <input 
              type="text" 
              value={formula} 
              onChange={(e) => setFormula(e.target.value)} 
              placeholder="e.g. =SUM(A1:A10)" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-ink)] bg-stone-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] font-mono text-sm transition-all" 
            />
            
            {/* Validation Status */}
            {validation && (
              <div className={`mt-2 p-3 rounded-lg flex items-start gap-2 border text-sm ${
                validation.status === 'valid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                validation.status === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <div className="mt-0.5">
                  {validation.status === 'valid' ? <Check size={16}/> : <AlertCircle size={16}/>}
                </div>
                <div className="flex-1">
                  <p className="font-bold">
                    {validation.status === 'valid' ? 'Formula looks good' : 
                     validation.status === 'warning' ? 'Formula has a warning' : 
                     'Formula has an error'}
                  </p>
                  {validation.message && <p className="opacity-90">{validation.message}</p>}
                  {validation.suggestion && <p className="opacity-90 mt-1 italic">Suggestion: {validation.suggestion}</p>}
                </div>
                {validation.fixedFormula && (
                  <button type="button" onClick={handleApplyFix} className="px-3 py-1 bg-white rounded-md shadow-sm border border-current text-xs font-bold hover:bg-opacity-50 transition-colors">
                    Apply Fix
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">รูปแบบการเขียน (Syntax)</label>
              <input type="text" value={syntax} onChange={(e) => setSyntax(e.target.value)} placeholder="=SUM(number1, [number2], ...)" className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-mono text-xs transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">ตัวอย่าง (Example)</label>
              <input type="text" value={example} onChange={(e) => setExample(e.target.value)} placeholder="=SUM(B2:B10)" className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-mono text-xs transition-all" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">หน้าที่ (Purpose)</label>
            <textarea rows={2} value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] text-sm transition-all resize-none" />
          </div>

          <div>
             <label className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">📌 หมายเหตุจากอาจารย์ / ข้อควรระวัง</label>
             <textarea rows={2} value={teacherNote} onChange={(e) => setTeacherNote(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm transition-all resize-none" />
          </div>

          <StepListEditor steps={steps} onChange={setSteps} />

          {/* Legacy Image Upload (Fallback) */}
          <div className="pt-4 border-t border-[var(--color-powder)]/50">
            <label className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ImageIcon className="w-4 h-4" /> ภาพประกอบรวม (Legacy)
            </label>
            {imageData ? (
              <div className="relative rounded-2xl border border-[var(--color-powder)] overflow-hidden max-h-48 bg-stone-50 flex justify-center">
                <img src={imageData} alt="Screenshot" className="h-48 object-contain" />
                <button type="button" onClick={() => setImageData(undefined)} className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg shadow-sm"><X size={14}/></button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[var(--color-powder)] rounded-2xl p-6 text-center cursor-pointer hover:bg-[var(--color-ivory)] transition-colors">
                <span className="text-sm font-bold text-stone-500">คลิกเพื่ออัปโหลดภาพรวม (หรือเพิ่มภาพแยกใน Step-by-Step ด้านบน)</span>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--color-powder)]/50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} className="w-4 h-4 rounded text-[var(--color-ink)] focus:ring-[var(--color-ink)]" />
              <span className="text-xs font-bold">บันทึกเป็น Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={importance === 'exam'} onChange={(e) => setImportance(e.target.checked ? 'exam' : 'normal')} className="w-4 h-4 rounded text-[var(--color-dusty)] focus:ring-[var(--color-dusty)]" />
              <span className="text-xs font-bold text-[var(--color-dusty)]">⭐ ออกสอบ (Exam Focus)</span>
            </label>
          </div>

          <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-[var(--color-powder)] p-4 -mx-6 -mb-6 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-[var(--color-powder)] font-bold text-sm text-[var(--color-ink)] hover:bg-[var(--color-ivory)] transition-colors">ยกเลิก</button>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-[var(--color-ink)] font-bold text-sm text-white hover:bg-stone-800 shadow-md transition-colors flex items-center gap-2">
              <Check size={16}/> บันทึกสูตร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
