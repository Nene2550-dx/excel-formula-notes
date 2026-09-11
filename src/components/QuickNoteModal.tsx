import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Unit, Formula } from '../types';
import { Zap, X, Upload, Sparkles } from 'lucide-react';

interface QuickNoteModalProps {
  isOpen: boolean;
  units: Unit[];
  activeUnitId?: string;
  onClose: () => void;
  onSaveQuickNote: (formulaData: Partial<Formula>) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const QuickNoteModal = ({
  isOpen,
  units,
  activeUnitId,
  onClose,
  onSaveQuickNote,
  onNotify,
}: QuickNoteModalProps) => {
  const defaultUnit = activeUnitId && units.some((u) => u.id === activeUnitId)
    ? activeUnitId
    : units[0]?.id || '';

  const [unitId, setUnitId] = useState<string>(defaultUnit);
  const [formula, setFormula] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [teacherNote, setTeacherNote] = useState<string>('');
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [importance, setImportance] = useState<'normal' | 'important' | 'exam'>('important');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Support pasting image from clipboard (Cmd+V / Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              setImageData(base64);
              onNotify('📷 วางรูปภาพ Screenshot จาก Clipboard แล้ว!', 'info');
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, onNotify]);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onNotify('ขนาดไฟล์รูปภาพเกิน 5MB กรุณาเลือกรูปขนาดเล็กลง', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result as string);
        onNotify('แนบรูปภาพสำเร็จ', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formula.trim() && !shortDescription.trim()) {
      onNotify('กรุณากรอกสูตรหรือคำอธิบายอย่างน้อย 1 อย่าง', 'error');
      return;
    }

    if (!unitId && units.length > 0) {
      setUnitId(units[0].id);
    }

    // Extract a formula name if possible (e.g. from =VLOOKUP(...) -> VLOOKUP)
    let extractedName = '';
    const formulaMatch = formula.match(/=?([A-Za-z0-9_.]+)/);
    if (formulaMatch && formulaMatch[1]) {
      extractedName = formulaMatch[1].toUpperCase();
    } else {
      extractedName = shortDescription.slice(0, 15) || 'Quick Note';
    }

    onSaveQuickNote({
      unitId: unitId || (units[0]?.id ?? ''),
      name: extractedName,
      formula: formula.trim().startsWith('=') ? formula.trim() : `=${formula.trim()}`,
      shortDescription: shortDescription.trim(),
      purpose: shortDescription.trim(),
      teacherNote: teacherNote.trim(),
      imageData,
      importance,
      isDraft: true, // Key flag for quick notes
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-vanilla)] rounded-3xl shadow-2xl border border-[var(--color-misty)]/50 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-amber-50/80 via-rose-50/40 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-amber-400 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900 leading-tight">⚡ Quick Note จดด่วนตอนเรียน</h2>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">Draft</span>
              </div>
              <p className="text-xs text-stone-500">จดใน 10 วินาที ไม่ต้องกรอกครบ ค่อยกลับมาแต่งเพิ่มตอนสอบ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Unit Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              บทเรียน / Unit <span className="text-rose-500">*</span>
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-misty)]/50 bg-stone-50/60 focus:bg-[var(--color-vanilla)] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 text-stone-800 text-sm font-medium transition-all"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} — {u.title}
                </option>
              ))}
            </select>
          </div>

          {/* Formula Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              สูตร <span className="text-stone-400 font-normal">(เช่น =VLOOKUP() หรือ =SUM)</span>
            </label>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="=VLOOKUP(A2, D:E, 2, FALSE)"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-misty)]/50 bg-stone-50/60 focus:bg-[var(--color-vanilla)] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 font-mono text-stone-900 text-sm font-medium transition-all"
            />
          </div>

          {/* Purpose / ใช้ทำอะไร */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ใช้ทำอะไร / คำอธิบายสั้น ๆ
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="ค้นหาข้อมูลข้ามตาราง, ดักจับข้อผิดพลาด"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-misty)]/50 bg-stone-50/60 focus:bg-[var(--color-vanilla)] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 text-stone-800 text-sm transition-all"
            />
          </div>

          {/* Teacher Note / หมายเหตุ */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              หมายเหตุจากอาจารย์
            </label>
            <textarea
              rows={2}
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              placeholder="อาจารย์บอกว่าออกสอบข้อเขียน, ห้ามลืมกด F4..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-misty)]/50 bg-stone-50/60 focus:bg-[var(--color-vanilla)] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 text-stone-800 text-sm leading-relaxed transition-all resize-none"
            />
          </div>

          {/* Importance radio buttons */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              ระดับความสำคัญ
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setImportance('normal')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  importance === 'normal'
                    ? 'bg-stone-100 border-stone-300 text-stone-800 font-semibold ring-2 ring-stone-200'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                ปกติ
              </button>
              <button
                type="button"
                onClick={() => setImportance('important')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  importance === 'important'
                    ? 'bg-purple-50 border-purple-300 text-purple-800 font-semibold ring-2 ring-purple-200'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                สำคัญ
              </button>
              <button
                type="button"
                onClick={() => setImportance('exam')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  importance === 'exam'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold ring-2 ring-rose-200 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3 h-3 text-rose-500 fill-rose-400" />
                ⭐ ออกสอบ
              </button>
            </div>
          </div>

          {/* Image Upload & Paste area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                📷 ภาพประกอบ (Screenshot สไลด์ / ตาราง)
              </label>
              <span className="text-[11px] text-stone-400">วาง Ctrl+V ได้เลย</span>
            </div>

            {imageData ? (
              <div className="relative rounded-xl border border-stone-200 overflow-hidden group max-h-36 flex items-center justify-center bg-stone-50">
                <img src={imageData} alt="Quick preview" className="max-h-36 object-contain w-full" />
                <button
                  type="button"
                  onClick={() => setImageData(undefined)}
                  className="absolute top-2 right-2 bg-stone-900/80 text-white p-1 rounded-lg hover:bg-stone-900 text-xs transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-3.5 text-center cursor-pointer hover:bg-amber-50/20 transition-all flex flex-col items-center justify-center gap-1 text-stone-500"
              >
                <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>คลิกเพื่อแนบรูป หรือ Drag & Drop หรือกด Ctrl+V</span>
                </div>
                <span className="text-[10px] text-stone-400">รองรับภาพ Screenshot จากหน้าจอหรือกล้องมือถือ</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 font-medium text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--color-rosewood)] to-[#905158] hover:opacity-90 text-white font-semibold text-xs shadow-md shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>บันทึกไว้ก่อน (Draft)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
