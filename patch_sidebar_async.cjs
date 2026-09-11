const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Fix export
code = code.replace("const data = storageService.exportData();", "const data = await storageService.exportData();");
code = code.replace("onClick={() => {", "onClick={async () => {");

// Fix import
code = code.replace("const result = storageService.importData(evt.target?.result as string);", "const result = await storageService.importData(evt.target?.result as string);");
code = code.replace("reader.onload = (evt) => {", "reader.onload = async (evt) => {");

fs.writeFileSync('src/components/Sidebar.tsx', code);
