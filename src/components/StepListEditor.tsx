import React, { useState } from 'react';
import type { Step } from '../types';
import { Plus, GripVertical, Trash2, Image as ImageIcon, Check, X } from 'lucide-react';

interface StepListEditorProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

export const StepListEditor: React.FC<StepListEditorProps> = ({ steps = [], onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      order: steps.length + 1,
      title: '',
      description: '',
    };
    onChange([...steps, newStep]);
  };

  const handleUpdateStep = (id: string, updates: Partial<Step>) => {
    onChange(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteStep = (id: string) => {
    const newSteps = steps.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }));
    onChange(newSteps);
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleUpdateStep(id, { imageData: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newSteps = [...steps];
    const [moved] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(targetIndex, 0, moved);
    onChange(newSteps.map((s, i) => ({ ...s, order: i + 1 })));
    setDraggedIndex(null);
  };

  return (
    <div className="mt-8 pt-6 border-t border-[var(--color-powder)]">
      <h3 className="text-lg font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">
        📸 HOW TO USE (Step-by-Step)
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-[var(--color-ivory)]/50 border border-[var(--color-powder)] rounded-2xl p-4 flex gap-4 transition-all ${draggedIndex === index ? 'opacity-40' : ''}`}
          >
            <div className="cursor-grab text-stone-300 hover:text-[var(--color-ink)] mt-2">
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-[var(--color-dusty)] opacity-80">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <input 
                    type="text" 
                    placeholder="Step Title (e.g. เลือกเซลล์)" 
                    value={step.title}
                    onChange={(e) => handleUpdateStep(step.id, { title: e.target.value })}
                    className="flex-1 bg-transparent border-b border-[var(--color-powder)] px-1 py-1 text-sm font-bold text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-dusty)]"
                  />
                </div>
                <textarea 
                  placeholder="Description..." 
                  value={step.description}
                  onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                  className="w-full bg-white/50 border border-[var(--color-powder)] rounded-lg px-3 py-2 text-sm text-[var(--color-ink)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-dusty)]"
                  rows={2}
                />
              </div>
              
              <div className="sm:w-48 flex flex-col">
                {step.imageData ? (
                  <div className="relative group rounded-lg overflow-hidden border border-[var(--color-powder)] bg-white h-24">
                    <img src={step.imageData} alt={step.title} className="w-full h-full object-cover" />
                    <button onClick={() => handleUpdateStep(step.id, { imageData: undefined })} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed border-[var(--color-powder)] bg-white/50 hover:bg-white text-stone-400 hover:text-[var(--color-ink)] transition-colors">
                    <ImageIcon size={20} className="mb-1" />
                    <span className="text-xs font-medium px-2 text-center">Add Image / Screenshot</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(step.id, e)} className="hidden" />
                  </label>
                )}
              </div>
            </div>
            
            <button onClick={() => handleDeleteStep(step.id)} className="text-stone-400 hover:text-rose-500 self-start p-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        <button 
          onClick={handleAddStep}
          className="w-full py-3 border-2 border-dashed border-[var(--color-powder)] rounded-2xl text-[var(--color-ink)] font-bold text-sm hover:bg-[var(--color-powder)]/20 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Step
        </button>
      </div>
    </div>
  );
};
