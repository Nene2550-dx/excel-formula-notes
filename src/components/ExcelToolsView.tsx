import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Copy, Check } from 'lucide-react';
import { storageService } from '../services/storage';
import type { ExcelTool } from '../types';

export const ExcelToolsView: React.FC = () => {
  const [tools, setTools] = useState<ExcelTool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    storageService.getTools().then(setTools);
  }, []);

  const handleCopySteps = (steps: string, id: string) => {
    navigator.clipboard.writeText(steps);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTools = tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full bg-stone-50 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[var(--color-ink)] mb-2">Excel Tools</h1>
            <p className="text-stone-500 font-medium">"รวมวิธีใช้เครื่องมือและฟีเจอร์ Excel ที่เรียน"</p>
          </div>
          <button className="px-5 py-3 bg-[var(--color-ink)] text-white font-bold rounded-2xl shadow-sm hover:bg-stone-800 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Excel Tool
          </button>
        </header>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="🔍 Search Excel Tools (e.g. Freeze Panes, Sort, Filter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-[var(--color-powder)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-dusty)] transition-all font-medium text-stone-600"
            />
          </div>
          <button className="px-6 py-4 bg-white border border-[var(--color-powder)] text-stone-600 font-bold rounded-2xl hover:bg-stone-50 transition-colors flex items-center gap-2">
            <Filter size={18} /> All Categories
          </button>
        </div>

        {/* Tool Cards */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-medium">ยังไม่มีเครื่องมือ ลองเพิ่มใหม่เลย!</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTools.map(tool => (
              <div key={tool.id} className="bg-white p-6 rounded-3xl border border-[var(--color-powder)] shadow-sm hover:border-[var(--color-dusty)] transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[var(--color-ink)]">{tool.name}</h3>
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full">{tool.category}</span>
                    </div>
                    <p className="text-stone-500">{tool.purpose}</p>
                  </div>
                  <button onClick={() => {}} className="px-4 py-2 bg-stone-100 text-stone-500 font-bold text-xs rounded-full hover:bg-stone-200 transition-colors">
                    Edit
                  </button>
                </div>
                
                <div className="bg-stone-50 p-6 rounded-2xl mb-4">
                  <h4 className="font-bold text-[var(--color-ink)] mb-3 text-sm tracking-wide">วิธีใช้ (Steps)</h4>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{tool.steps}</p>
                </div>
                
                <button 
                  onClick={() => handleCopySteps(tool.steps, tool.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 font-bold text-xs rounded-xl shadow-sm hover:bg-stone-50 transition-colors"
                >
                  {copiedId === tool.id ? <><Check size={14} className="text-emerald-500"/> Copied!</> : <><Copy size={14}/> Copy Steps</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
