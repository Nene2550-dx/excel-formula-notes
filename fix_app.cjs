const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Clean up all handleRemoveFromUnit and handleDeleteCompletely
code = code.replace(/const handleRemoveFromUnit = \(\) => \{[\s\S]*?addToast\('Removed from Unit', 'success'\);\n  \};\n/g, "");
code = code.replace(/const handleDeleteCompletely = \(\) => \{[\s\S]*?addToast\('Deleted completely', 'success'\);\n  \};\n/g, "");

// Now insert them cleanly BEFORE handleDeleteFormula
const cleanHandlers = `
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

code = code.replace(/const handleDeleteFormula = \(formulaId: string\) => \{[\s\S]*?if \(target\) setFormulaToDelete\(target\);\n  \};/, cleanHandlers);
code = code.replace(/const handleDeleteFormula = \(formulaId: string\) => \{[\s\S]*?addToast\('ลบสูตรสำเร็จ', 'success'\);\n    \}\n  \};/, cleanHandlers);

// Double check the duplicate onDeleteFormula is gone
code = code.replace(/onDeleteFormula=\{\(f\) => setFormulaToDelete\(f\)\}\s*onDeleteFormula=\{handleDeleteFormula\}/g, "onDeleteFormula={handleDeleteFormula}");

fs.writeFileSync('src/App.tsx', code);
