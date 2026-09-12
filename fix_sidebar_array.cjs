const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Insert Wrench icon import
code = code.replace("FileEdit, Calculator, Camera, X", "FileEdit, Calculator, Camera, X, Wrench");

// Add Tools to navItems array
const searchStr = "{ id: 'study', label: 'Study', icon: BookOpen, hideOnDesktop: true },";
const replacement = searchStr + "\n    { id: 'tools', label: 'Excel Tools', icon: Wrench },";
code = code.replace(searchStr, replacement);

fs.writeFileSync('src/components/Sidebar.tsx', code);
