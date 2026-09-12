# Goal Description
1. Fix ExamModeView so users can delete formulas directly from it.
2. Completely overhaul the "Excel Tool" tab inside `FormulaModal.tsx` to match the new intricate "Step Editor" design, complete with Live Preview, Shortcuts, Tips, Exam Notes, and Images per step.

## Proposed Changes

### 1. `ExamModeView.tsx` and `App.tsx`
- Add `onDeleteFormula` prop to `ExamModeView`.
- In `ExamModeView.tsx`, add a Delete button (Trash icon) to each formula card/row.
- Pass `handleDeleteFormula` from `App.tsx` into `<ExamModeView />`.

### 2. `types/index.ts`
- Enhance `Formula` interface to support the new `Excel Tool` structure:
  - `toolSteps?: ToolStep[]`
  - `tips?: string`
  - `warnings?: string`
  - `toolExample?: string`
  - `toolResult?: string`
  - `keyboardShortcut?: string`

- Define `ToolStep` interface:
  - `id: string`
  - `type: 'description' | 'cell_input' | 'command' | 'shortcut' | 'formula' | 'result' | 'image'`
  - `cell?: string`
  - `content: string` // The main text/data
  - `detail?: string` // e.g. command detail
  - `imageUrl?: string`
  - `caption?: string`

### 3. `FormulaModal.tsx`
- Split the modal into a two-column layout (Left: Form, Right: Live Preview) WHEN the window is wide enough, OR keep it clean. The user requested "ด้านขวาของ Form ให้มี Live Preview" (Right side of Form has Live Preview). This implies a massive wide modal.
- Create a dedicated `<ExcelToolForm />` subcomponent inside or alongside `FormulaModal.tsx` to handle the complex state of `ToolStep[]`.
- Steps must be reorderable, editable, deletable.
- Form must include:
  - Tool Name (maps to `name`)
  - Category (maps to `category`)
  - Unit (maps to `unitId`)
  - Short Description (maps to `shortDescription`)
  - Steps Array (Dynamic list)
  - Example section
  - Keyboard Shortcut
  - Tips, Warnings, Exam Note
  - Image per step (if step type is image)

### 4. `FormulaCard.tsx`
- Update the display logic for `type === 'tool'` to render the new `toolSteps` array cleanly, along with Keyboard Shortcuts, Tips, Warnings, and Exam Notes.
- This will match the Live Preview exactly, as the Live Preview will just render a `<FormulaCard formula={previewData} />`.

## Verification Plan
1. Test ExamModeView delete button.
2. Build the Excel Tool form and verify all inputs work.
3. Test saving an Excel Tool and verify it renders perfectly in `UnitDetail.tsx`.
