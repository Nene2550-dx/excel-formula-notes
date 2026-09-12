const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogic = "newFormulas = [...formulas, { ...updatedFormula, unitId: updatedFormula.unitId || formulaModalUnitId || selectedUnitId || '' }];";
const newLogic = `      // BRUTAL OVERRIDE to ensure it ALWAYS goes to the current unit if added from inside a unit
      let forcedUnitId = updatedFormula.unitId || formulaModalUnitId || selectedUnitId || '';
      if (viewMode === 'unit' && selectedUnitId) {
        forcedUnitId = selectedUnitId;
      }
      newFormulas = [...formulas, { ...updatedFormula, unitId: forcedUnitId }];`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', code);
