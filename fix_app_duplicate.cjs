const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /if \(editingUnit\) \{/g;
code = code.replace(regex, "if (editingUnit || units.some(u => u.id === updatedUnit.id)) {");

fs.writeFileSync('src/App.tsx', code);
