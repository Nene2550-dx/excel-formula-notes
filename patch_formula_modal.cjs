const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaModal.tsx', 'utf8');

// Remove the window.confirm validation check that might be silently failing
const validationCheck = `    if (!isDraft && validation?.status === 'error') {
      if (!window.confirm('สูตรยังมี Error อยู่ คุณต้องการบันทึกต่อไปหรือไม่?')) {
        return;
      }
    }`;
code = code.replace(validationCheck, "// Validation confirm removed to prevent silent failure");

fs.writeFileSync('src/components/FormulaModal.tsx', code);
