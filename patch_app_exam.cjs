const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const examViewOld = `<ExamModeView 
            formulas={formulas}
            onBack={() => setViewMode('dashboard')}
          />`;

const examViewNew = `<ExamModeView 
            formulas={formulas}
            onBack={() => setViewMode('dashboard')}
            onDeleteFormula={handleDeleteFormula}
          />`;

code = code.replace(examViewOld, examViewNew);
fs.writeFileSync('src/App.tsx', code);
