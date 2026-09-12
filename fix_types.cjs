const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

const oldLine = '  updatedAt: string;\n}';
const newLine = `  updatedAt: string;
  // Excel Tool Advanced Fields
  toolSteps?: ToolStep[];
  tips?: string;
  warnings?: string;
  keyboardShortcut?: string;
  toolExampleResult?: string;
}`;

code = code.replace(oldLine, newLine);
fs.writeFileSync('src/types/index.ts', code);
