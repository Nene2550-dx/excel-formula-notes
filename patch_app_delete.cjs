const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import DeleteFormulaModal
code = code.replace("import { MoveFormulaModal } from './components/MoveFormulaModal';", "import { MoveFormulaModal } from './components/MoveFormulaModal';\nimport { DeleteFormulaModal } from './components/DeleteFormulaModal';");

// Add state for Delete Modal
const stateLoc = "const [formulaToMove, setFormulaToMove] = useState<Formula | null>(null);";
code = code.replace(stateLoc, stateLoc + "\n  const [formulaToDelete, setFormulaToDelete] = useState<Formula | null>(null);");

// Add Delete Handlers
const handlersLoc = "const handleMoveFormula = (unitId: string) => {";
const newHandlers = `
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
`;
code = code.replace(handlersLoc, newHandlers + "\n\n  " + handlersLoc);

// Add Delete Modal to render
const modalLoc = "<MoveFormulaModal";
const deleteModalCode = `
      {formulaToDelete && (
        <DeleteFormulaModal
          formula={formulaToDelete}
          onClose={() => setFormulaToDelete(null)}
          onRemoveFromUnit={handleRemoveFromUnit}
          onDeleteCompletely={handleDeleteCompletely}
        />
      )}
`;
code = code.replace(modalLoc, deleteModalCode + "\n      " + modalLoc);

// Pass onDelete to UnitDetail
code = code.replace("onEditFormula={(f) => { setEditingFormula(f); setIsFormulaModalOpen(true); }}", "onEditFormula={(f) => { setEditingFormula(f); setIsFormulaModalOpen(true); }}\n            onDeleteFormula={(f) => setFormulaToDelete(f)}");

fs.writeFileSync('src/App.tsx', code);
