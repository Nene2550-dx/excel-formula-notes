import React, { useState, useEffect } from 'react';
import type { Formula } from '../types';
import { X, Copy, Check, Edit3, Trash2, FolderOutput, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface FormulaDetailModalProps {
  isOpen: boolean;
  formula: Formula;
  onClose: () => void;
  onEdit: (formula: Formula) => void;
  onDelete: (id: string) => void;
  onMove: (formula: Formula) => void;
  onOpenImage: (imageUrl: string, title: string) => void;
}

export const FormulaDetailModal = ({ isOpen, formula, onClose, onEdit, onDelete, onMove, onOpenImage }: FormulaDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[#faf9f6] w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--color-powder)] bg-white/40">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-serif font-extrabold text-[var(--color-ink)]">{formula.name}</h2>
              {formula.category && <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded font-bold uppercase">{formula.category}</span>}
              {formula.importance === 'exam' && <span className="bg-[var(--color-dusty)] text-white px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"><Sparkles className="w-3 h-3"/> Exam</span>}
              {formula.isDraft && <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">Draft</span>}
            </div>
            {formula.shortDescription && <p className="text-sm text-[var(--color-ink)]/70 font-medium">{formula.shortDescription}</p>}
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-stone-400 hover:text-[var(--color-ink)] shadow-sm transition-all"><X className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* Sticky Formula Box */}
          <div className="sticky top-0 z-20 bg-[#faf9f6]/95 backdrop-blur-md pt-6 pb-4 px-6 border-b border-[var(--color-powder)] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="bg-[var(--color-ink)] p-4 rounded-2xl flex justify-between items-center gap-4 shadow-sm">
              <code className="text-[var(--color-ivory)] font-mono text-base overflow-x-auto whitespace-pre">{formula.formula}</code>
              <CopyButton 
                textToCopy={formula.formula} 
                label="Copy Formula"
                className="bg-white/10 text-white hover:bg-white/20 hover:text-white border border-white/20" 
              />
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Details */}
            <div className="space-y-5">
              {formula.purpose && (
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-dusty)] uppercase tracking-wider mb-1">01 Overview</h4>
                  <p className="text-[var(--color-ink)] text-sm font-medium">{formula.purpose}</p>
                </div>
              )}
              
              {formula.syntax && (
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-dusty)] uppercase tracking-wider mb-1">02 Syntax</h4>
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[var(--color-powder)] font-mono text-sm text-[var(--color-ink)]">
                    <span className="truncate mr-2">{formula.syntax}</span>
                    <CopyButton textToCopy={formula.syntax} variant="ghost" label="Copy" />
                  </div>
                </div>
              )}

              {formula.example && (
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-dusty)] uppercase tracking-wider mb-1">03 Example</h4>
                  <div className="flex items-center justify-between bg-[var(--color-sage)]/20 p-3 rounded-xl border border-[var(--color-sage)]/30 font-mono text-sm text-[var(--color-ink)]">
                    <span className="truncate mr-2">{formula.example}</span>
                    <CopyButton textToCopy={formula.example} variant="ghost" label="Copy" />
                  </div>
                </div>
              )}
            </div>

            {/* Steps */}
            {formula.steps && formula.steps.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-powder)]/50">
                <h4 className="text-sm font-bold text-[var(--color-ink)] flex items-center gap-2 mb-4 uppercase tracking-wider font-serif">
                  <ImageIcon className="w-4 h-4"/> How To Use
                </h4>
                <div className="space-y-6">
                  {formula.steps.map((step, idx) => (
                    <div key={step.id} className="relative pl-6 border-l-2 border-[var(--color-powder)] pb-4 last:border-0 last:pb-0">
                      <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-[var(--color-ivory)] border-2 border-[var(--color-dusty)] flex items-center justify-center text-[10px] font-bold text-[var(--color-dusty)]">
                        {idx + 1}
                      </div>
                      <h5 className="font-bold text-[var(--color-ink)] mb-1">{step.title}</h5>
                      <p className="text-sm text-[var(--color-ink)]/70 mb-3">{step.description}</p>
                      {step.imageData && (
                        <div 
                          className="cursor-pointer border border-stone-200/80 rounded-xl overflow-hidden hover:border-[var(--color-sage)] transition-colors relative group w-fit"
                          onClick={() => onOpenImage(step.imageData!, step.title)}
                        >
                          <img src={step.imageData} alt={step.title} className="w-full max-w-sm object-contain max-h-48 bg-white/50" />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 text-[var(--color-ink)] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"><FileText size={14}/> Zoom</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy Image */}
            {formula.imageData && (!formula.steps || formula.steps.length === 0) && (
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Visual Guide</h4>
                <div 
                  className="cursor-pointer border border-stone-200/80 rounded-xl overflow-hidden hover:border-[var(--color-sage)] transition-colors relative group"
                  onClick={() => onOpenImage(formula.imageData!, formula.name)}
                >
                  <img src={formula.imageData} alt="Formula attachment" className="w-full object-contain max-h-64 bg-white/50" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"><FileText size={14}/> Click to zoom</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Teacher Note */}
            {formula.teacherNote && (
              <div className="bg-[var(--color-ivory)] p-4 rounded-xl border border-[var(--color-powder)] shadow-sm">
                <div className="flex items-start gap-2">
                  <span className="text-xl leading-none">📌</span>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">Teacher's Note / Error Warning</h4>
                    <p className="text-sm font-medium text-[var(--color-ink)]/80 whitespace-pre-line">{formula.teacherNote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-powder)]/50 bg-white/40 flex justify-between items-center">
          <span className="text-xs text-[var(--color-ink)]/50 font-medium">Last updated: {new Date(formula.updatedAt).toLocaleDateString()}</span>
          <div className="flex gap-2">
            <button onClick={() => { onClose(); onEdit(formula); }} className="px-3 py-1.5 bg-white border border-[var(--color-powder)] hover:border-[var(--color-dusty)] rounded-lg text-sm font-bold text-[var(--color-ink)] transition-colors flex items-center gap-1"><Edit3 size={14}/> Edit</button>
            <button onClick={() => { onClose(); onMove(formula); }} className="px-3 py-1.5 bg-white border border-[var(--color-powder)] hover:border-[var(--color-dusty)] rounded-lg text-sm font-bold text-[var(--color-ink)] transition-colors flex items-center gap-1"><FolderOutput size={14}/> Move</button>
            <button onClick={() => { onClose(); onDelete(formula.id); }} className="px-3 py-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg text-sm font-bold text-rose-600 transition-colors flex items-center gap-1"><Trash2 size={14}/> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};
