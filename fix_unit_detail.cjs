const fs = require('fs');
let code = fs.readFileSync('src/components/UnitDetail.tsx', 'utf8');

// Combine Formulas & Excel Tools headers
code = code.replace("📊 Formulas", "🧮 Formulas & Excel Tools");
code = code.replace("No formulas added yet.", "ยังไม่มีสูตรหรือเครื่องมือใน Unit นี้");

// Remove the standalone Excel Tools button since they use Add Formula for both now
// Wait, I didn't add an Excel Tools button here before. It's just '+ Add Formula'.
code = code.replace("+ Add Formula", "+ Add Formula / Tool");

fs.writeFileSync('src/components/UnitDetail.tsx', code);
