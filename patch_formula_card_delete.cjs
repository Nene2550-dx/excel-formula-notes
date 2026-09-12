const fs = require('fs');
let code = fs.readFileSync('src/components/FormulaCard.tsx', 'utf8');

// Add Trash icon import
code = code.replace("Copy, Check } from 'lucide-react';", "Copy, Check, Trash2 } from 'lucide-react';");

// Add onDelete prop
code = code.replace("onEdit?: (formula: Formula) => void;", "onEdit?: (formula: Formula) => void;\n  onDelete?: (formula: Formula) => void;");
code = code.replace("onToggleFavorite, onEdit }) => {", "onToggleFavorite, onEdit, onDelete }) => {");

// Add Delete button
const editBtn = "{onEdit && <button onClick={() => onEdit(formula)} className=\"text-xs font-bold text-stone-400 hover:text-[var(--color-ink)]\">Edit</button>}";
const deleteBtn = "{onDelete && <button onClick={() => onDelete(formula)} className=\"text-xs font-bold text-rose-400 hover:text-rose-600 ml-2\">Delete</button>}";
code = code.replace(editBtn, editBtn + "\n          " + deleteBtn);

fs.writeFileSync('src/components/FormulaCard.tsx', code);
