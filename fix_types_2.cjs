const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

// Replace inside Formula interface specifically
code = code.replace(/isDraft: boolean;\n  createdAt: string;\n  updatedAt: string;\n\}/, `isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  toolSteps?: ToolStep[];
  tips?: string;
  warnings?: string;
  keyboardShortcut?: string;
  toolExampleResult?: string;
}`);

fs.writeFileSync('src/types/index.ts', code);
