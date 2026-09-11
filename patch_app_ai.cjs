const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `const targetUnit = units.find(u => u.id === targetUnitId);`;
const newLogic = `
    let finalUnitId = targetUnitId;
    let finalUnits = [...units];
    
    if (targetUnitId.startsWith('NEW:')) {
      const newName = targetUnitId.replace('NEW:', '');
      const newUnit = {
        id: 'u' + Date.now().toString(),
        unitNumber: units.length + 1,
        title: newName,
        description: 'Imported by AI',
        icon: '📁',
        order: units.length,
        noteSections: []
      };
      finalUnits.push(newUnit);
      finalUnitId = newUnit.id;
    }

    const targetUnit = finalUnits.find(u => u.id === finalUnitId);
`;

code = code.replace(targetStr, newLogic);
code = code.replace(/setUnits\(newUnits\);/g, 'setUnits(newUnits);'); // Just ensuring no breakage.
code = code.replace(/units\.map\(u => u\.id === targetUnitId/g, 'finalUnits.map(u => u.id === finalUnitId');
code = code.replace(/unitId: targetUnitId,/g, 'unitId: finalUnitId,');

fs.writeFileSync('src/App.tsx', code);
