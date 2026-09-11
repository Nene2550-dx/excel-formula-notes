const fs = require('fs');
let code = fs.readFileSync('src/components/RichNoteEditor.tsx', 'utf8');

code = code.replace("import Table from '@tiptap/extension-table';", "import { Table } from '@tiptap/extension-table';");
code = code.replace("import TableRow from '@tiptap/extension-table-row';", "import { TableRow } from '@tiptap/extension-table-row';");
code = code.replace("import TableCell from '@tiptap/extension-table-cell';", "import { TableCell } from '@tiptap/extension-table-cell';");
code = code.replace("import TableHeader from '@tiptap/extension-table-header';", "import { TableHeader } from '@tiptap/extension-table-header';");
code = code.replace("import TaskList from '@tiptap/extension-task-list';", "import { TaskList } from '@tiptap/extension-task-list';");
code = code.replace("import TaskItem from '@tiptap/extension-task-item';", "import { TaskItem } from '@tiptap/extension-task-item';");
code = code.replace("import Image from '@tiptap/extension-image';", "import { Image } from '@tiptap/extension-image';");
code = code.replace("import Highlight from '@tiptap/extension-highlight';", "import { Highlight } from '@tiptap/extension-highlight';");
code = code.replace("import Underline from '@tiptap/extension-underline';", "import { Underline } from '@tiptap/extension-underline';");

fs.writeFileSync('src/components/RichNoteEditor.tsx', code);
