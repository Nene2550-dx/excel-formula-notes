const fs = require('fs');

// 1. Update storage.ts to dispatch an event
let storageCode = fs.readFileSync('src/services/storage.ts', 'utf8');
storageCode = storageCode.replace("localStorage.setItem('excel_notes_profile', JSON.stringify(profile));", "localStorage.setItem('excel_notes_profile', JSON.stringify(profile));\n    window.dispatchEvent(new Event('profileUpdated'));");
fs.writeFileSync('src/services/storage.ts', storageCode);

// 2. Update Dashboard.tsx to listen for the event
let dashboardCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const effectRegex = /useEffect\(\(\) => \{\n\s*setProfile\(storageService\.getProfile\(\)\);\n\s*\}, \[\]\);/;
const newEffect = `useEffect(() => {
    setProfile(storageService.getProfile());
    const handleProfileUpdate = () => setProfile(storageService.getProfile());
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);`;
dashboardCode = dashboardCode.replace(effectRegex, newEffect);
fs.writeFileSync('src/components/Dashboard.tsx', dashboardCode);

