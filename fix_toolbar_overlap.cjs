const fs = require('fs');
let code = fs.readFileSync('src/components/RichNoteEditor.tsx', 'utf8');
code = code.replace("sticky top-20 z-10", "sticky top-0 z-10");
// Remove the sticky header that was at top-0 so they don't fight, or change z-index
code = code.replace("sticky top-0 bg-white/80", "relative bg-white/80");
fs.writeFileSync('src/components/RichNoteEditor.tsx', code);
