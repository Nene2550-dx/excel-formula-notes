import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Unit } from '../types';
import { X, BookOpen, Check } from 'lucide-react';

interface UnitModalProps {
  isOpen: boolean;
  initialUnit?: Unit | null;
  totalUnitsCount: number;
  onClose: () => void;
  onSave: (unitData: Partial<Unit>) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const ICONS = ['📘', '💡', '🔍', '📝', '⏰', '📊', '⚡', '🎯', '📈', '🧮', '💼', '🔬'];
const THEMES: { id: Unit['colorTheme']; label: string; bg: string }[] = [
  { id: 'sage', label: 'Sage Green', bg: 'bg-emerald-100 text-emerald-800' },
  { id: 'blue', label: 'Sky Blue', bg: 'bg-sky-100 text-sky-800' },
  { id: 'purple', label: 'Lavender', bg: 'bg-purple-100 text-purple-800' },
  { id: 'rose', label: 'Blush Rose', bg: 'bg-rose-100 text-rose-800' },
  { id: 'amber', label: 'Warm Honey', bg: 'bg-amber-100 text-amber-800' },
  { id: 'emerald', label: 'Mint', bg: 'bg-teal-100 text-teal-800' },
];

export const UnitModal = ({
  isOpen,
  initialUnit,
  totalUnitsCount,
  onClose,
  onSave,
  onNotify,
}: UnitModalProps) => {
  const nextNum = String(totalUnitsCount + 1).padStart(2, '0');
  const [unitNumber, setUnitNumber] = useState(initialUnit?.unitNumber || `Unit ${nextNum}`);
  const [title, setTitle] = useState(initialUnit?.title || '');
  const [description, setDescription] = useState(initialUnit?.description || '');
  const [icon, setIcon] = useState(initialUnit?.icon || ICONS[totalUnitsCount % ICONS.length]);
  const [colorTheme, setColorTheme] = useState<Unit['colorTheme']>(
    initialUnit?.colorTheme || THEMES[totalUnitsCount % THEMES.length].id
  );

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onNotify('กรุณาระบุชื่อบทเรียน (Title)', 'error');
      return;
    }

    onSave({
      ...(initialUnit?.id ? { id: initialUnit.id } : {}),
      unitNumber: unitNumber.trim() || `Unit ${totalUnitsCount + 1}`,
      title: title.trim(),
      description: description.trim(),
      icon,
      colorTheme,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900">
              {initialUnit ? 'แก้ไขบทเรียน (Unit)' : 'เพิ่มบทเรียนใหม่ (Unit)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Unit Number & Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              เลขรหัสบทเรียน
            </label>
            <input
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              placeholder="Unit 01"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-stone-900 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ชื่อบทเรียน (Unit Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น สูตรพื้นฐาน, IF & Logical"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-stone-900 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              คำอธิบายบทเรียนสั้น ๆ
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น สูตร Excel พื้นฐานที่ใช้ในการคำนวณข้อมูล"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-stone-800 text-sm leading-relaxed transition-all resize-none"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              เลือกไอคอนบทเรียน
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    icon === ic
                      ? 'bg-stone-800 text-white shadow-sm ring-2 ring-stone-600 scale-110'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color theme */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              โทนสีบทเรียน
            </label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setColorTheme(th.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    colorTheme === th.id
                      ? `${th.bg} border-current font-bold ring-2 ring-stone-300 shadow-xs`
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 font-medium text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialUnit ? 'บันทึกการแก้ไข' : 'สร้าง Unit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
