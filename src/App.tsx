import React, { useState, useEffect } from 'react';
import type { Formula, Unit, ViewMode } from './types';
import { storageService } from './services/storage';

// Components
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { UnitDetail } from './components/UnitDetail';
import { FavoritesView } from './components/FavoritesView';
import { DraftsView } from './components/DraftsView';
import { SettingsView } from './components/SettingsView';
import { ExcelToolsView } from './components/ExcelToolsView';
import { CustomizeView } from './components/CustomizeView';
import { ExamModeView } from './components/ExamModeView';
import { QuickNoteModal } from './components/QuickNoteModal';
import { FormulaModal } from './components/FormulaModal';
import { MoveFormulaModal } from './components/MoveFormulaModal';
import { AIImportModal } from './components/AIImportModal';
import { UnitModal } from './components/UnitModal';
import { GlobalSearch } from './components/GlobalSearch';
import { ImageLightbox } from './components/ImageLightbox';
import { ToastContainer } from './components/ToastContainer';
import { Plus } from 'lucide-react';

function App() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isAIImportModalOpen, setIsAIImportModalOpen] = useState(false);

  // Modal Contexts
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
  const [formulaModalUnitId, setFormulaModalUnitId] = useState<string | undefined>();
  const [quickNoteUnitId, setQuickNoteUnitId] = useState<string | undefined>();
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formulaToMove, setFormulaToMove] = useState<Formula | null>(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Initialize
  useEffect(() => {
    const loadData = async () => {
      const loadedUnits = await storageService.getUnits();
      const loadedFormulas = await storageService.getFormulas();
      setUnits(loadedUnits);
      setFormulas(loadedFormulas);
      setIsLoaded(true);
    };
    loadData();

    // Global Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        if (e.key === 'Escape') (e.target as HTMLElement).blur();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if (e.key === '/') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); setViewMode('exam'); }
      if (e.key === 'Escape') { setIsGlobalSearchOpen(false); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-stone-500">Loading Storage...</div>;

  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  // Actions
  const handleAIImport = (targetUnitId: string, newNotes: any[], newFormulas: any[]) => {
    // 1. Update Unit's Note Sections
    
    let finalUnitId = targetUnitId;
    let finalUnits = [...units];
    
    if (targetUnitId.startsWith('NEW:')) {
      const newName = targetUnitId.replace('NEW:', '');
      const newUnit = {
        id: 'u' + Date.now().toString(),
        unitNumber: (units.length + 1).toString().padStart(2, "0"),
        title: newName,
        description: 'Imported by AI',
        icon: '📁',
        order: units.length,
        noteSections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      finalUnits.push(newUnit);
      finalUnitId = newUnit.id;
    }

    const targetUnit = finalUnits.find(u => u.id === finalUnitId);

    if (targetUnit) {
      const updatedUnit = {
        ...targetUnit,
        noteSections: [...(targetUnit.noteSections || []), ...newNotes.map((n, i) => ({ ...n, order: (targetUnit.noteSections?.length || 0) + i }))]
      };
      const newUnits = finalUnits.map(u => u.id === finalUnitId ? updatedUnit : u);
      setUnits(newUnits);
      storageService.saveUnits(newUnits);
    }

    // 2. Add New Formulas
    const formulasToAdd = newFormulas.map(f => ({
      ...f,
      unitId: finalUnitId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as Formula[];
    
    if (formulasToAdd.length > 0) {
      const newFormulasList = [...formulas, ...formulasToAdd];
      setFormulas(newFormulasList);
      storageService.saveFormulas(newFormulasList);
    }

    addToast(`Imported ${newNotes.length} notes and ${newFormulas.length} formulas`, 'success');
  };

  const handleSaveUnit = (unitData: Partial<Unit>) => {
    const updatedUnit = unitData as Unit;
    let newUnits;
    if (editingUnit || units.some(u => u.id === updatedUnit.id)) {
      newUnits = units.map(u => u.id === updatedUnit.id ? updatedUnit : u);
      addToast(`อัปเดตบทเรียน "${updatedUnit.title}" สำเร็จ`, 'success');
    } else {
      newUnits = [...units, updatedUnit];
      addToast(`สร้างบทเรียน "${updatedUnit.title}" สำเร็จ`, 'success');
    }
    setUnits(newUnits);
    storageService.saveUnits(newUnits);
    setIsUnitModalOpen(false);
    setEditingUnit(null);
  };

  const handleDeleteUnit = (unitId: string) => {
    const target = units.find(u => u.id === unitId);
    if (!target) return;
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ Unit นี้ (${target.title}) พร้อมข้อมูลและสูตรทั้งหมดภายใน Unit นี้?`)) {
      const newUnits = units.filter(u => u.id !== unitId);
      setUnits(newUnits);
      storageService.saveUnits(newUnits);
      const newFormulas = formulas.filter(f => f.unitId !== unitId);
      setFormulas(newFormulas);
      storageService.saveFormulas(newFormulas);
      addToast(`ลบ Unit ${target.title} เรียบร้อยแล้ว`, 'info');
      if (selectedUnitId === unitId) {
        setViewMode('dashboard');
        setSelectedUnitId(null);
      }
    }
  };

  const handleMoveUnit = (unitId: string, direction: 'up' | 'down') => {
    const index = units.findIndex(u => u.id === unitId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === units.length - 1) return;

    const newUnits = [...units];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newUnits[index];
    newUnits[index] = newUnits[targetIndex];
    newUnits[targetIndex] = temp;

    const reorderedUnits = newUnits.map((u, i) => ({ ...u, order: i }));
    setUnits(reorderedUnits);
    storageService.saveUnits(reorderedUnits);
  };

  const handleReorderUnits = (reorderedUnits: Unit[]) => {
    setUnits(reorderedUnits);
    storageService.saveUnits(reorderedUnits);
  };

  const handleSaveFormula = (formulaData: Partial<Formula>) => {
    const updatedFormula = formulaData as Formula;
    let newFormulas;
    if (editingFormula && formulas.some(f => f.id === updatedFormula.id)) {
      newFormulas = formulas.map((f) => (f.id === updatedFormula.id ? updatedFormula : f));
      addToast(`อัปเดตสูตร ${updatedFormula.name} เรียบร้อยแล้ว`, 'success');
    } else {
      newFormulas = [...formulas, updatedFormula];
      addToast(`เพิ่มสูตร ${updatedFormula.name} เรียบร้อยแล้ว`, 'success');
    }
    setFormulas(newFormulas);
    storageService.saveFormulas(newFormulas);
    setIsFormulaModalOpen(false);
    setEditingFormula(null);
  };

  const handleSaveQuickNote = (formulaData: Partial<Formula>) => {
    const newFormula = formulaData as Formula;
    const newFormulas = [...formulas, newFormula];
    setFormulas(newFormulas);
    storageService.saveFormulas(newFormulas);
    setIsQuickNoteOpen(false);
    addToast('บันทึก Quick Note เรียบร้อยแล้ว', 'success');
  };

  const handleDeleteFormula = (formulaId: string) => {
    const target = formulas.find((f) => f.id === formulaId);
    if (!target) return;
    if (window.confirm(`คุณต้องการลบสูตร "${target.name}" หรือไม่?`)) {
      const updatedFormulas = formulas.filter((f) => f.id !== formulaId);
      setFormulas(updatedFormulas);
      storageService.saveFormulas(updatedFormulas);
      addToast(`ลบสูตร ${target.name} แล้ว`, 'info');
    }
  };

  const handleMoveFormula = (formulaId: string, targetUnitId: string) => {
    const target = formulas.find((f) => f.id === formulaId);
    if (!target) return;
    const updatedFormulas = formulas.map(f => 
      f.id === formulaId ? { ...f, unitId: targetUnitId, updatedAt: new Date().toISOString() } : f
    );
    setFormulas(updatedFormulas);
    storageService.saveFormulas(updatedFormulas);
    addToast(`ย้ายสูตร ${target.name} เรียบร้อยแล้ว`, 'success');
  };

  const handleToggleFavorite = (formulaId: string) => {
    const updatedFormulas = formulas.map((f) => {
      if (f.id === formulaId) {
        const isFav = !f.isFavorite;
        addToast(isFav ? `เพิ่ม ${f.name} ในรายการโปรด` : `นำ ${f.name} ออกจากรายการโปรด`, isFav ? 'success' : 'info');
        return { ...f, isFavorite: isFav };
      }
      return f;
    });
    setFormulas(updatedFormulas);
    storageService.saveFormulas(updatedFormulas);
  };

  const handleOpenAddUnit = () => {
    setEditingUnit(null);
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setIsUnitModalOpen(true);
  };

  const handleOpenAddFormula = (unitId?: string) => {
    setEditingFormula(null);
    setFormulaModalUnitId(unitId || selectedUnitId || units[0]?.id);
    setIsFormulaModalOpen(true);
  };

  const handleOpenImage = (imageUrl: string, title: string) => {
    setLightboxImageUrl(imageUrl);
    setLightboxTitle(title);
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setViewMode('unit');
  };

  const handleSelectFromSearch = (formula: Formula) => {
    setSelectedUnitId(formula.unitId);
    setViewMode('unit');
  };
  
  const handleSelectUnitFromSearch = (unit: Unit) => {
    setSelectedUnitId(unit.id);
    setViewMode('unit');
  };

  return (
    <div className="flex h-screen overflow-hidden selection:bg-[var(--color-mauve)]/30 selection:text-[var(--color-ink)]">
      
      <Sidebar 
        currentView={viewMode}
        onNavigate={(view) => {
          setViewMode(view);
          if (view === 'dashboard' || view === 'exam') setSelectedUnitId(null);
        }}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[var(--color-ivory)]/30">
        
        {viewMode === 'dashboard' && (
          <Dashboard
            units={units}
            formulas={formulas}
            onSelectUnit={handleSelectUnit}
            onOpenAddUnit={handleOpenAddUnit}
            onOpenAddFormula={() => handleOpenAddFormula()}
            onOpenAIImport={() => setIsAIImportModalOpen(true)}
            onEditUnit={handleOpenEditUnit}
            onDeleteUnit={handleDeleteUnit}
            onMoveUnit={handleMoveUnit}
            onReorderUnits={handleReorderUnits}
          />
        )}

        {viewMode === 'unit' && selectedUnit && (
          <UnitDetail
            unit={selectedUnit}
            formulas={formulas}
            onBack={() => setViewMode('dashboard')}
            onOpenAddFormula={(unitId) => handleOpenAddFormula(unitId)}
            onOpenQuickNote={(unitId) => { setQuickNoteUnitId(unitId); setIsQuickNoteOpen(true); }}
            onEditUnit={handleSaveUnit}
            onDeleteUnit={handleDeleteUnit}
            onEditFormula={(f) => { setEditingFormula(f); setIsFormulaModalOpen(true); }}
            onDeleteFormula={handleDeleteFormula}
            onMoveFormula={(f) => setFormulaToMove(f)}
            onToggleFavorite={handleToggleFavorite}
            onOpenImage={handleOpenImage}
            onNotify={addToast}
          />
        )}

        {viewMode === 'favorites' && (
          <FavoritesView
            units={units}
            formulas={formulas}
            onBack={() => setViewMode('dashboard')}
            onEditFormula={(f) => { setEditingFormula(f); setIsFormulaModalOpen(true); }}
            onDeleteFormula={handleDeleteFormula}
            onMoveFormula={(f) => setFormulaToMove(f)}
            onToggleFavorite={handleToggleFavorite}
            onOpenImage={handleOpenImage}
            onNotify={addToast}
          />
        )}

        {viewMode === 'exam' && (
          <ExamModeView 
            formulas={formulas}
            onBack={() => setViewMode('dashboard')}
          />
        )}

        {viewMode === 'drafts' && <DraftsView formulas={formulas} onToggleFavorite={handleToggleFavorite} />}
        {viewMode === 'settings' && <SettingsView />}
        {viewMode === 'customize' && <CustomizeView />}

        {/* Floating Action Button */}
        {viewMode !== 'exam' && (
          <div className="fab-container hidden md:block z-40">
            <div className="fab-menu">
              <button onClick={() => setIsAIImportModalOpen(true)} className="fab-menu-item">✦ Import with AI</button>
              <button onClick={handleOpenAddUnit} className="fab-menu-item">📁 New Unit</button>
              <button onClick={() => handleOpenAddFormula()} className="fab-menu-item">📊 New Formula</button>
              <button onClick={() => setIsQuickNoteOpen(true)} className="fab-menu-item">📝 Quick Note</button>
            </div>
            <button className="fab-button"><Plus className="w-6 h-6" /></button>
          </div>
        )}

      </main>

      {/* Modals */}

      {isAIImportModalOpen && (
        <AIImportModal
          isOpen={isAIImportModalOpen}
          onClose={() => setIsAIImportModalOpen(false)}
          units={units}
          existingFormulas={formulas}
          onImport={handleAIImport}
        />
      )}

      {isQuickNoteOpen && (
        <QuickNoteModal
          isOpen={isQuickNoteOpen}
          units={units}
          activeUnitId={quickNoteUnitId}
          onClose={() => setIsQuickNoteOpen(false)}
          onSaveQuickNote={handleSaveQuickNote}
          onNotify={addToast}
        />
      )}

      {isFormulaModalOpen && (
        <FormulaModal
          isOpen={isFormulaModalOpen}
          units={units}
          activeUnitId={formulaModalUnitId}
          initialFormula={editingFormula}
          onClose={() => setIsFormulaModalOpen(false)}
          onSave={handleSaveFormula}
          onNotify={addToast}
        />
      )}

      <MoveFormulaModal
        isOpen={!!formulaToMove}
        formula={formulaToMove!}
        units={units}
        onClose={() => setFormulaToMove(null)}
        onConfirm={handleMoveFormula}
      />

      {isUnitModalOpen && (
        <UnitModal
          isOpen={isUnitModalOpen}
          initialUnit={editingUnit}
          totalUnitsCount={units.length}
          onClose={() => setIsUnitModalOpen(false)}
          onSave={handleSaveUnit}
          onNotify={addToast}
        />
      )}

      {isGlobalSearchOpen && (
        <GlobalSearch
          isOpen={isGlobalSearchOpen}
          formulas={formulas}
          units={units}
          onClose={() => setIsGlobalSearchOpen(false)}
          onSelectFormula={handleSelectFromSearch}
          onSelectUnit={handleSelectUnitFromSearch}
        />
      )}

      <ImageLightbox
        imageUrl={lightboxImageUrl}
        formulaTitle={lightboxTitle}
        onClose={() => setLightboxImageUrl(null)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
