const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Add handleImageUpload function inside Sidebar component
const functionMarker = "const [isEditingProfile, setIsEditingProfile] = useState(false);";
const uploadFunction = `
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
`;
code = code.replace(functionMarker, functionMarker + uploadFunction);

// Replace the camera icon div in the modal with a functional label+input
const cameraDivStart = `<div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center relative border-2 border-dashed border-stone-300 hover:bg-stone-50 cursor-pointer group">`;
const cameraDivEnd = `</div>`;

const newUploadUI = `<label className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center relative border-2 border-dashed border-stone-300 hover:bg-stone-50 cursor-pointer group overflow-hidden">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : <Camera className="text-stone-400 group-hover:text-[var(--color-dusty)]" />}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
               </label>`;

// It's safer to regex replace this exact block
const regex = /<div className="w-20 h-20 bg-stone-100.*?<\/div>\n\s*<\/div>/s;
code = code.replace(regex, newUploadUI + '\n            </div>');

fs.writeFileSync('src/components/Sidebar.tsx', code);
