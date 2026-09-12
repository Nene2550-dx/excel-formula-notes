// Mock App State
const units = [{ id: 'u-1', title: 'Unit 1' }];
let formulas = [];
let selectedUnitId = 'u-1';
let formulaModalUnitId = undefined;

// User clicks + Add Formula
const handleOpenAddFormula = (unitId) => {
  formulaModalUnitId = unitId || selectedUnitId || units[0]?.id;
};

handleOpenAddFormula('u-1');

// Inside FormulaModal
let modalUnitId = formulaModalUnitId || units[0]?.id || '';
let type = 'formula';
let stepsText = '';
const newFormula = {
  id: 'f-1',
  type,
  stepsText,
  unitId: modalUnitId,
  name: 'TRIM',
  formula: '=TRIM()'
};

// App.tsx receives save
const handleSaveFormula = (formulaData) => {
  let newFormulas = [...formulas, { ...formulaData, unitId: formulaData.unitId || formulaModalUnitId || selectedUnitId || '' }];
  formulas = newFormulas;
};

handleSaveFormula(newFormula);

// Inside UnitDetail
const unitFormulas = formulas.filter(f => f.unitId === 'u-1' || f.unitId === String('u-1'));
console.log("Unit Formulas length:", unitFormulas.length);
console.log("Unit Formulas:", unitFormulas);
