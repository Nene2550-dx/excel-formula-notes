import React, { useState, useEffect } from 'react';
import type { ViewMode, UserProfile } from '../types';
import { storageService } from '../services/storage';
import { 
  FolderOpen, Star, Search, PlusCircle, Settings, Home, Sparkles, BookOpen, PenTool, LayoutTemplate, Palette, Menu, FileEdit, Calculator, Camera, X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenSearch: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onOpenSearch, isCollapsed, onToggleCollapse }) => {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(storageService.getApiKey());
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


  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'units', label: 'My Units', icon: FolderOpen, hideOnDesktop: true },
    { id: 'study', label: 'Study', icon: BookOpen, hideOnDesktop: true },
    { id: 'formula_library', label: 'Formula Library', icon: Calculator, hideOnDesktop: true },
    { id: 'quick_notes', label: 'Quick Notes', icon: FileEdit, hideOnDesktop: true },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'drafts', label: 'Drafts', icon: PenTool },
    { id: 'exam', label: 'Exam Mode', icon: LayoutTemplate },
    { id: 'ai_buddy', label: 'AI Study Buddy', icon: Sparkles, hideOnDesktop: true },
  ];

  const bottomItems = [
    { id: 'customize', label: 'Customize', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <button
      onClick={() => item.id === 'settings' ? setIsSettingsOpen(true) : onNavigate(item.id as ViewMode)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        currentView === item.id 
          ? 'bg-[var(--color-sage)]/20 text-[var(--color-ink)] font-bold shadow-sm' 
          : 'text-stone-500 hover:bg-stone-100 hover:text-[var(--color-ink)]'
      }`}
    >
      <item.icon size={18} className={currentView === item.id ? 'text-[var(--color-sage)]' : ''} />
      {!isCollapsed && <span className="text-sm">{item.label}</span>}
    </button>
  );

  return (
    <>
      <div className={`relative flex flex-col h-screen bg-[#faf9f6] border-r border-[var(--color-powder)] transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex`}>
        
        <button 
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 bg-white border border-[var(--color-powder)] text-stone-400 hover:text-[var(--color-ink)] rounded-full p-1 shadow-sm z-50"
        >
          <Menu size={14} />
        </button>

        {/* Profile Card */}
        <div className={`p-5 border-b border-[var(--color-powder)]/50 transition-all ${isCollapsed ? 'items-center flex justify-center' : ''}`}>
          {!isCollapsed ? (
            <div 
              className="bg-white border border-[var(--color-powder)] rounded-2xl p-4 shadow-sm cursor-pointer hover:border-[var(--color-dusty)] transition-colors relative group"
              onClick={() => setIsEditingProfile(true)}
            >
              <div className="absolute -top-2 -right-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm">✿</div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-[var(--color-sage)] to-[var(--color-powder)] rounded-full flex items-center justify-center text-white font-serif text-xl font-bold shadow-inner overflow-hidden relative border-2 border-white">
                  {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[var(--color-ink)] text-lg leading-tight">{profile.name}</h3>
                  <p className="text-xs text-stone-500 font-medium">{profile.bio}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-tr from-[var(--color-sage)] to-[var(--color-powder)] rounded-full flex items-center justify-center text-white font-serif font-bold cursor-pointer border-2 border-white shadow-sm" onClick={() => setIsEditingProfile(true)}>
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full"/> : profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.filter(i => !i.hideOnDesktop).map((item) => <NavItem key={item.id} item={item} />)}
        </div>

        <div className="p-4 border-t border-[var(--color-powder)]/50 space-y-1">
          {bottomItems.map((item) => <NavItem key={item.id} item={item} />)}
        </div>
      </div>

      {/* Mobile Bottom Navigation (Hidden for now, just placeholder) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-powder)] flex justify-around p-3 z-50 safe-area-bottom">
        {[navItems[0], navItems[1], { id: 'search', icon: Search, label: 'Search' }, navItems[7]].map((item) => (
          <button 
            key={item.id} 
            onClick={() => item.id === 'search' ? onOpenSearch() : item.id === 'settings' ? setIsSettingsOpen(true) : onNavigate(item.id as ViewMode)}
            className={`flex flex-col items-center gap-1 p-2 ${currentView === item.id ? 'text-[var(--color-sage)]' : 'text-stone-400'}`}
          >
            <item.icon size={20} className={currentView === item.id ? 'fill-[var(--color-sage)]/20' : ''}/>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl relative animate-in zoom-in-95">
            <button onClick={() => setIsEditingProfile(false)} className="absolute top-4 right-4 text-stone-400 hover:text-[var(--color-ink)]"><X size={20}/></button>
            <h3 className="font-serif font-bold text-xl text-[var(--color-ink)] mb-6 text-center">Edit Profile</h3>
            
            <div className="flex justify-center mb-6">
               <label className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center relative border-2 border-dashed border-stone-300 hover:bg-stone-50 cursor-pointer group overflow-hidden">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : <Camera className="text-stone-400 group-hover:text-[var(--color-dusty)]" />}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
               </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-2 bg-stone-50 border border-[var(--color-powder)] rounded-xl font-bold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Bio</label>
                <input 
                  type="text" 
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-4 py-2 bg-stone-50 border border-[var(--color-powder)] rounded-xl font-medium text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)]"
                  placeholder="e.g. learning Excel ♡"
                />
              </div>
            </div>

            <button onClick={() => setIsEditingProfile(false)} className="w-full mt-6 py-3 bg-[var(--color-ink)] text-white font-bold rounded-xl shadow-sm hover:bg-stone-800 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

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
    </>
  );
};
