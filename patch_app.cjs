const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert handleAIImport function
const actionsStr = "// Actions";
const handleAIImportStr = `
  const handleAIImport = (targetUnitId: string, newNotes: any[], newFormulas: any[]) => {
    // 1. Update Unit's Note Sections
    const targetUnit = units.find(u => u.id === targetUnitId);
    if (targetUnit) {
      const updatedUnit = {
        ...targetUnit,
        noteSections: [...(targetUnit.noteSections || []), ...newNotes.map((n, i) => ({ ...n, order: (targetUnit.noteSections?.length || 0) + i }))]
      };
      const newUnits = units.map(u => u.id === targetUnitId ? updatedUnit : u);
      setUnits(newUnits);
      storageService.saveUnits(newUnits);
    }

    // 2. Add New Formulas
    const formulasToAdd = newFormulas.map(f => ({
      ...f,
      unitId: targetUnitId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as Formula[];
    
    if (formulasToAdd.length > 0) {
      const newFormulasList = [...formulas, ...formulasToAdd];
      setFormulas(newFormulasList);
      storageService.saveFormulas(newFormulasList);
    }

    addToast(\`Imported \${newNotes.length} notes and \${newFormulas.length} formulas\`, 'success');
  };
`;
code = code.replace(actionsStr, actionsStr + handleAIImportStr);

// Insert <AIImportModal> component
const modalsStr = "{/* Modals */}";
const importModalStr = `
      {isAIImportModalOpen && (
        <AIImportModal
          isOpen={isAIImportModalOpen}
          onClose={() => setIsAIImportModalOpen(false)}
          units={units}
          existingFormulas={formulas}
          onImport={handleAIImport}
        />
      )}
`;
code = code.replace(modalsStr, modalsStr + "\n" + importModalStr);

fs.writeFileSync('src/App.tsx', code);
