const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexFormula = /if \(editingFormula\) \{/g;
// Only treat it as an edit if the formula actually exists in the array
code = code.replace(regexFormula, "if (editingFormula && formulas.some(f => f.id === updatedFormula.id)) {");

fs.writeFileSync('src/App.tsx', code);
