const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaCard.tsx', 'utf8');

const oldToolRender = `{isTool ? (
        <div className="space-y-4">
          <p className="text-stone-700 font-medium leading-relaxed">{formula.shortDescription}</p>
          <div className="bg-stone-50 p-4 rounded-2xl border border-[var(--color-powder)] text-sm">
            <h4 className="font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">
              <Check size={16} className="text-[var(--color-sage)]" /> ขั้นตอนการทำงาน
            </h4>
            <div className="text-stone-600 whitespace-pre-wrap leading-relaxed">{formula.stepsText}</div>
          </div>
        </div>
      ) : (`;

const newToolRender = `{isTool ? (
        <div className="space-y-6">
          <p className="text-stone-700 font-medium leading-relaxed text-sm">{formula.shortDescription}</p>
          
          {/* Steps */}
          {formula.toolSteps && formula.toolSteps.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-[var(--color-ink)] text-sm flex items-center gap-2 border-b border-[var(--color-powder)] pb-2">
                ▼ ขั้นตอนการทำ
              </h4>
              <div className="space-y-3">
                {formula.toolSteps.map((step, idx) => (
                  <div key={step.id} className="flex gap-3 text-sm">
                    <div className="text-stone-400 font-mono font-bold mt-0.5">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap gap-2 items-baseline">
                        {step.cell && <span className="px-2 py-0.5 bg-white border border-[var(--color-powder)] text-stone-500 font-mono font-bold rounded text-xs">{step.cell}</span>}
                        {step.type === 'shortcut' ? (
                          <span className="px-2 py-0.5 bg-stone-800 text-white font-mono font-bold rounded text-xs">{step.content}</span>
                        ) : step.type === 'formula' ? (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded border border-blue-200 text-xs">{step.content}</span>
                        ) : step.type === 'command' ? (
                          <span className="font-bold text-[var(--color-ink)]">{step.content}</span>
                        ) : (
                          <span className="text-stone-700 leading-relaxed">{step.content}</span>
                        )}
                        {step.detail && <span className="text-stone-500 text-xs">- {step.detail}</span>}
                      </div>
                      
                      {step.imageUrl && (
                        <div className="mt-2">
                          <img src={step.imageUrl} alt={step.caption || "Step preview"} className="rounded-xl border border-[var(--color-powder)] max-h-48 object-cover" />
                          {step.caption && <p className="text-xs text-stone-400 mt-1 italic">{step.caption}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example */}
          {formula.toolExampleResult && (
             <div className="bg-stone-50 p-4 rounded-2xl border border-[var(--color-powder)] text-sm">
               <h4 className="font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">
                 📝 ตัวอย่างการใช้งาน
               </h4>
               <p className="text-stone-600 whitespace-pre-wrap">{formula.toolExampleResult}</p>
             </div>
          )}

          {/* Shortcut */}
          {formula.keyboardShortcut && (
            <div className="flex items-center gap-3 p-3 bg-[var(--color-ivory)] border border-[var(--color-powder)] rounded-xl">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Shortcut</span>
              <kbd className="px-2 py-1 bg-white border border-stone-200 rounded shadow-sm text-xs font-mono font-bold text-[var(--color-ink)]">{formula.keyboardShortcut}</kbd>
            </div>
          )}

          {/* Tips / Warnings / Exam Note */}
          {(formula.tips || formula.warnings || formula.teacherNote) && (
            <div className="space-y-3 pt-2">
              {formula.tips && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-sm flex gap-2">
                  <span>💡</span>
                  <div className="flex-1">
                    <span className="font-bold block mb-1">Tip</span>
                    <span className="opacity-90 leading-relaxed">{formula.tips}</span>
                  </div>
                </div>
              )}
              {formula.warnings && (
                <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-sm flex gap-2">
                  <span>⚠️</span>
                  <div className="flex-1">
                    <span className="font-bold block mb-1">ข้อควรระวัง</span>
                    <span className="opacity-90 leading-relaxed">{formula.warnings}</span>
                  </div>
                </div>
              )}
              {formula.teacherNote && (
                <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-sm flex gap-2">
                  <span>📌</span>
                  <div className="flex-1">
                    <span className="font-bold block mb-1">Exam Note</span>
                    <span className="opacity-90 leading-relaxed">{formula.teacherNote}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (`;

code = code.replace(oldToolRender, newToolRender);
fs.writeFileSync('src/components/FormulaCard.tsx', code);
