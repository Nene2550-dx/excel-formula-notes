const fs = require('fs');

// Ensure UnitDetail perfectly renders formulas
let unitCode = fs.readFileSync('src/components/UnitDetail.tsx', 'utf8');
unitCode = unitCode.replace(
  "const unitFormulas = formulas.filter((f) => f.unitId === unit.id);",
  "const unitFormulas = formulas.filter((f) => f.unitId === unit.id || f.unitId === String(unit.id));\n  console.log('Unit Formulas for', unit.id, unitFormulas);"
);
fs.writeFileSync('src/components/UnitDetail.tsx', unitCode);

// Ensure App.tsx save logic is bulletproof
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  "newFormulas = [...formulas, updatedFormula];",
  "newFormulas = [...formulas, { ...updatedFormula, unitId: updatedFormula.unitId || formulaModalUnitId || selectedUnitId }];"
);
fs.writeFileSync('src/App.tsx', appCode);

