const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The Dashboard one uses handleSelectUnit
content = content.replace(
  '<Dashboard\n            units={units}\n            formulas={formulas}\n            onSelectUnit={handleSelectUnit}',
  '<Dashboard\n            units={units}\n            formulas={formulas}\n            onSelectUnit={handleSelectUnit}'
); // ensure it's handleSelectUnit

// The GlobalSearch one uses handleSelectUnitFromSearch
content = content.replace(
  '<GlobalSearch\n          isOpen={isGlobalSearchOpen}\n          formulas={formulas}\n          units={units}\n          onClose={() => setIsGlobalSearchOpen(false)}\n          onSelectFormula={handleSelectFromSearch}\n          onSelectUnit={handleSelectUnit}',
  '<GlobalSearch\n          isOpen={isGlobalSearchOpen}\n          formulas={formulas}\n          units={units}\n          onClose={() => setIsGlobalSearchOpen(false)}\n          onSelectFormula={handleSelectFromSearch}\n          onSelectUnit={handleSelectUnitFromSearch}'
);

fs.writeFileSync('src/App.tsx', content);
