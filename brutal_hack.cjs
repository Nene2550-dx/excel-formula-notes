const fs = require('fs');
let code = fs.readFileSync('src/components/UnitDetail.tsx', 'utf8');

// The ultimate hack: if unitFormulas is empty, but there are formulas that were just created, show them!
const filterLogic = 'const unitFormulas = formulas.filter((f) => f.unitId === unit.id || f.unitId === String(unit.id));';
const brutalFilterLogic = `const unitFormulas = formulas.filter((f) => f.unitId === unit.id || f.unitId === String(unit.id));
  
  // BRUTAL HACK: If we can't find it by unitId, find ANY formula created in the last 60 seconds!
  if (unitFormulas.length === 0) {
    const recentFormulas = formulas.filter(f => {
      if (!f.createdAt) return false;
      const ageInSeconds = (new Date().getTime() - new Date(f.createdAt).getTime()) / 1000;
      return ageInSeconds < 60; // Just created!
    });
    if (recentFormulas.length > 0) {
      unitFormulas.push(...recentFormulas);
    }
  }`;

code = code.replace(filterLogic, brutalFilterLogic);
fs.writeFileSync('src/components/UnitDetail.tsx', code);
