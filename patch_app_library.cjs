const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import FormulaLibraryView instead of ExcelToolsView
code = code.replace("import { ExcelToolsView } from './components/ExcelToolsView';", "import { FormulaLibraryView } from './components/FormulaLibraryView';");

// Use FormulaLibraryView for 'library'
code = code.replace("{currentView === 'tools' && <ExcelToolsView />}", "{currentView === 'library' && <FormulaLibraryView />}");

fs.writeFileSync('src/App.tsx', code);
