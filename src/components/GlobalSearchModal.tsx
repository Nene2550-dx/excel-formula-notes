import { useState, useEffect, useRef } from 'react';
import type { Unit, Formula } from '../types';
import { Search, X, ArrowRight, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  units: Unit[];
  formulas: Formula[];
  onClose: () => void;
  onSelectFormula: (unitId: string, formulaId: string) => void;
}

export const GlobalSearchModal = ({
  isOpen,
  units,
  formulas,
  onClose,
  onSelectFormula,
}: GlobalSearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getUnit = (unitId: string) => units.find((u) => u.id === unitId);

  const cleanQuery = query.trim().toLowerCase();

  const filteredFormulas = formulas.filter((f) => {
    if (!cleanQuery) return true;
    return (
      f.name.toLowerCase().includes(cleanQuery) ||
      f.formula.toLowerCase().includes(cleanQuery) ||
      f.shortDescription.toLowerCase().includes(cleanQuery) ||
      (f.purpose && f.purpose.toLowerCase().includes(cleanQuery)) ||
      (f.teacherNote && f.teacherNote.toLowerCase().includes(cleanQuery)) ||
      (f.syntax && f.syntax.toLowerCase().includes(cleanQuery))
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center gap-3 bg-stone-50/70">
          <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาสูตรทั้งหมด... (เช่น IF, VLOOKUP, SUM, ตัดคำ, อายุงาน)"
            className="flex-1 bg-transparent text-stone-900 placeholder:text-stone-400 text-base font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded-md hidden sm:inline-block">
            ESC เพื่อปิด
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-2 flex-1">
          {filteredFormulas.length === 0 ? (
            <div className="py-12 text-center text-stone-400 flex flex-col items-center justify-center">
              <Search className="w-8 h-8 mb-2 opacity-40 text-stone-400" />
              <p className="text-sm font-medium text-stone-600">ไม่พบสูตรที่ตรงกับ "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">ลองค้นหาด้วยชื่อสูตร, syntax หรือหน้าที่การทำงาน</p>
            </div>
          ) : (
            <>
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                <span>ผลลัพธ์การค้นหา ({filteredFormulas.length} สูตร)</span>
                {cleanQuery && <span>ค้นหา: "{cleanQuery}"</span>}
              </div>

              {filteredFormulas.map((formula) => {
                const unit = getUnit(formula.unitId);
                return (
                  <div
                    key={formula.id}
                    onClick={() => {
                      onSelectFormula(formula.unitId, formula.id);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-base font-bold text-stone-900 group-hover:text-emerald-900">
                          {formula.name}
                        </span>
                        {unit && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                            <BookOpen className="w-3 h-3 text-stone-400" />
                            {unit.unitNumber} — {unit.title}
                          </span>
                        )}
                        {formula.importance === 'exam' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                            <Sparkles className="w-2.5 h-2.5 text-rose-500 fill-rose-400" />
                            ⭐ ออกสอบ
                          </span>
                        )}
                        {formula.isDraft && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Draft
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          {formula.formula}
                        </span>
                        {formula.shortDescription && (
                          <span className="text-xs text-stone-500 truncate">
                            {formula.shortDescription}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-stone-300 group-hover:text-emerald-600 transition-colors pl-2 flex-shrink-0">
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
