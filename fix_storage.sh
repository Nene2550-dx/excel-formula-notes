sed -i '' '704,$d' src/services/storage.ts
cat << 'INNER_EOF' >> src/services/storage.ts
export const storageService = {
  getUnits(): Unit[] {
    try {
      const stored = localStorage.getItem(UNITS_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        parsed = parsed.map((u: any) => {
          if (!u.noteSections) {
            u.noteSections = u.studyContent ? [{ id: "sec-" + Date.now() + Math.random(), order: 0, title: "Study Content", content: u.studyContent, layout: "text" }] : [];
          }
          if (!u.miniNotes) u.miniNotes = [];
          return u;
        });
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load units from localStorage', e);
    }
    this.saveUnits(COURSE_UNITS);
    localStorage.setItem(INITIAL_DATA_FLAG, 'true');
    return COURSE_UNITS;
  },

  saveUnits(units: Unit[]): void {
    try {
      localStorage.setItem(UNITS_KEY, JSON.stringify(units));
    } catch (e) {
      console.error('Failed to save units', e);
    }
  },

  getFormulas(): Formula[] {
    try {
      const stored = localStorage.getItem(FORMULAS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load formulas from localStorage', e);
    }
    this.saveFormulas(COURSE_FORMULAS);
    return COURSE_FORMULAS;
  },

  saveFormulas(formulas: Formula[]): void {
    try {
      localStorage.setItem(FORMULAS_KEY, JSON.stringify(formulas));
    } catch (e) {
      console.error('Failed to save formulas', e);
    }
  },

  async saveImage(key: string, dataUrl: string): Promise<void> {
    try {
      await set(\`img_\${key}\`, dataUrl);
    } catch (e) {
      console.warn('IndexedDB save failed', e);
    }
  },

  async getImage(key: string): Promise<string | undefined> {
    try {
      return await get(\`img_\${key}\`);
    } catch (e) {
      console.warn('IndexedDB get failed', e);
      return undefined;
    }
  },

  async deleteImage(key: string): Promise<void> {
    try {
      await del(\`img_\${key}\`);
    } catch (e) {
      console.warn('IndexedDB del failed', e);
    }
  },

  exportData(): string {
    const units = this.getUnits();
    const formulas = this.getFormulas();
    const data = {
      app: 'Excel Formula Notes',
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      units,
      formulas,
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): { success: boolean; message: string; unitsCount?: number; formulasCount?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.units || !Array.isArray(parsed.units)) {
        return { success: false, message: 'Invalid format' };
      }
      if (!parsed.formulas || !Array.isArray(parsed.formulas)) {
        return { success: false, message: 'Invalid format' };
      }

      this.saveUnits(parsed.units);
      this.saveFormulas(parsed.formulas);

      return {
        success: true,
        message: 'Import successful',
        unitsCount: parsed.units.length,
        formulasCount: parsed.formulas.length,
      };
    } catch (e) {
      return { success: false, message: 'Import failed: ' + String(e) };
    }
  },

  resetToDefaults(): { units: Unit[]; formulas: Formula[] } {
    this.saveUnits(COURSE_UNITS);
    this.saveFormulas(COURSE_FORMULAS);
    return {
      units: COURSE_UNITS,
      formulas: COURSE_FORMULAS,
    };
  }
};
INNER_EOF
sh fix_storage.sh
