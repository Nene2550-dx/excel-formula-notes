const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaModal.tsx', 'utf8');

// Import ExcelToolForm
if (!code.includes('ExcelToolForm')) {
  code = code.replace("import { StepListEditor } from './StepListEditor';", "import { StepListEditor } from './StepListEditor';\nimport { ExcelToolForm } from './ExcelToolForm';");
}

// Find the start of the form
const formStart = `<div className="p-6 border-b border-[var(--color-powder)] flex justify-between items-center bg-white">`;

// Wrap the entire content based on type
const regex = /(<div className="bg-\[#faf9f6\] w-full max-w-4xl h-\[90vh\] flex flex-col rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95">)([\s\S]*?)(<\/div>\s*<\/div>\s*\);\s*\};\s*export default FormulaModal;?)/;
// Wait, my regex might fail. I'll just replace the inner content.

// Better approach:
// Find the wrapper: <div className="bg-[#faf9f6] w-full max-w-4xl h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95">
// If type === 'tool', max-w-6xl. If type === 'formula', max-w-4xl.
code = code.replace(/max-w-4xl/g, `\${type === 'tool' ? 'max-w-7xl' : 'max-w-4xl'}`);
code = code.replace(/className="bg-\[#faf9f6\]/g, 'className={`bg-[#faf9f6]');
code = code.replace(/zoom-in-95">/g, 'zoom-in-95`}>');

// Now inside, if type === 'tool', we render ExcelToolForm INSTEAD of the form.
const headerBlock = `<div className="p-6 border-b border-[var(--color-powder)] flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif font-black text-[var(--color-ink)]">
            {initialFormula ? '✏️ Edit' : '✨ Add New'} Formula / Tool
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors">
            <X size={24} />
          </button>
        </div>`;

const toggleBlock = `        {/* Type Toggle */}
        <div className="p-6 pb-0">
          <div className="flex bg-stone-100 p-1 rounded-xl w-max">
            <button
              type="button"
              onClick={() => setType('formula')}
              className={\`px-6 py-2 rounded-lg font-bold text-sm transition-all \${type === 'formula' ? 'bg-white text-[var(--color-ink)] shadow-sm' : 'text-stone-500 hover:text-[var(--color-ink)]'}\`}
            >
              🧮 Excel Formula
            </button>
            <button
              type="button"
              onClick={() => setType('tool')}
              className={\`px-6 py-2 rounded-lg font-bold text-sm transition-all \${type === 'tool' ? 'bg-white text-[var(--color-ink)] shadow-sm' : 'text-stone-500 hover:text-[var(--color-ink)]'}\`}
            >
              🛠 Excel Tool
            </button>
          </div>
        </div>`;

const existingFormBlockRegex = /(<div className="flex-1 overflow-y-auto custom-scrollbar p-6">[\s\S]*?)<\/form>/;

// We will split the rendering.
const newRenderLogic = `
        {type === 'tool' ? (
          <div className="p-6 flex-1 overflow-hidden">
            <ExcelToolForm 
              initialFormula={initialFormula}
              units={units}
              activeUnitId={unitId}
              onSave={(data) => {
                const completeData = { ...data, id: initialFormula?.id || \`f-\${Date.now()}\`, createdAt: initialFormula?.createdAt || new Date().toISOString() };
                onSave(completeData);
              }}
              onCancel={onClose}
            />
          </div>
        ) : (
          <form id="formula-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            $1
          </form>
        )}
`;

code = code.replace(existingFormBlockRegex, newRenderLogic);

// Wait, the Footer button is outside the <form>!
// The footer is:
/*
        <div className="p-6 border-t border-[var(--color-powder)] bg-white flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-stone-500 hover:bg-stone-100 rounded-xl transition-colors">
            ยกเลิก
          </button>
          <button type="submit" form="formula-form" className="px-8 py-3 bg-[var(--color-ink)] hover:bg-stone-800 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
            <Check size={18} /> บันทึกข้อมูล
          </button>
        </div>
*/
// We need to hide this footer if type === 'tool', because ExcelToolForm has its own footer!
const oldFooter = `<div className="p-6 border-t border-[var(--color-powder)] bg-white flex justify-end gap-3 shrink-0">`;
const newFooter = `{type === 'formula' && <div className="p-6 border-t border-[var(--color-powder)] bg-white flex justify-end gap-3 shrink-0">`;
code = code.replace(oldFooter, newFooter);
// And close the bracket after the footer div.
code = code.replace(/<\/button>\n        <\/div>\n      <\/div>/, `</button>\n        </div>}\n      </div>`);

fs.writeFileSync('src/components/FormulaModal.tsx', code);
