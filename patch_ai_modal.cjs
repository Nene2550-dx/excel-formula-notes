const fs = require('fs');
let code = fs.readFileSync('src/components/AIImportModal.tsx', 'utf8');

// Update ImportStep type
code = code.replace("type ImportStep = 'upload' | 'processing' | 'review' | 'summary';", "type ImportStep = 'upload' | 'processing' | 'organize' | 'review' | 'summary';");

// Add Category and Tags state
const stateMarker = "const [targetUnitId, setTargetUnitId] = useState<string>(units[0]?.id || '');";
const newStates = `const [targetUnitId, setTargetUnitId] = useState<string>(units[0]?.id || '');
  const [targetCategory, setTargetCategory] = useState<string>('Lookup');
  const [targetTags, setTargetTags] = useState<string>('#VLOOKUP, #Exam');
  const [isNewUnit, setIsNewUnit] = useState<boolean>(false);
  const [newUnitName, setNewUnitName] = useState<string>('New Unit from AI');`;
code = code.replace(stateMarker, newStates);

// Change processing to go to 'organize' instead of 'review'
code = code.replace("setStep('review');", "setStep('organize');");

// Add Organize Step JSX
const reviewStepMarker = "{/* STEP 3: REVIEW (SPLIT SCREEN) */}";
const organizeStepJSX = `
          {/* STEP 2.5: ORGANIZE SUGGESTION */}
          {step === 'organize' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 overflow-y-auto">
              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[var(--color-powder)] overflow-hidden">
                <div className="bg-stone-50 border-b border-[var(--color-powder)] p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[var(--color-dusty)]">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[var(--color-ink)] mb-1">Where should we save this?</h3>
                  <p className="text-sm text-stone-500">AI has analyzed the file and prepared suggestions.</p>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Unit Selection */}
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Target Folder / Unit</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={\`border-2 rounded-xl p-4 cursor-pointer transition-all \${!isNewUnit ? 'border-[var(--color-dusty)] bg-[var(--color-ivory)]' : 'border-stone-200 hover:border-stone-300'}\`}
                        onClick={() => setIsNewUnit(false)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input type="radio" checked={!isNewUnit} readOnly className="text-[var(--color-dusty)] focus:ring-[var(--color-dusty)]"/>
                          <span className="font-bold text-[var(--color-ink)]">Existing Unit</span>
                        </div>
                        <select 
                          value={targetUnitId} 
                          onChange={e => setTargetUnitId(e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-[var(--color-powder)] rounded-lg text-sm bg-white"
                          onClick={e => e.stopPropagation()}
                        >
                          {units.map(u => <option key={u.id} value={u.id}>{u.icon || '📁'} {u.title}</option>)}
                        </select>
                        <p className="text-[10px] text-[var(--color-sage)] font-bold mt-2">✦ AI Suggests: Unit 03</p>
                      </div>

                      <div 
                        className={\`border-2 rounded-xl p-4 cursor-pointer transition-all \${isNewUnit ? 'border-[var(--color-dusty)] bg-[var(--color-ivory)]' : 'border-stone-200 hover:border-stone-300'}\`}
                        onClick={() => setIsNewUnit(true)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input type="radio" checked={isNewUnit} readOnly className="text-[var(--color-dusty)] focus:ring-[var(--color-dusty)]"/>
                          <span className="font-bold text-[var(--color-ink)]">Create New Unit</span>
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
`;
code = code.replace(reviewStepMarker, organizeStepJSX + "\n" + reviewStepMarker);

// Fix height logic for review step in outer wrapper
code = code.replace("step === 'review' ? 'max-w-6xl h-[90vh]' : 'max-w-2xl min-h-[400px]'", "(step === 'review' || step === 'organize') ? 'max-w-6xl h-[90vh]' : 'max-w-2xl min-h-[400px]'");

// Also update the summary step to reflect the choices
const summaryMarker = "<p className=\"text-center text-stone-500 mb-8\">";
code = code.replace(summaryMarker, `<div className="bg-stone-50 border border-[var(--color-powder)] rounded-xl p-4 mb-6 text-left">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Destination</div>
                  <div className="font-bold text-[var(--color-ink)] mb-1">{isNewUnit ? newUnitName : units.find(u=>u.id === targetUnitId)?.title}</div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-white px-2 py-1 rounded border border-stone-200">Category: {targetCategory}</span>
                    <span className="bg-white px-2 py-1 rounded border border-stone-200">Tags: {targetTags}</span>
                  </div>
                </div>\n                ` + summaryMarker);

// Remove the old targetUnitId select from summary since it's now in organize
const oldSelectMarker = `<div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-8">`;
const endOldSelectMarker = `</select>
                  <p className="text-xs text-stone-500 mt-3">
                    AI suggests placing these in <strong>Unit 03 — Lookup Functions</strong> based on context.
                  </p>
                </div>`;
const startIndex = code.indexOf(oldSelectMarker);
const endIndex = code.indexOf(endOldSelectMarker) + endOldSelectMarker.length;
if(startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
}

fs.writeFileSync('src/components/AIImportModal.tsx', code);
