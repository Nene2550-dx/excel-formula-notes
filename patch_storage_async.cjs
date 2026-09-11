const fs = require('fs');

const storageCode = `
import { get, set, del } from 'idb-keyval';
import type { Unit, Formula, UserProfile } from '../types';
import { COURSE_UNITS, COURSE_FORMULAS } from '../data/mockData';

const UNITS_KEY = 'excel_notes_units_v2';
const FORMULAS_KEY = 'excel_notes_formulas_v2';
const TOOLS_KEY = 'excel_notes_tools_v2';

export const storageService = {
  getApiKey: (): string => {
    return localStorage.getItem('excel_notes_gemini_key') || '';
  },
  saveApiKey: (key: string) => {
    localStorage.setItem('excel_notes_gemini_key', key);
  },
  getProfile: (): UserProfile => {
    const data = localStorage.getItem('excel_notes_profile');
    return data ? JSON.parse(data) : { name: 'Ailada', bio: 'study mode on ✦' };
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem('excel_notes_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));
  },

  async getUnits(): Promise<Unit[]> {
    try {
      const stored = await get<Unit[]>(UNITS_KEY);
      if (stored) return stored;
      
      // Fallback to old localStorage
      const oldStorage = localStorage.getItem('excel_notes_units');
      if (oldStorage) {
         const parsed = JSON.parse(oldStorage);
         await this.saveUnits(parsed);
         return parsed;
      }
    } catch (e) {
      console.error('Failed to load units from IDB', e);
    }
    await this.saveUnits(COURSE_UNITS);
    return COURSE_UNITS;
  },

  async saveUnits(units: Unit[]): Promise<void> {
    await set(UNITS_KEY, units);
  },

  async getFormulas(): Promise<Formula[]> {
    try {
      const stored = await get<Formula[]>(FORMULAS_KEY);
      if (stored) return stored;
      
      // Fallback
      const oldStorage = localStorage.getItem('excel_notes_formulas');
      if (oldStorage) {
         const parsed = JSON.parse(oldStorage);
         await this.saveFormulas(parsed);
         return parsed;
      }
    } catch (e) {
      console.error('Failed to load formulas from IDB', e);
    }
    await this.saveFormulas(COURSE_FORMULAS);
    return COURSE_FORMULAS;
  },

  async saveFormulas(formulas: Formula[]): Promise<void> {
    await set(FORMULAS_KEY, formulas);
  },

  // Tools will use Formula interface for now but different store, or a new interface
  async getTools(): Promise<any[]> {
    try {
      const stored = await get<any[]>(TOOLS_KEY);
      if (stored) return stored;
    } catch(e) {}
    return [];
  },

  async saveTools(tools: any[]): Promise<void> {
    await set(TOOLS_KEY, tools);
  },

  async exportData(): Promise<string> {
    const units = await this.getUnits();
    const formulas = await this.getFormulas();
    const tools = await this.getTools();
    const data = {
      app: 'Excel Formula Notes',
      version: '4.0.0',
      exportedAt: new Date().toISOString(),
      units,
      formulas,
      tools
    };
    return JSON.stringify(data, null, 2);
  },

  async importData(jsonString: string): Promise<{ success: boolean; message: string; }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.units) await this.saveUnits(parsed.units);
      if (parsed.formulas) await this.saveFormulas(parsed.formulas);
      if (parsed.tools) await this.saveTools(parsed.tools);
      return { success: true, message: 'Import successful' };
    } catch (e) {
      return { success: false, message: 'Import failed: ' + String(e) };
    }
  }
};
`;
fs.writeFileSync('src/services/storage.ts', storageCode);
