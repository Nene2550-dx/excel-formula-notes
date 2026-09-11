const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import { SettingsView } from './components/SettingsView';", "import { SettingsView } from './components/SettingsView';\nimport { ExcelToolsView } from './components/ExcelToolsView';");

const viewRegex = /\{currentView === 'settings' && <SettingsView \/>\}/;
code = code.replace(viewRegex, "{currentView === 'settings' && <SettingsView />}\n        {currentView === 'tools' && <ExcelToolsView />}");

fs.writeFileSync('src/App.tsx', code);
