const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleSaveFormula = \(formulaData: Partial<Formula>\) => \{[\s\S]*?let newFormulas;/;
const replacement = \`const handleSaveFormula = (formulaData: Partial<Formula>) => {
    const updatedFormula = formulaData as Formula;
    // DEBUG ALERT
    alert("Saving formula! Name: " + updatedFormula.name + " Unit: " + updatedFormula.unitId);
    let newFormulas;\`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
