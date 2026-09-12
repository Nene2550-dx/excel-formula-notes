const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHandler = `  const handleDeleteFormula = (formulaId: string) => {
    const target = formulas.find((f) => f.id === formulaId);
    if (!target) return;
    if (window.confirm(\`คุณต้องการลบสูตร "\${target.name}" หรือไม่?\`)) {
      const updatedFormulas = formulas.filter((f) => f.id !== formulaId);
      setFormulas(updatedFormulas);
      storageService.saveFormulas(updatedFormulas);
      addToast(\`ลบสูตร \${target.name} แล้ว\`, 'info');
    }
  };`;

const newHandlers = `  const handleRemoveFromUnit = () => {
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
  };`;

code = code.replace(oldHandler, newHandlers);
fs.writeFileSync('src/App.tsx', code);
