const fs = require('fs');
let code = fs.readFileSync('src/components/ExamModeView.tsx', 'utf8');

// Add onDeleteFormula to props
code = code.replace("interface ExamModeViewProps {\n  formulas: Formula[];\n  onBack: () => void;\n}", "interface ExamModeViewProps {\n  formulas: Formula[];\n  onBack: () => void;\n  onDeleteFormula?: (formulaId: string) => void;\n}");
code = code.replace("export const ExamModeView: React.FC<ExamModeViewProps> = ({ formulas, onBack }) => {", "export const ExamModeView: React.FC<ExamModeViewProps> = ({ formulas, onBack, onDeleteFormula }) => {");

// Add Trash icon import if not present
if (!code.includes("Trash2")) {
  code = code.replace("Search, Filter, BookOpen", "Search, Filter, BookOpen, Trash2");
}

// Find the place where the formula name is rendered and add a delete button next to it
// Let's first check how it renders.
fs.writeFileSync('src/components/ExamModeView.tsx', code);
