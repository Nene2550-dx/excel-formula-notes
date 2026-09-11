const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Add Settings State
const stateMarker = "const [isEditingProfile, setIsEditingProfile] = useState(false);";
const settingsState = `\n  const [isSettingsOpen, setIsSettingsOpen] = useState(false);\n  const [apiKey, setApiKey] = useState(storageService.getApiKey());`;
code = code.replace(stateMarker, stateMarker + settingsState);

// Update NavItem click handler to catch 'settings'
const navItemRegex = /onClick=\{\(\) => onNavigate\(item\.id as ViewMode\)\}/g;
code = code.replace(navItemRegex, `onClick={() => item.id === 'settings' ? setIsSettingsOpen(true) : onNavigate(item.id as ViewMode)}`);

// Need to update the mobile bottom nav as well if it uses onNavigate directly without checking
const mobileNavRegex = /onClick=\{\(\) => item\.id === 'search' \? onOpenSearch\(\) : onNavigate\(item\.id as ViewMode\)\}/g;
code = code.replace(mobileNavRegex, `onClick={() => item.id === 'search' ? onOpenSearch() : item.id === 'settings' ? setIsSettingsOpen(true) : onNavigate(item.id as ViewMode)}`);


// Add Settings Modal JSX at the end of the file, right before the last closing tag
const modalJSX = `
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl relative animate-in zoom-in-95">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-[var(--color-ink)]"><X size={20}/></button>
            <h3 className="font-serif font-bold text-xl text-[var(--color-ink)] mb-2">Settings</h3>
            <p className="text-sm text-stone-500 mb-6">Connect to the real Gemini AI.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 bg-stone-50 border border-[var(--color-powder)] rounded-xl font-mono text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)]"
                  placeholder="AIzaSy..."
                />
                <p className="text-[10px] text-stone-400 mt-2">Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-[var(--color-sage)] underline">Google AI Studio</a>. Your key is stored locally in your browser and never sent to our servers.</p>
              </div>
            </div>

            <button 
              onClick={() => {
                storageService.saveApiKey(apiKey);
                setIsSettingsOpen(false);
              }} 
              className="w-full mt-6 py-3 bg-[var(--color-ink)] text-white font-bold rounded-xl shadow-sm hover:bg-stone-800 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
`;

const lastClosingTag = "    </>\n  );\n};";
code = code.replace(lastClosingTag, modalJSX + lastClosingTag);

fs.writeFileSync('src/components/Sidebar.tsx', code);
