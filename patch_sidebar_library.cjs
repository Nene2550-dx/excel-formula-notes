const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Change tools to library
code = code.replace("id: 'tools', label: 'Excel Tools', icon: Wrench", "id: 'library', label: 'Formula Library', icon: Calculator");
code = code.replace("currentView === 'tools'", "currentView === 'library'");
code = code.replace("onNavigate('tools')", "onNavigate('library')");

fs.writeFileSync('src/components/Sidebar.tsx', code);
