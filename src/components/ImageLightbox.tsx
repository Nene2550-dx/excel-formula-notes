import { X, ZoomIn, Download } from 'lucide-react';

interface ImageLightboxProps {
  imageUrl: string | null;
  formulaTitle?: string;
  onClose: () => void;
}

export const ImageLightbox = ({ imageUrl, formulaTitle, onClose }: ImageLightboxProps) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200/80 bg-stone-50">
          <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
            <ZoomIn className="w-4 h-4 text-stone-500" />
            <span>ภาพประกอบ: {formulaTitle || 'สูตร Excel'}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download={`${formulaTitle || 'excel-formula'}-screenshot.png`}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="ดาวน์โหลดรูป"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-2 overflow-auto max-h-[calc(90vh-60px)] flex items-center justify-center bg-stone-900/5">
          <img
            src={imageUrl}
            alt={formulaTitle || 'Screenshot'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
