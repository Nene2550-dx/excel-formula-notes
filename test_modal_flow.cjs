const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaModal.tsx', 'utf8');

// Add a console log to track unitId state
code = code.replace("const [unitId, setUnitId] = useState(activeUnitId || units[0]?.id || '');", "const [unitId, setUnitId] = useState(activeUnitId || units[0]?.id || '');\n  useEffect(() => { console.log('FormulaModal mounted with unitId:', unitId, 'activeUnitId prop:', activeUnitId); }, [activeUnitId]);");

fs.writeFileSync('src/components/FormulaModal.tsx', code);
