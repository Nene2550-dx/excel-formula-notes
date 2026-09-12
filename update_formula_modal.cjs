const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaModal.tsx', 'utf8');

// Add 'type' state
code = code.replace("const [formula, setFormula] = useState(initialFormula?.formula || '');", "const [formula, setFormula] = useState(initialFormula?.formula || '');\n  const [type, setType] = useState<'formula' | 'tool'>(initialFormula?.type || 'formula');\n  const [stepsText, setStepsText] = useState(initialFormula?.stepsText || '');");

// Add 'type' to newFormula payload
code = code.replace("id: initialFormula?.id || `f-${Date.now()}`,", "id: initialFormula?.id || `f-${Date.now()}`,\n      type,\n      stepsText,");

// Add Radio buttons for Type Selection
const radioButtons = `
          <div className="flex gap-4 p-1 bg-stone-100 rounded-xl mb-6 w-max">
            <button type="button" onClick={() => setType('formula')} className={\`px-6 py-2 rounded-lg font-bold text-sm transition-all \${type === 'formula' ? 'bg-white shadow-sm text-blue-600' : 'text-stone-500 hover:text-stone-700'}\`}>🧮 Excel Formula</button>
            <button type="button" onClick={() => setType('tool')} className={\`px-6 py-2 rounded-lg font-bold text-sm transition-all \${type === 'tool' ? 'bg-white shadow-sm text-amber-600' : 'text-stone-500 hover:text-stone-700'}\`}>🛠 Excel Tool</button>
          </div>
`;
code = code.replace("<div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">", radioButtons + "\n          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">");

// Conditionally render fields based on 'type'
code = code.replace(
  /<div className="md:col-span-3 space-y-6">[\s\S]*?<div>\s*<label className="block text-xs font-bold text-\[var\(--color-ink\)\] uppercase tracking-wider mb-1">ตัวอย่างการใช้งาน \(Example\)/,
  `
          <div className="md:col-span-3 space-y-6">
            {type === 'formula' ? (
              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">สูตร (Formula)*</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-400">=</div>
                  <input type="text" value={formula} onChange={(e) => { setFormula(e.target.value.startsWith('=') ? e.target.value.substring(1) : e.target.value); setValidation(null); }} placeholder="VLOOKUP(A2, A:B, 2, 0)" className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-mono font-bold text-[var(--color-ink)] text-lg transition-all" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">ขั้นตอนการใช้งาน (Steps)*</label>
                <textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} rows={4} placeholder="1. เลือกข้อมูล\n2. ไปที่ Data\n3. เลือก Remove Duplicates" className="w-full px-4 py-3 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-mono text-[var(--color-ink)] text-sm transition-all" />
              </div>
            )}
            
            {type === 'formula' && (
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">ไวยากรณ์ (Syntax)</label>
              <input type="text" value={syntax} onChange={(e) => setSyntax(e.target.value)} placeholder="e.g. VLOOKUP(lookup_value, table_array, ...)" className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-powder)] bg-[var(--color-ivory)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] font-mono text-sm text-[var(--color-ink)] transition-all" />
            </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1">ตัวอย่างการใช้งาน (Example)`
);

// Disable validation if type === 'tool'
code = code.replace("if (!name || !formula) {", "if (!name || (type === 'formula' && !formula) || (type === 'tool' && !stepsText)) {");

fs.writeFileSync('src/components/FormulaModal.tsx', code);
