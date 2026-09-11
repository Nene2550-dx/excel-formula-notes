const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('UserProfile')) {
  code += `
export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl?: string;
}
`;
}
fs.writeFileSync('src/types/index.ts', code);

let storageCode = fs.readFileSync('src/services/storage.ts', 'utf8');
if (!storageCode.includes('getProfile')) {
  storageCode = storageCode.replace('export const storageService = {', `export const storageService = {
  getProfile: (): UserProfile => {
    const data = localStorage.getItem('excel_notes_profile');
    return data ? JSON.parse(data) : { name: 'Ailada', bio: 'study mode on ✦' };
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem('excel_notes_profile', JSON.stringify(profile));
  },`);
  // Need to import UserProfile in storage.ts
  storageCode = storageCode.replace("import type { Unit, Formula } from '../types';", "import type { Unit, Formula, UserProfile } from '../types';");
  fs.writeFileSync('src/services/storage.ts', storageCode);
}
