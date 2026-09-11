const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf8');
code = code.replace("import { COURSE_UNITS, COURSE_FORMULAS } from '../data/mockData';", "const COURSE_UNITS: any[] = []; const COURSE_FORMULAS: any[] = [];");
fs.writeFileSync('src/services/storage.ts', code);
