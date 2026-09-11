const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure handleAIImport uses finalUnitId correctly
code = code.replace(/unitId: targetUnitId,\n      createdAt: new Date/g, 'unitId: finalUnitId,\n      createdAt: new Date');

// Ensure newUnit has createdAt and updatedAt
code = code.replace("noteSections: []\n      };", "noteSections: [],\n        createdAt: new Date().toISOString(),\n        updatedAt: new Date().toISOString()\n      };");

fs.writeFileSync('src/App.tsx', code);
