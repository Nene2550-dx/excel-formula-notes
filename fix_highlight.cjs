const fs = require('fs');
let code = fs.readFileSync('src/components/NoteSectionEditor.tsx', 'utf8');

// Replace onClick with onMouseDown and preventDefault
code = code.replace(/onClick=\{\(\) => applyHighlight\(/g, "onMouseDown={(e) => { e.preventDefault(); applyHighlight(");
code = code.replace(/onClick=\{removeHighlight\}/g, "onMouseDown={(e) => { e.preventDefault(); removeHighlight(); }}");

// Add an onTouchEnd handler to the container just in case for iPad
code = code.replace(/onMouseUp=\{handleMouseUp\}/g, "onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp} onKeyUp={handleMouseUp}");

fs.writeFileSync('src/components/NoteSectionEditor.tsx', code);
