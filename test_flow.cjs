// Mock state
let formulas = [];
let editingFormula = { unitId: 'unit-01' };

const handleSaveFormula = (formulaData) => {
  const updatedFormula = formulaData;
  let newFormulas;
  if (editingFormula && formulas.some(f => f.id === updatedFormula.id)) {
    newFormulas = formulas.map((f) => (f.id === updatedFormula.id ? updatedFormula : f));
  } else {
    newFormulas = [...formulas, updatedFormula];
  }
  formulas = newFormulas;
  editingFormula = null;
};

// Simulate FormulaModal submit
const newFormula = {
  id: editingFormula?.id || `f-${Date.now()}`,
  unitId: editingFormula?.unitId || 'fallback',
  name: 'Test',
};

handleSaveFormula(newFormula);

console.log('Result formulas:', formulas);
console.log('Is editingFormula null?', editingFormula === null);
