const fs = require('fs');
let code = fs.readFileSync('src/components/RichNoteEditor.tsx', 'utf8');

// Remove BubbleMenu import
code = code.replace("import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';", "import { useEditor, EditorContent } from '@tiptap/react';");

// Replace BubbleMenu with a static div toolbar
const bubbleRegex = /<BubbleMenu editor=\{editor\}[\s\S]*?<\/BubbleMenu>/;
const staticToolbar = `
          <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200 p-2 flex items-center gap-2 sticky top-20 z-10 rounded-xl mb-4">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={\`p-1.5 rounded-lg \${editor.isActive('bold') ? 'bg-stone-200 text-[var(--color-ink)]' : 'text-stone-400 hover:bg-stone-100'}\`}><Bold size={16}/></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={\`p-1.5 rounded-lg \${editor.isActive('italic') ? 'bg-stone-200 text-[var(--color-ink)]' : 'text-stone-400 hover:bg-stone-100'}\`}><Italic size={16}/></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={\`p-1.5 rounded-lg \${editor.isActive('underline') ? 'bg-stone-200 text-[var(--color-ink)]' : 'text-stone-400 hover:bg-stone-100'}\`}><UnderlineIcon size={16}/></button>
            <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>
            <button onClick={() => applyHighlight('#fef08a')} className="w-5 h-5 rounded-full bg-yellow-200 shadow-sm hover:scale-110 transition-transform"></button>
            <button onClick={() => applyHighlight('#fbcfe8')} className="w-5 h-5 rounded-full bg-pink-200 shadow-sm hover:scale-110 transition-transform"></button>
            <button onClick={() => applyHighlight('#bbf7d0')} className="w-5 h-5 rounded-full bg-green-200 shadow-sm hover:scale-110 transition-transform"></button>
            <button onClick={() => applyHighlight('#e9d5ff')} className="w-5 h-5 rounded-full bg-purple-200 shadow-sm hover:scale-110 transition-transform"></button>
            <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>
            <button onClick={() => editor.chain().focus().toggleTaskList().run()} className="p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg hover:text-[var(--color-ink)]"><CheckSquare size={16}/></button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg hover:text-[var(--color-ink)]"><List size={16}/></button>
            <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg hover:text-[var(--color-ink)]"><TableIcon size={16}/></button>
          </div>
`;
code = code.replace(bubbleRegex, staticToolbar);

fs.writeFileSync('src/components/RichNoteEditor.tsx', code);
