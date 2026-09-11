const fs = require('fs');
let code = fs.readFileSync('src/components/NoteSectionEditor.tsx', 'utf8');

// The NoteSectionEditor currently has `isEditing` toggle, but we want a more robust one.
// Let's replace the whole file because a real rich-text block editor needs a bit of logic.

const newCode = `import React, { useState, useRef, useEffect } from 'react';
import type { Unit, NoteSection } from '../types';
import { Edit3, Check, Highlighter, Trash2, GripVertical, Plus } from 'lucide-react';

interface NoteSectionEditorProps {
  unit: Unit;
  onSave: (unit: Unit) => void;
}

export const NoteSectionEditor: React.FC<NoteSectionEditorProps> = ({ unit, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState<NoteSection[]>(unit.noteSections || []);
  const [showHighlightMenu, setShowHighlightMenu] = useState<{x: number, y: number} | null>(null);

  // Sync when unit changes
  useEffect(() => {
    setSections(unit.noteSections || []);
  }, [unit]);

  const handleSave = () => {
    onSave({ ...unit, noteSections: sections, updatedAt: new Date().toISOString() });
    setIsEditing(false);
  };

  const updateSectionContent = (id: string, newContent: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const addSection = () => {
    const newSec: NoteSection = {
      id: 'sec-' + Date.now(),
      order: sections.length,
      title: 'New Section',
      content: '<p>เริ่มเขียนที่นี่...</p>',
      layout: 'text'
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  // Selection Highlight Logic
  const handleMouseUp = () => {
    if (!isEditing) return;
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setShowHighlightMenu({ x: rect.left + (rect.width / 2), y: rect.top - 40 });
    } else {
      setShowHighlightMenu(null);
    }
  };

  const applyHighlight = (color: string) => {
    document.execCommand('backColor', false, color);
    setShowHighlightMenu(null);
  };

  const removeHighlight = () => {
    document.execCommand('backColor', false, 'transparent');
    setShowHighlightMenu(null);
  };

  return (
    <div className="relative h-full flex flex-col" onMouseUp={handleMouseUp}>
      
      {/* Toolbar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[var(--color-powder)] p-4 flex items-center justify-between z-20">
        <h3 className="font-serif font-bold text-[var(--color-ink)] text-lg">Study Notes</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => { setIsEditing(false); setSections(unit.noteSections || []); }} className="px-4 py-2 text-stone-500 font-bold text-xs hover:bg-stone-100 rounded-full transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[var(--color-ink)] text-white font-bold text-xs rounded-full shadow-sm hover:bg-stone-800 transition-colors flex items-center gap-1"><Check size={14} /> Save Changes</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] font-bold text-xs rounded-full shadow-sm hover:bg-stone-50 transition-colors flex items-center gap-1"><Edit3 size={14} /> Edit Notes</button>
        )}
      </div>

      {/* Editor Canvas */}
      <div className="p-8 flex-1">
        {sections.length === 0 && !isEditing && (
          <div className="text-center py-20 text-stone-400 font-medium">ไม่มีบันทึกการเรียนใน Unit นี้</div>
        )}

        <div className="space-y-8 max-w-3xl mx-auto">
          {sections.map((section) => (
            <div key={section.id} className={\`group relative \${isEditing ? 'p-4 rounded-xl border border-stone-200 hover:border-[var(--color-dusty)] bg-white' : ''}\`}>
              
              {isEditing && (
                <div className="absolute -left-10 top-4 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                  <button className="p-1 text-stone-400 cursor-grab hover:text-[var(--color-ink)]"><GripVertical size={16} /></button>
                  <button onClick={() => removeSection(section.id)} className="p-1 text-stone-400 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              )}

              {isEditing ? (
                <input 
                  value={section.title} 
                  onChange={e => setSections(sections.map(s => s.id === section.id ? {...s, title: e.target.value} : s))}
                  className="w-full text-2xl font-serif font-bold text-[var(--color-ink)] mb-4 focus:outline-none bg-transparent"
                  placeholder="Section Title"
                />
              ) : (
                <h4 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-4">{section.title}</h4>
              )}

              <div 
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => updateSectionContent(section.id, e.currentTarget.innerHTML)}
                className={\`prose prose-sm max-w-none focus:outline-none \${isEditing ? 'min-h-[100px]' : ''}\`}
                style={{ 
                   color: 'var(--color-ink)',
                   lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}

          {isEditing && (
            <button onClick={addSection} className="w-full py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-bold hover:border-[var(--color-dusty)] hover:text-[var(--color-dusty)] transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> Add New Block
            </button>
          )}
        </div>
      </div>

      {/* Floating Highlight Toolbar */}
      {showHighlightMenu && isEditing && (
        <div 
          className="fixed z-50 bg-white shadow-xl border border-stone-200 rounded-full px-2 py-1.5 flex gap-1 animate-in zoom-in-95"
          style={{ top: showHighlightMenu.y, left: showHighlightMenu.x, transform: 'translateX(-50%)' }}
        >
           <button onClick={() => applyHighlight('#fef08a')} className="w-6 h-6 rounded-full bg-yellow-200 hover:scale-110 transition-transform shadow-sm" title="Yellow"></button>
           <button onClick={() => applyHighlight('#fbcfe8')} className="w-6 h-6 rounded-full bg-pink-200 hover:scale-110 transition-transform shadow-sm" title="Pink"></button>
           <button onClick={() => applyHighlight('#bbf7d0')} className="w-6 h-6 rounded-full bg-green-200 hover:scale-110 transition-transform shadow-sm" title="Sage"></button>
           <button onClick={() => applyHighlight('#e9d5ff')} className="w-6 h-6 rounded-full bg-purple-200 hover:scale-110 transition-transform shadow-sm" title="Lavender"></button>
           <button onClick={() => applyHighlight('#fed7aa')} className="w-6 h-6 rounded-full bg-orange-200 hover:scale-110 transition-transform shadow-sm" title="Peach"></button>
           <div className="w-[1px] h-4 bg-stone-200 my-auto mx-1"></div>
           <button onClick={removeHighlight} className="p-1 text-stone-400 hover:text-rose-500 rounded-full hover:bg-rose-50" title="Remove Highlight"><Highlighter size={14}/></button>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('src/components/NoteSectionEditor.tsx', newCode);
