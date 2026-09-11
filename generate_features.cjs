const fs = require('fs');

// 1. Update Types
let typesCode = fs.readFileSync('src/types/index.ts', 'utf8');
if (!typesCode.includes('ExcelTool')) {
  const newTypes = `
export interface ExcelTool {
  id: string;
  name: string;
  category: string;
  description: string;
  purpose: string;
  howToUse: string;
  steps: string;
  example: string;
  tips: string;
  commonMistakes: string;
  examNote: string;
  shortcut: string;
  images: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
`;
  typesCode += newTypes;
  // Also add 'tools' to ViewMode
  typesCode = typesCode.replace("'dashboard' | 'favorites' | 'drafts' | 'settings' | 'customize' | 'exam'", "'dashboard' | 'favorites' | 'drafts' | 'settings' | 'customize' | 'exam' | 'tools'");
  fs.writeFileSync('src/types/index.ts', typesCode);
}

// 2. We need to create RichNoteEditor.tsx
// I will create a basic Tiptap editor wrapper that handles the formatting toolbar.
const editorJSX = `
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, CheckSquare, List, Image as ImageIcon, Table as TableIcon } from 'lucide-react';
import type { Unit } from '../types';

interface RichNoteEditorProps {
  unit: Unit;
  onSave: (unit: Unit) => void;
}

export const RichNoteEditor: React.FC<RichNoteEditorProps> = ({ unit, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(unit.noteSections?.[0]?.content || '<p>เริ่มเขียนโน้ตที่นี่...</p>');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Underline
    ],
    content: content,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  const handleSave = () => {
    const updatedSections = [{
       id: unit.noteSections?.[0]?.id || 'sec-' + Date.now(),
       order: 0,
       title: unit.title,
       content: content,
       layout: 'text' as const
    }];
    onSave({ ...unit, noteSections: updatedSections, updatedAt: new Date().toISOString() });
    setIsEditing(false);
  };

  const applyHighlight = (color: string) => {
    editor?.chain().focus().toggleHighlight({ color }).run();
  };

  return (
    <div className="relative h-full flex flex-col bg-white">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[var(--color-powder)] p-4 flex items-center justify-between z-20">
        <h3 className="font-serif font-bold text-[var(--color-ink)] text-lg">Apple Notes Style</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-stone-500 font-bold text-xs hover:bg-stone-100 rounded-full">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[var(--color-ink)] text-white font-bold text-xs rounded-full shadow-sm hover:bg-stone-800">Save Changes</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white border border-[var(--color-powder)] text-stone-500 hover:text-[var(--color-ink)] font-bold text-xs rounded-full shadow-sm hover:bg-stone-50">Edit Note</button>
        )}
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        {editor && isEditing && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white shadow-xl border border-stone-200 rounded-full px-3 py-2 flex items-center gap-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={\`p-1 rounded \${editor.isActive('bold') ? 'bg-stone-100 text-[var(--color-ink)]' : 'text-stone-400'}\`}><Bold size={16}/></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={\`p-1 rounded \${editor.isActive('italic') ? 'bg-stone-100 text-[var(--color-ink)]' : 'text-stone-400'}\`}><Italic size={16}/></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={\`p-1 rounded \${editor.isActive('underline') ? 'bg-stone-100 text-[var(--color-ink)]' : 'text-stone-400'}\`}><UnderlineIcon size={16}/></button>
            <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>
            <button onClick={() => applyHighlight('#fef08a')} className="w-5 h-5 rounded-full bg-yellow-200 shadow-sm"></button>
            <button onClick={() => applyHighlight('#fbcfe8')} className="w-5 h-5 rounded-full bg-pink-200 shadow-sm"></button>
            <button onClick={() => applyHighlight('#bbf7d0')} className="w-5 h-5 rounded-full bg-green-200 shadow-sm"></button>
            <button onClick={() => applyHighlight('#e9d5ff')} className="w-5 h-5 rounded-full bg-purple-200 shadow-sm"></button>
            <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>
            <button onClick={() => editor.chain().focus().toggleTaskList().run()} className="p-1 text-stone-400 hover:text-[var(--color-ink)]"><CheckSquare size={16}/></button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-1 text-stone-400 hover:text-[var(--color-ink)]"><List size={16}/></button>
          </BubbleMenu>
        )}
        
        <div className="prose prose-stone max-w-3xl mx-auto focus:outline-none min-h-[500px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/components/RichNoteEditor.tsx', editorJSX);

// 3. Update UnitDetail.tsx to use RichNoteEditor instead of NoteSectionEditor
let unitDetailCode = fs.readFileSync('src/components/UnitDetail.tsx', 'utf8');
unitDetailCode = unitDetailCode.replace("import { NoteSectionEditor } from './NoteSectionEditor';", "import { RichNoteEditor } from './RichNoteEditor';");
unitDetailCode = unitDetailCode.replace("<NoteSectionEditor unit={unit} onSave={handleSaveContent} />", "<RichNoteEditor unit={unit} onSave={handleSaveContent} />");
fs.writeFileSync('src/components/UnitDetail.tsx', unitDetailCode);

// 4. Update Sidebar to add Excel Tools
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
const excelToolsMenu = `
          <button onClick={() => onNavigate('tools')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all \${currentView === 'tools' ? 'bg-[var(--color-ink)] text-white shadow-md' : 'text-stone-500 hover:bg-stone-100/80'}\`}>
            <div className={\`flex items-center justify-center w-8 h-8 rounded-xl \${currentView === 'tools' ? 'bg-white/20' : 'bg-stone-200/50'}\`}>🛠</div>
            <span className="font-bold text-sm tracking-wide">Excel Tools</span>
          </button>
`;
sidebarCode = sidebarCode.replace("{/* MAIN NAV */}", "{/* MAIN NAV */}" + excelToolsMenu);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);

