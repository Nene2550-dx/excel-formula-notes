const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf8');

if (!code.includes('getApiKey')) {
  code = code.replace("export const storageService = {", `export const storageService = {
  getApiKey: (): string => {
    return localStorage.getItem('excel_notes_gemini_key') || '';
  },
  saveApiKey: (key: string) => {
    localStorage.setItem('excel_notes_gemini_key', key);
  },`);
  fs.writeFileSync('src/services/storage.ts', code);
}
