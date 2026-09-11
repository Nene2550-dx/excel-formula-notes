export type FormulaStatus = 'valid' | 'warning' | 'error';

export interface ValidationResult {
  isValid: boolean;
  status: FormulaStatus;
  message?: string;
  suggestion?: string;
  fixedFormula?: string;
}

const COMMON_FUNCTIONS = [
  'SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'COUNTA', 'COUNTBLANK',
  'IF', 'IFS', 'AND', 'OR', 'NOT', 'IFERROR', 'IFNA',
  'VLOOKUP', 'HLOOKUP', 'XLOOKUP', 'MATCH', 'INDEX', 'CHOOSE',
  'CONCATENATE', 'CONCAT', 'TEXTJOIN', 'LEFT', 'RIGHT', 'MID', 'LEN', 'FIND', 'SEARCH', 'SUBSTITUTE', 'TRIM',
  'TODAY', 'NOW', 'DATE', 'DATEDIF', 'YEAR', 'MONTH', 'DAY', 'EOMONTH',
  'SUMIF', 'SUMIFS', 'COUNTIF', 'COUNTIFS', 'AVERAGEIF', 'AVERAGEIFS'
];

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

export function validateFormula(formulaStr: string): ValidationResult {
  const f = formulaStr.trim();
  
  if (!f) {
    return { isValid: false, status: 'error', message: 'Formula cannot be empty.' };
  }
  
  if (!f.startsWith('=')) {
    return { 
      isValid: false, 
      status: 'warning', 
      message: 'Most formulas start with "="', 
      suggestion: 'Did you mean to start with "="?',
      fixedFormula: '=' + f
    };
  }

  // Check for common error strings
  const errorStrings = ['#DIV/0!', '#VALUE!', '#REF!', '#NAME?', '#N/A', '#NUM!', '#NULL!'];
  for (const err of errorStrings) {
    if (f.includes(err)) {
      return {
        isValid: false,
        status: 'error',
        message: `Formula contains an error literal: ${err}`,
        suggestion: 'Ensure calculations do not result in this error before saving, or use IFERROR.'
      };
    }
  }

  // Check balanced parentheses
  let openP = 0;
  for (let i = 0; i < f.length; i++) {
    if (f[i] === '(') openP++;
    if (f[i] === ')') openP--;
    if (openP < 0) {
      return {
        isValid: false,
        status: 'error',
        message: 'Too many closing parentheses.'
      };
    }
  }
  
  if (openP > 0) {
    return {
      isValid: false,
      status: 'error',
      message: 'Missing closing parenthesis ")"',
      suggestion: 'Add closing parenthesis at the end.',
      fixedFormula: f + ')'.repeat(openP)
    };
  }

  // Extract function names and check spelling
  // Regex matches words followed by open parenthesis e.g., SUM(
  const funcRegex = /([A-Z]+)\(/gi;
  let match;
  while ((match = funcRegex.exec(f)) !== null) {
    const funcName = match[1].toUpperCase();
    if (!COMMON_FUNCTIONS.includes(funcName)) {
      // It might be a misspelling or just an obscure function
      // Find closest match
      let closest = '';
      let minDistance = 999;
      for (const known of COMMON_FUNCTIONS) {
        const dist = levenshteinDistance(funcName, known);
        if (dist < minDistance && dist <= 2) { // Only suggest if it's a typo (distance <= 2)
          minDistance = dist;
          closest = known;
        }
      }

      if (closest) {
        return {
          isValid: false,
          status: 'error', // Treating spelling mistakes as error to prompt fix
          message: `Unknown function "${funcName}"`,
          suggestion: `Did you mean ${closest}?`,
          fixedFormula: f.replace(new RegExp(funcName + '\\(', 'i'), closest + '(')
        };
      } else {
        return {
          isValid: true,
          status: 'warning',
          message: `Unknown function "${funcName}". It might be valid, but check spelling.`
        };
      }
    }
  }

  return { isValid: true, status: 'valid' };
}
