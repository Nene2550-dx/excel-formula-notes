const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!code.includes('const profile')) {
  // Add UserProfile to imports if not there
  code = code.replace("import type { Unit, Formula } from '../types';", "import type { Unit, Formula, UserProfile } from '../types';");
  code = code.replace("import { storageService } from '../services/storage';", "import { storageService } from '../services/storage';"); // Make sure it exists
  
  const setupStr = "const getFormulaCountForUnit";
  code = code.replace(setupStr, `const [profile, setProfile] = useState<UserProfile>({ name: '', bio: '' });
  
  useEffect(() => {
    setProfile(storageService.getProfile());
  }, []);
  
  const getFormulaCountForUnit`);
  
  const headerStr = '<div className="flex items-center justify-between mb-8">';
  code = code.replace(headerStr, `<div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-2">Hello, {profile.name || 'Student'} <span className="text-[var(--color-dusty)]">✦</span></h1>
        <p className="text-stone-500 font-medium">Ready to study Excel?</p>
      </div>
      <div className="flex items-center justify-between mb-8">`);
}
fs.writeFileSync('src/components/Dashboard.tsx', code);
