const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// The menu items are inside a <nav className="flex-1 px-4 space-y-1 mb-8">
const targetRegex = /<button[\s\S]*?onClick=\{\(\) => onNavigate\('favorites'\)\}/;
const menuCode = `
          <button onClick={() => onNavigate('tools')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all \${currentView === 'tools' ? 'bg-[var(--color-ink)] text-white shadow-md' : 'text-stone-500 hover:bg-stone-100/80'}\`}>
            <div className={\`flex items-center justify-center w-8 h-8 rounded-xl \${currentView === 'tools' ? 'bg-white/20' : 'bg-stone-200/50'}\`}>🛠</div>
            <span className="font-bold text-sm tracking-wide">Excel Tools</span>
          </button>
`;
code = code.replace(targetRegex, menuCode + "\n$&");
fs.writeFileSync('src/components/Sidebar.tsx', code);
