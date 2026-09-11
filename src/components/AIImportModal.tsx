import React, { useState, useEffect } from 'react';
import type { Formula, Unit, NoteSection } from '../types';
import { 
  X, UploadCloud, FileText, CheckCircle2, Circle, Loader2, 
  ChevronRight, Sparkles, BookOpen, Calculator, AlertTriangle, Search
} from 'lucide-react';
import { CopyButton } from './CopyButton';

interface AIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  existingFormulas: Formula[];
  onImport: (targetUnitId: string, newNotes: NoteSection[], newFormulas: Partial<Formula>[]) => void;
}

type ImportStep = 'upload' | 'processing' | 'organize' | 'review' | 'summary';

// Mock Data Generator
const generateMockData = (fileName: string) => {
  return {
    notes: [
      { id: `mock-sec-1`, order: 0, title: 'Introduction to Lookup Functions', content: '<p>Lookup functions are used to find data in a table or range by row.</p>', layout: 'text' as const },
      { id: `mock-sec-2`, order: 1, title: 'Important Rules for VLOOKUP', content: '<ul><li>The lookup value must be in the first column.</li><li>Use FALSE for exact match.</li></ul>', layout: 'warning' as const }
    ],
    formulas: [
      {
        id: `mock-form-1`,
        name: 'VLOOKUP',
        category: 'Lookup',
        shortDescription: 'Find and return data from a table',
        formula: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
        example: '=VLOOKUP(A2, Data!A:D, 3, FALSE)',
        teacherNote: 'Don\'t forget to lock your table array range with $ if dragging down!',
        source: fileName,
        isFavorite: false,
        isDraft: false,
        importance: 'exam' as const
      },
      {
        id: `mock-form-2`,
        name: 'XLOOKUP',
        category: 'Lookup',
        shortDescription: 'Modern, flexible replacement for VLOOKUP',
        formula: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])',
        example: '=XLOOKUP(A2, Data!A:A, Data!C:C, "Not Found")',
        source: fileName,
        isFavorite: false,
        isDraft: false,
        importance: 'normal' as const
      }
    ]
  };
};

export const AIImportModal: React.FC<AIImportModalProps> = ({ isOpen, onClose, units, existingFormulas, onImport }) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [processingStage, setProcessingStage] = useState(0);
  
  // Extracted Data
  const [extractedNotes, setExtractedNotes] = useState<NoteSection[]>([]);
  const [extractedFormulas, setExtractedFormulas] = useState<Partial<Formula>[]>([]);
  
  // Selection State
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [selectedFormulas, setSelectedFormulas] = useState<Set<string>>(new Set());
  const [targetUnitId, setTargetUnitId] = useState<string>(units[0]?.id || '');
  const [targetCategory, setTargetCategory] = useState<string>('Lookup');
  const [targetTags, setTargetTags] = useState<string>('#VLOOKUP, #Exam');
  const [isNewUnit, setIsNewUnit] = useState<boolean>(false);
  const [newUnitName, setNewUnitName] = useState<string>('New Unit from AI');

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('upload');
      setFile(null);
      setProcessingStage(0);
      setTargetUnitId(units[0]?.id || '');
    }
  }, [isOpen, units]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      startProcessing(selected.name);
    }
  };

  const startProcessing = (fileName: string) => {
    setStep('processing');
    setProcessingStage(0);
    
    // Simulate AI processing steps
    const stages = 9;
    let current = 0;
    
    const interval = setInterval(() => {
      current++;
      setProcessingStage(current);
      
      if (current >= stages) {
        clearInterval(interval);
        // Generate mock data and move to review
        setTimeout(() => {
          const data = generateMockData(fileName);
          setExtractedNotes(data.notes);
          setExtractedFormulas(data.formulas);
          setSelectedNotes(new Set(data.notes.map(n => n.id)));
          setSelectedFormulas(new Set(data.formulas.map(f => f.id!)));
          setStep('organize');
        }, 500);
      }
    }, 800);
  };

  const handleImport = () => {
    const notesToImport = extractedNotes.filter(n => selectedNotes.has(n.id));
    const formulasToImport = extractedFormulas.filter(f => selectedFormulas.has(f.id!));
    onImport(isNewUnit ? `NEW:${newUnitName}` : targetUnitId, notesToImport, formulasToImport);
    onClose();
  };

  const isDuplicate = (formulaName: string) => {
    return existingFormulas.some(f => f.name.toUpperCase() === formulaName.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-[#faf9f6] w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        (step === 'review' || step === 'organize') ? 'max-w-6xl h-[90vh]' : 'max-w-2xl min-h-[400px]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-powder)] bg-white/50">
          <h2 className="text-xl font-serif font-extrabold text-[var(--color-ink)] flex items-center gap-2">
            <Sparkles className="text-[var(--color-dusty)]" size={24}/>
            AI File Import
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-[var(--color-ink)] rounded-full hover:bg-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 animate-in fade-in zoom-in-95">
              <div className="w-full max-w-md bg-white border-2 border-dashed border-[var(--color-powder)] rounded-3xl p-10 text-center hover:bg-stone-50 hover:border-[var(--color-dusty)] transition-all cursor-pointer relative overflow-hidden group">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept=".pdf,.pptx,.docx,.xlsx,.txt,image/*"
                  onChange={handleFileUpload}
                />
                <div className="bg-[var(--color-ivory)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} className="text-[var(--color-dusty)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">Upload class material</h3>
                <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                  Drop your PDF, Excel, PowerPoint, or screenshots here. <br/>
                  AI will organize them into notes and formulas.
                </p>
                <span className="inline-block px-6 py-2.5 bg-[var(--color-ink)] text-white text-sm font-bold rounded-full">
                  Select File
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 animate-in fade-in">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-[var(--color-ivory)] rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles size={40} className="text-[var(--color-dusty)]" />
                </div>
                <Loader2 size={120} className="absolute -inset-3 text-[var(--color-dusty)] animate-spin opacity-20" />
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-8">AI is working...</h3>
              
              <div className="w-full max-w-sm space-y-4">
                {[
                  'Reading file',
                  'Understanding lecture content',
                  'Detecting topics',
                  'Finding formulas',
                  'Reading screenshots',
                  'Creating Thai summary',
                  'Creating examples',
                  'Checking formulas',
                  'Organizing Study Content'
                ].map((label, idx) => (
                  <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${processingStage >= idx ? 'opacity-100' : 'opacity-30'}`}>
                    {processingStage > idx ? (
                      <CheckCircle2 className="text-emerald-500" size={20} />
                    ) : processingStage === idx ? (
                      <Loader2 className="text-[var(--color-dusty)] animate-spin" size={20} />
                    ) : (
                      <Circle className="text-stone-300" size={20} />
                    )}
                    <span className={`font-medium ${processingStage === idx ? 'text-[var(--color-ink)] font-bold' : 'text-stone-500'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          {/* STEP 2.5: ORGANIZE SUGGESTION */}
          {step === 'organize' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 overflow-y-auto">
              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[var(--color-powder)] overflow-hidden">
                <div className="bg-stone-50 border-b border-[var(--color-powder)] p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[var(--color-dusty)]">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[var(--color-ink)] mb-1">อยากเก็บเนื้อหานี้ไว้ที่ไหน?</h3>
                  <p className="text-sm text-stone-500">AI วิเคราะห์ไฟล์และแนะนำการจัดเก็บข้อมูลให้คุณแล้ว</p>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Unit Selection */}
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">สร้างหรือเพิ่มในโฟลเดอร์</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${!isNewUnit ? 'border-[var(--color-dusty)] bg-[var(--color-ivory)]' : 'border-stone-200 hover:border-stone-300'}`}
                        onClick={() => setIsNewUnit(false)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input type="radio" checked={!isNewUnit} readOnly className="text-[var(--color-dusty)] focus:ring-[var(--color-dusty)]"/>
                          <span className="font-bold text-[var(--color-ink)]">เพิ่มเข้า Unit เดิม</span>
                        </div>
                        <select 
                          value={targetUnitId} 
                          onChange={e => setTargetUnitId(e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-[var(--color-powder)] rounded-lg text-sm bg-white"
                          onClick={e => e.stopPropagation()}
                        >
                          {units.map(u => <option key={u.id} value={u.id}>{u.icon || '📁'} {u.title}</option>)}
                        </select>
                        <p className="text-[10px] text-[var(--color-sage)] font-bold mt-2">✦ AI แนะนำให้เก็บที่นี่</p>
                      </div>

                      <div 
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${isNewUnit ? 'border-[var(--color-dusty)] bg-[var(--color-ivory)]' : 'border-stone-200 hover:border-stone-300'}`}
                        onClick={() => setIsNewUnit(true)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input type="radio" checked={isNewUnit} readOnly className="text-[var(--color-dusty)] focus:ring-[var(--color-dusty)]"/>
                          <span className="font-bold text-[var(--color-ink)]">สร้าง Unit ใหม่</span>
                        </div>
                        <input 
                          type="text" 
                          value={newUnitName}
                          onChange={e => setNewUnitName(e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-[var(--color-powder)] rounded-lg text-sm bg-white"
                          placeholder="Unit Name"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Category</label>
                        <input 
                          type="text" 
                          value={targetCategory}
                          onChange={e => setTargetCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-powder)] rounded-lg text-sm bg-stone-50"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">AI Suggestion</p>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Tags</label>
                        <input 
                          type="text" 
                          value={targetTags}
                          onChange={e => setTargetTags(e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-powder)] rounded-lg text-sm bg-stone-50"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">Comma separated</p>
                     </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => setStep('review')}
                      className="px-6 py-2.5 bg-[var(--color-ink)] text-white font-bold rounded-xl shadow-sm hover:bg-stone-800 transition-colors flex items-center gap-2"
                    >
                      Review Content <ChevronRight size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

{/* STEP 3: REVIEW (SPLIT SCREEN) */}
          {step === 'review' && (
            <div className="flex-1 flex h-full overflow-hidden animate-in fade-in">
              
              {/* Left Pane: Original Source Info */}
              <div className="hidden lg:flex w-1/3 bg-stone-100 border-r border-[var(--color-powder)] flex-col">
                <div className="p-4 border-b border-stone-200 bg-stone-50/50">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Source Material</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                   <div className="w-32 h-40 bg-white shadow-md border border-stone-200 rounded-lg flex items-center justify-center mb-6 relative">
                     <FileText size={48} className="text-stone-300" />
                     <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--color-dusty)] rounded-full flex items-center justify-center text-white">
                       <Sparkles size={12} />
                     </div>
                   </div>
                   <h4 className="font-bold text-[var(--color-ink)] text-lg mb-2 truncate w-full px-4">{file?.name || 'Uploaded File'}</h4>
                   <p className="text-sm text-stone-500">
                     AI has successfully scanned this document and organized it into native app components.
                   </p>
                </div>
              </div>

              {/* Right Pane: AI Results & Selection */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-[var(--color-powder)] flex items-center justify-between bg-white z-10 shadow-sm">
                  <div>
                    <h3 className="font-bold text-[var(--color-ink)]">Review AI Organized Result</h3>
                    <p className="text-xs text-stone-500">Select which items to import into your notebook.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedNotes(new Set()); setSelectedFormulas(new Set()); }}
                      className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-lg"
                    >
                      Clear All
                    </button>
                    <button 
                      onClick={() => setStep('summary')}
                      className="px-4 py-1.5 bg-[var(--color-ink)] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm hover:bg-stone-800"
                    >
                      Next Step <ChevronRight size={14}/>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  
                  {/* Formulas Section */}
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-ink)] flex items-center gap-2 mb-4 uppercase tracking-wider border-b border-[var(--color-powder)] pb-2">
                      <Calculator size={16}/> Extracted Formulas ({extractedFormulas.length})
                    </h4>
                    
                    <div className="space-y-4">
                      {extractedFormulas.map(f => {
                        const dup = isDuplicate(f.name!);
                        const isSelected = selectedFormulas.has(f.id!);
                        
                        return (
                          <div key={f.id} className={`border rounded-2xl p-4 transition-all ${isSelected ? 'border-[var(--color-dusty)] bg-[var(--color-ivory)]/30' : 'border-stone-200 bg-white opacity-60'}`}>
                            <div className="flex items-start gap-3">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={(e) => {
                                  const next = new Set(selectedFormulas);
                                  if (e.target.checked) next.add(f.id!);
                                  else next.delete(f.id!);
                                  setSelectedFormulas(next);
                                }}
                                className="mt-1 w-5 h-5 rounded text-[var(--color-dusty)] focus:ring-[var(--color-dusty)] cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-bold text-lg text-[var(--color-ink)]">{f.name}</h5>
                                  <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded font-bold uppercase">{f.category}</span>
                                  {dup && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10}/> Duplicate</span>}
                                </div>
                                
                                {dup && (
                                  <p className="text-xs text-amber-700 mb-3 font-medium bg-amber-50 p-2 rounded border border-amber-100">
                                    This formula already exists in your library. Importing will create a new version.
                                  </p>
                                )}

                                <div className="bg-[var(--color-ink)] p-3 rounded-xl flex items-center justify-between gap-4 mt-2">
                                  <code className="text-[var(--color-ivory)] font-mono text-sm">{f.formula}</code>
                                </div>
                                
                                {f.teacherNote && (
                                  <div className="mt-3 text-xs bg-amber-50 p-2 rounded-lg border border-amber-100 text-amber-900 flex items-start gap-1">
                                    <span className="font-bold shrink-0">Tip:</span> {f.teacherNote}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Study Notes Section */}
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-ink)] flex items-center gap-2 mb-4 uppercase tracking-wider border-b border-[var(--color-powder)] pb-2">
                      <BookOpen size={16}/> Extracted Study Notes ({extractedNotes.length})
                    </h4>
                    <div className="space-y-3">
                      {extractedNotes.map(note => {
                        const isSelected = selectedNotes.has(note.id);
                        return (
                          <div key={note.id} className={`border rounded-xl p-4 transition-all flex items-start gap-3 ${isSelected ? 'border-[var(--color-dusty)] bg-white shadow-sm' : 'border-stone-200 bg-stone-50 opacity-60'}`}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={(e) => {
                                const next = new Set(selectedNotes);
                                if (e.target.checked) next.add(note.id);
                                else next.delete(note.id);
                                setSelectedNotes(next);
                              }}
                              className="mt-1 w-5 h-5 rounded text-[var(--color-dusty)] focus:ring-[var(--color-dusty)] cursor-pointer"
                            />
                            <div>
                              <h5 className="font-serif font-bold text-[var(--color-ink)] mb-1">{note.title}</h5>
                              <div className="text-sm text-stone-600 prose prose-sm max-w-none prose-p:leading-tight" dangerouslySetInnerHTML={{__html: note.content}} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & TARGET SELECTION */}
          {step === 'summary' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95">
              <div className="w-full max-w-lg bg-white border border-[var(--color-powder)] rounded-3xl p-8 shadow-xl">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-center text-[var(--color-ink)] mb-2">Ready to Import</h3>
                <div className="bg-stone-50 border border-[var(--color-powder)] rounded-xl p-4 mb-6 text-left">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Destination</div>
                  <div className="font-bold text-[var(--color-ink)] mb-1">{isNewUnit ? newUnitName : units.find(u=>u.id === targetUnitId)?.title}</div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-white px-2 py-1 rounded border border-stone-200">Category: {targetCategory}</span>
                    <span className="bg-white px-2 py-1 rounded border border-stone-200">Tags: {targetTags}</span>
                  </div>
                </div>
                <p className="text-center text-stone-500 mb-8">
                  You have selected <strong className="text-[var(--color-ink)]">{selectedFormulas.size} formulas</strong> and <strong className="text-[var(--color-ink)]">{selectedNotes.size} study sections</strong> to import.
                </p>

                

                <div className="flex gap-3">
                  <button onClick={() => setStep('review')} className="flex-1 px-4 py-3 bg-white border border-[var(--color-powder)] text-[var(--color-ink)] font-bold rounded-xl hover:bg-stone-50 transition-colors">
                    Back to Review
                  </button>
                  <button 
                    onClick={handleImport} 
                    className="flex-1 px-4 py-3 bg-[var(--color-ink)] text-white font-bold rounded-xl shadow-md hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <UploadCloud size={18} /> Confirm Import
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
