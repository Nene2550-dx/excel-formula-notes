const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the old handleDeleteFormula string param with setting formulaToDelete
const oldHandler = /const handleDeleteFormula = \(formulaId: string\) => \{[\s\S]*?addToast\('ลบสูตรสำเร็จ', 'success'\);\n  \};/;
const newHandler = `
  const handleRemoveFromUnit = () => {
    if (!formulaToDelete) return;
    const newFormulas = formulas.map(f => f.id === formulaToDelete.id ? { ...f, unitId: '' } : f);
    setFormulas(newFormulas);
    storageService.saveFormulas(newFormulas);
    setFormulaToDelete(null);
    addToast('Removed from Unit', 'success');
  };

  const handleDeleteCompletely = () => {
    if (!formulaToDelete) return;
    const newFormulas = formulas.filter(f => f.id !== formulaToDelete.id);
    setFormulas(newFormulas);
    storageService.saveFormulas(newFormulas);
    setFormulaToDelete(null);
    addToast('Deleted completely', 'success');
  };

  const handleDeleteFormula = (formulaId: string) => {
    const target = formulas.find((f) => f.id === formulaId);
    if (target) setFormulaToDelete(target);
  };
`;
code = code.replace(oldHandler, newHandler);

// Remove the duplicate onDeleteFormula attribute from UnitDetail
code = code.replace("onDeleteFormula={(f) => setFormulaToDelete(f)}\n            onDeleteFormula={handleDeleteFormula}", "onDeleteFormula={handleDeleteFormula}");

// The regex I used earlier inserted handleRemoveFromUnit above handleMoveFormula, but I just replaced oldHandler. Let's remove the broken ones from earlier.
code = code.replace(/const handleRemoveFromUnit = \(\) => \{[\s\S]*?const handleDeleteCompletely = \(\) => \{[\s\S]*?addToast\('Deleted completely', 'success'\);\n  \};\n\n  const handleMoveFormula/m, "const handleMoveFormula");

fs.writeFileSync('src/App.tsx', code);
