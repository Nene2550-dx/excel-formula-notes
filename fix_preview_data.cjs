const fs = require('fs');
let code = fs.readFileSync('src/components/ExcelToolForm.tsx', 'utf8');

const oldPreview = `    formula: '', // Not used
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };`;

const newPreview = `    formula: '', // Not used
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };`;

code = code.replace(oldPreview, newPreview);
fs.writeFileSync('src/components/ExcelToolForm.tsx', code);
