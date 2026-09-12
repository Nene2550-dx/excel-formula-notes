const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaModal.tsx', 'utf8');

// Replace the unit dropdown label with a clear indicator
const oldDropdownLabel = '<label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">Unit / บทเรียน</label>';
const newDropdownLabel = '<label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">📍 จะบันทึกไว้ใน Unit ไหน?</label>';
code = code.replace(oldDropdownLabel, newDropdownLabel);

fs.writeFileSync('src/components/FormulaModal.tsx', code);
