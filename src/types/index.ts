export type ImportanceLevel = 'normal' | 'important' | 'exam';
export type MiniNoteType = 'tip' | 'note' | 'exam' | 'important' | 'remember';
export type NoteSectionLayout = 'text' | 'quote' | 'keypoint' | 'warning';

export interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  imageData?: string;
}

export interface NoteSection {
  id: string;
  order: number;
  title: string;
  content: string; // Tiptap HTML
  layout: NoteSectionLayout;
}

export interface MiniNote {
  id: string;
  type: MiniNoteType;
  content: string;
  order: number; // For ordering alongside sections
}

export interface Unit {
  id: string;
  unitNumber: string; // e.g. "Unit 01"
  title: string; // e.g. "สูตรพื้นฐาน"
  description: string;
  order: number;
  icon?: string;
  colorTheme?: 'sage' | 'blue' | 'purple' | 'rose' | 'amber' | 'emerald';
  studyContent?: string; // Legacy
  noteSections?: NoteSection[]; // New Editorial Structure
  miniNotes?: MiniNote[]; // Sticky notes
  steps?: Step[]; // Legacy, moving to Formula
  createdAt: string;
  updatedAt: string;
  // Excel Tool Advanced Fields
  toolSteps?: ToolStep[];
  tips?: string;
  warnings?: string;
  keyboardShortcut?: string;
  toolExampleResult?: string;
}


export interface ToolStep {
  id: string;
  type: 'description' | 'cell_input' | 'command' | 'shortcut' | 'formula' | 'result' | 'image';
  cell?: string;
  content: string;
  detail?: string;
  imageUrl?: string;
  caption?: string;
}

export interface Formula {

  type?: 'formula' | 'tool';
  stepsText?: string;
  id: string;
  unitId: string;
  name: string;
  shortDescription: string;
  formula: string;
  purpose?: string;
  syntax?: string;
  example?: string;
  teacherNote?: string;
  commonError?: string;
  imageId?: string;
  imageData?: string;
  steps?: Step[]; // Moving steps from StudyContent to Formula!
  importance: ImportanceLevel;
  isFavorite: boolean;
  category?: string;
  source?: string;
  tags?: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  toolSteps?: ToolStep[];
  tips?: string;
  warnings?: string;
  keyboardShortcut?: string;
  toolExampleResult?: string;
}

export type ViewMode = 'dashboard' | 'unit' | 'library' | 'favorites' | 'drafts' | 'settings' | 'customize' | 'exam';

export interface ThemeSettings {
  mode: 'focus' | 'design';
  pageTheme: 'soft-rose' | 'sage-study' | 'cloud-blue' | 'warm-paper' | 'minimal-ink';
  sidebarMode: 'expanded' | 'compact' | 'icon-only';
  animationsEnabled: boolean;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl?: string;
}

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
