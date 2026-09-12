const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaModal.tsx', 'utf8');

// Add a useEffect to strictly sync unitId
const syncEffect = `  useEffect(() => {
    if (activeUnitId) {
      setUnitId(activeUnitId);
    }
  }, [activeUnitId]);`;

if (!code.includes(syncEffect)) {
  code = code.replace("const [unitId, setUnitId] = useState(activeUnitId || units[0]?.id || '');", "const [unitId, setUnitId] = useState(activeUnitId || units[0]?.id || '');\n" + syncEffect);
  fs.writeFileSync('src/components/FormulaModal.tsx', code);
}
