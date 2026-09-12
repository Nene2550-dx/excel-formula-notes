const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogic = `      newUnits = [...units, updatedUnit];
      addToast(\`สร้างบทเรียน "\${updatedUnit.title}" สำเร็จ\`, 'success');`;

const newLogic = `      const newUnitWithId = { ...updatedUnit, id: \`u-\${Date.now()}\`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), order: units.length };
      newUnits = [...units, newUnitWithId];
      addToast(\`สร้างบทเรียน "\${updatedUnit.title}" สำเร็จ\`, 'success');`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', code);
