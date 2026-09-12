const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaLibraryView.tsx', 'utf8');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/components/FormulaLibraryView.tsx', code);
