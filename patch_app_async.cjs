const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix initial state
code = code.replace("const [units, setUnits] = useState<Unit[]>(storageService.getUnits());", "const [units, setUnits] = useState<Unit[]>([]); const [isLoaded, setIsLoaded] = useState(false);");
code = code.replace("const [formulas, setFormulas] = useState<Formula[]>(storageService.getFormulas());", "const [formulas, setFormulas] = useState<Formula[]>([]);");

// Add useEffect to load data
const useEffectLoad = `
  useEffect(() => {
    Promise.all([storageService.getUnits(), storageService.getFormulas()]).then(([u, f]) => {
      setUnits(u);
      setFormulas(f);
      setIsLoaded(true);
    });
  }, []);
`;
// Insert after states
code = code.replace("const [editingFormula, setEditingFormula] = useState<Partial<Formula> | null>(null);", "const [editingFormula, setEditingFormula] = useState<Partial<Formula> | null>(null);\n" + useEffectLoad);

// If not loaded, return loading screen
code = code.replace("return (", "if (!isLoaded) return <div className=\"h-screen flex items-center justify-center text-[var(--color-ink)]\">Loading...</div>;\n\n  return (");

fs.writeFileSync('src/App.tsx', code);
