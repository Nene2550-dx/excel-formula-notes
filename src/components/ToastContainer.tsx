import React from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-auto md:-translate-x-0 md:right-6 z-[200] flex flex-col gap-2 pointer-events-none w-[90%] md:w-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto animate-in slide-in-from-bottom-2 md:slide-in-from-right-4 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-900/20' :
            toast.type === 'error' ? 'bg-rose-600 text-white shadow-rose-900/20' :
            'bg-stone-800 text-white shadow-stone-900/20'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <Check size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
          <button 
            onClick={() => onDismiss(toast.id)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
