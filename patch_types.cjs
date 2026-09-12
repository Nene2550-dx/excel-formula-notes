const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

const newTypes = `
export interface ToolStep {
  id: string;
  type: 'description' | 'cell_input' | 'command' | 'shortcut' | 'formula' | 'result' | 'image';
  cell?: string;
  content: string;
  detail?: string;
  imageUrl?: string;
  caption?: string;
}

export interface Formula {
`;

if (!code.includes("export interface ToolStep")) {
  code = code.replace("export interface Formula {", newTypes);
}

// Add the fields to Formula
const newFormulaFields = `
  category?: string;
  type?: 'formula' | 'tool';
  stepsText?: string;
  
  // Excel Tool Advanced Fields
  toolSteps?: ToolStep[];
  tips?: string;
  warnings?: string;
  keyboardShortcut?: string;
  toolExampleResult?: string;
`;

code = code.replace(/  category\?: string;\n  type\?: 'formula' \| 'tool';\n  stepsText\?: string;/m, newFormulaFields);
fs.writeFileSync('src/types/index.ts', code);
