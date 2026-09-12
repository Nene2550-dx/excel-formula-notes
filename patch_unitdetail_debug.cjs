const fs = require('fs');
let code = fs.readFileSync('src/components/UnitDetail.tsx', 'utf8');

const emptyState = `<div className="text-center py-10 bg-white rounded-3xl border border-[var(--color-powder)] border-dashed text-stone-400 font-medium text-sm">
                  ยังไม่มีสูตรหรือเครื่องมือใน Unit นี้
                </div>`;

const debugState = `<div className="text-center py-10 bg-white rounded-3xl border border-[var(--color-powder)] border-dashed text-stone-400 font-medium text-sm">
                  ยังไม่มีสูตรหรือเครื่องมือใน Unit นี้ (Current Unit ID: {unit.id})<br/><br/>
                  <span className="text-xs text-rose-400">DEBUG: Formulas in database: {formulas.length}. Unit IDs found: {formulas.map(f => f.unitId).join(', ')}</span>
                </div>`;

code = code.replace(emptyState, debugState);
fs.writeFileSync('src/components/UnitDetail.tsx', code);
