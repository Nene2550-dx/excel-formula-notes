import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, onDismiss }: ToastProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3 ${
            t.type === 'success'
              ? 'bg-emerald-50/95 text-emerald-900 border-emerald-200 shadow-emerald-900/5'
              : t.type === 'error'
              ? 'bg-rose-50/95 text-rose-900 border-rose-200 shadow-rose-900/5'
              : 'bg-stone-800/90 text-stone-100 border-stone-700 shadow-stone-900/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />}
            <span>{t.message}</span>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
