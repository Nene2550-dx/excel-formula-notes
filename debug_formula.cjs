// Mock state
let formulas = [];
let editingFormula = null; // null because setEditingFormula(null) is called

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

// Simulate submit
const newFormula = {
  id: `f-${Date.now()}`,
  unitId: 'unit-01',
  name: 'Test',
};

handleSaveFormula(newFormula);
console.log(formulas);
