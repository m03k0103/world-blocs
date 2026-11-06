import React from 'react';
import type { StatIndicatorId, Language } from '../../types';
import { Users, DollarSign, TrendingUp, Sparkles, Landmark } from 'lucide-react';

interface StatsIndicatorTabsProps {
  activeIndicator: StatIndicatorId;
  onSelectIndicator: (id: StatIndicatorId) => void;
  language: Language;
}

export const StatsIndicatorTabs: React.FC<StatsIndicatorTabsProps> = ({
  activeIndicator,
  onSelectIndicator,
  language,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      {/* 人口 */}
      <button
        onClick={() => onSelectIndicator('population')}
        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeIndicator === 'population'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Users className="w-4 h-4 shrink-0" />
        <span>{language === 'ja' ? '人口' : 'Population'}</span>
      </button>

      {/* 名目GDP */}
      <button
        onClick={() => onSelectIndicator('gdp')}
        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeIndicator === 'gdp'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <DollarSign className="w-4 h-4 shrink-0" />
        <span>{language === 'ja' ? '名目GDP' : 'Nominal GDP'}</span>
      </button>

      {/* 一人当たりGDP */}
      <button
        onClick={() => onSelectIndicator('gdp_per_capita')}
        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeIndicator === 'gdp_per_capita'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <TrendingUp className="w-4 h-4 shrink-0" />
        <span>{language === 'ja' ? '一人当たりGDP' : 'GDP per Capita'}</span>
      </button>

      {/* ジェンダーギャップ */}
      <button
        onClick={() => onSelectIndicator('gender_gap')}
        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeIndicator === 'gender_gap'
            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>{language === 'ja' ? 'ジェンダーギャップ' : 'Gender Gap'}</span>
      </button>

      {/* 世銀所得水準 */}
      <button
        onClick={() => onSelectIndicator('income_level')}
        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer col-span-2 sm:col-span-1 ${
          activeIndicator === 'income_level'
            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Landmark className="w-4 h-4 shrink-0" />
        <span>{language === 'ja' ? '世銀所得水準' : 'Income Level'}</span>
      </button>
    </div>
  );
};
