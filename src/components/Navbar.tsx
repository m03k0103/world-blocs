import React from 'react';
import type { ViewMode, Country, Framework } from '../types';
import { Globe, Layers, GitCompare, Shield, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onSelectCountry?: (country: Country) => void;
  onSelectFramework: (framework: Framework | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  onSelectFramework,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* ロゴ & タイトル */}
          <button
            onClick={() => {
              onSelectFramework(null);
              onModeChange('framework');
            }}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                World Blocs
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {t('appSubTitle')}
              </p>
            </div>
          </button>

          {/* 右側アクション（ナビゲーションタブ ＋ 言語切替） */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ナビゲーションモード切替タブ */}
            <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onModeChange('framework')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentMode === 'framework'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t('navFramework')}</span>
              </button>

              <button
                onClick={() => onModeChange('compare')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentMode === 'compare'
                    ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>{t('navCompare')}</span>
              </button>

              <button
                onClick={() => onModeChange('country')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentMode === 'country'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('navCountry')}</span>
              </button>
            </nav>

            {/* 日英切替トグル */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <div className="flex items-center gap-1 px-1.5 text-slate-400 hidden xl:flex">
                <Languages className="w-3.5 h-3.5" />
              </div>
              <button
                onClick={() => setLanguage('ja')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'ja'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="日本語"
              >
                JA
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
