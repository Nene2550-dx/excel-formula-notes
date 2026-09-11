import React from 'react';
import type { Unit, Formula } from '../types';
import { FormulaCard } from './FormulaCard';

export const DraftsView = ({ formulas, onToggleFavorite }: any) => {
  const drafts = formulas.filter((f: Formula) => f.isDraft);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-extrabold mb-8 flex items-center gap-3">
        📝 Drafts
      </h1>
      {drafts.length === 0 ? (
        <div className="text-stone-400">Nothing unfinished here.</div>
      ) : (
        <div className="space-y-4">
          {drafts.map((f: Formula) => (
             <FormulaCard key={f.id} formula={f} onToggleFavorite={onToggleFavorite} onViewDetails={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};
