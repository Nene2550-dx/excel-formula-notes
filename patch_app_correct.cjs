const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add isLoaded state
code = code.replace("const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);", "const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);\n  const [isLoaded, setIsLoaded] = useState(false);");

// Fix the useEffect block
const oldEffect = `
  // Initialize
  useEffect(() => {
    const loadedUnits = storageService.getUnits();
    const loadedFormulas = storageService.getFormulas();
    setUnits(loadedUnits);
    setFormulas(loadedFormulas);

    // Global Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        if (e.key === 'Escape') (e.target as HTMLElement).blur();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if (e.key === '/') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); setViewMode('exam'); }
      if (e.key === 'Escape') { setIsGlobalSearchOpen(false); }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (!isLoaded) return <div className="h-screen flex items-center justify-center text-[var(--color-ink)]">Loading...</div>;

  return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
`;

const newEffect = `
  // Initialize
  useEffect(() => {
    const loadData = async () => {
      const loadedUnits = await storageService.getUnits();
      const loadedFormulas = await storageService.getFormulas();
      setUnits(loadedUnits);
      setFormulas(loadedFormulas);
      setIsLoaded(true);
    };
    loadData();

    // Global Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        if (e.key === 'Escape') (e.target as HTMLElement).blur();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if (e.key === '/') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); setViewMode('exam'); }
      if (e.key === 'Escape') { setIsGlobalSearchOpen(false); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
`;

code = code.replace(oldEffect.trim(), newEffect.trim());

// Add the loading return right before the main return
code = code.replace("const selectedUnit = units.find((u) => u.id === selectedUnitId);", "if (!isLoaded) return <div className=\"h-screen flex items-center justify-center font-bold text-stone-500\">Loading Storage...</div>;\n\n  const selectedUnit = units.find((u) => u.id === selectedUnitId);");

fs.writeFileSync('src/App.tsx', code);
