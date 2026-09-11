import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  textToCopy, 
  label = 'Copy',
  className = '',
  variant = 'primary'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textToCopy) return;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const baseStyles = "inline-flex items-center justify-center gap-1.5 transition-all font-bold focus:outline-none";
  
  const variants = {
    primary: "px-3 py-1.5 bg-[var(--color-ink)] text-white text-xs rounded-lg shadow-sm hover:bg-stone-800 active:scale-95",
    secondary: "px-3 py-1.5 bg-white border border-[var(--color-powder)] text-[var(--color-ink)] text-xs rounded-lg hover:bg-[var(--color-ivory)] active:scale-95",
    ghost: "px-2 py-1 text-stone-500 hover:text-[var(--color-ink)] hover:bg-stone-100 rounded text-xs active:scale-95",
    icon: "p-1.5 text-stone-400 hover:text-[var(--color-ink)] hover:bg-stone-100 rounded-md active:scale-95"
  };

  return (
    <button 
      onClick={handleCopy}
      title={`Copy ${label}`}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {copied ? <Check size={14} className={variant === 'primary' ? 'text-emerald-400' : 'text-emerald-600'} /> : <Copy size={14} />}
      {variant !== 'icon' && <span>{copied ? 'Copied ✓' : label}</span>}
    </button>
  );
};
