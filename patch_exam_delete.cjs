const fs = require('fs');
let code = fs.readFileSync('src/components/ExamModeView.tsx', 'utf8');

const titleDiv = `<div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-black text-stone-900 tracking-tight">{f.name}</h2>
                        {f.isFavorite && <span title="Favorite" className="text-amber-400">⭐</span>}`;

const titleDivWithDelete = `<div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-black text-stone-900 tracking-tight">{f.name}</h2>
                        {f.isFavorite && <span title="Favorite" className="text-amber-400">⭐</span>}
                        {onDeleteFormula && (
                          <button onClick={() => onDeleteFormula(f.id)} className="ml-auto text-rose-300 hover:text-rose-600 p-2 rounded-full hover:bg-rose-50 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        )}`;

code = code.replace(titleDiv, titleDivWithDelete);
fs.writeFileSync('src/components/ExamModeView.tsx', code);
