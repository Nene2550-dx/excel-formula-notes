const fs = require('fs');
let code = fs.readFileSync('src/components/NoteSectionEditor.tsx', 'utf8');

// Fix the broken syntax from previous script
code = code.replace(/onMouseDown=\{\(e\) => \{ e\.preventDefault\(\); applyHighlight\('#fef08a'\)/g, "onMouseDown={(e) => { e.preventDefault(); applyHighlight('#fef08a'); }}");
code = code.replace(/onMouseDown=\{\(e\) => \{ e\.preventDefault\(\); applyHighlight\('#fbcfe8'\)/g, "onMouseDown={(e) => { e.preventDefault(); applyHighlight('#fbcfe8'); }}");
code = code.replace(/onMouseDown=\{\(e\) => \{ e\.preventDefault\(\); applyHighlight\('#bbf7d0'\)/g, "onMouseDown={(e) => { e.preventDefault(); applyHighlight('#bbf7d0'); }}");
code = code.replace(/onMouseDown=\{\(e\) => \{ e\.preventDefault\(\); applyHighlight\('#e9d5ff'\)/g, "onMouseDown={(e) => { e.preventDefault(); applyHighlight('#e9d5ff'); }}");
code = code.replace(/onMouseDown=\{\(e\) => \{ e\.preventDefault\(\); applyHighlight\('#fed7aa'\)/g, "onMouseDown={(e) => { e.preventDefault(); applyHighlight('#fed7aa'); }}");

fs.writeFileSync('src/components/NoteSectionEditor.tsx', code);
