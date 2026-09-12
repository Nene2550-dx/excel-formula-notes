const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  "newFormulas = [...formulas, { ...updatedFormula, unitId: updatedFormula.unitId || formulaModalUnitId || selectedUnitId }];",
  "newFormulas = [...formulas, { ...updatedFormula, unitId: updatedFormula.unitId || formulaModalUnitId || selectedUnitId || '' }];"
);
fs.writeFileSync('src/App.tsx', appCode);
