import { BookOpen, Star, Sparkles, AlertCircle } from 'lucide-react';

interface LearningOverviewProps {
  totalUnits: number;
  totalFormulas: number;
  totalFavorites: number;
  totalExam: number;
  totalDrafts: number;
  onFilterExam?: () => void;
  onFilterDrafts?: () => void;
}

export const LearningOverview = ({
  totalUnits,
  totalFormulas,
  totalFavorites,
  totalExam,
  totalDrafts,
}: LearningOverviewProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
      {/* Total Units */}
      <div className="notebook-card p-4 sm:p-5 rounded-2xl border border-stone-200/80 bg-white flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
            {totalUnits}
          </div>
          <div className="text-xs text-stone-500 font-medium">บทเรียน (Units)</div>
        </div>
      </div>

      {/* Total Formulas */}
      <div className="notebook-card p-4 sm:p-5 rounded-2xl border border-stone-200/80 bg-white flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-800 flex items-center justify-center flex-shrink-0">
          <span className="text-base font-mono font-bold">fx</span>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
            {totalFormulas}
          </div>
          <div className="text-xs text-stone-500 font-medium">สูตรทั้งหมด (Formulas)</div>
        </div>
      </div>

      {/* Favorites */}
      <div className="notebook-card p-4 sm:p-5 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white to-amber-50/30 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
            {totalFavorites}
          </div>
          <div className="text-xs text-amber-900/80 font-medium">สูตรติดดาว (Favorites)</div>
        </div>
      </div>

      {/* Exam Ready */}
      <div className="notebook-card p-4 sm:p-5 rounded-2xl border border-rose-200/70 bg-gradient-to-br from-white to-rose-50/30 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 fill-rose-300 text-rose-600" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
            {totalExam}
          </div>
          <div className="text-xs text-rose-800 font-medium">⭐ ออกสอบ / ต้องจำ</div>
        </div>
      </div>

      {/* Drafts */}
      <div className="col-span-2 sm:col-span-1 notebook-card p-4 sm:p-5 rounded-2xl border border-stone-200/80 bg-white flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
            {totalDrafts}
          </div>
          <div className="text-xs text-stone-500 font-medium">Draft รอเติมข้อมูล</div>
        </div>
      </div>
    </div>
  );
};
