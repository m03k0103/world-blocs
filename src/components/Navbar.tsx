import React, { useState } from 'react';
import type { ViewMode, Country, Framework } from '../types';
import { COUNTRIES } from '../data/countries';
import { FRAMEWORKS } from '../data/frameworks';
import { Globe, Layers, GitCompare, Search, Shield, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onSelectCountry: (country: Country) => void;
  onSelectFramework: (framework: Framework) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  onSelectCountry,
  onSelectFramework,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 検索フィルター
  const filteredResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { frameworks: [], countries: [] };
    const q = searchQuery.toLowerCase().trim();

    const matchedFrameworks = FRAMEWORKS.filter(
      (f) =>
        f.nameJa.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.acronym.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedCountries = COUNTRIES.filter(
      (c) =>
        c.nameJa.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.alpha3.toLowerCase().includes(q)
    ).slice(0, 5);

    return { frameworks: matchedFrameworks, countries: matchedCountries };
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* ロゴ & タイトル */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                World Blocs
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">
                  IR-DB
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                国際枠組み・条約・同盟の可視化＆比較プラットフォーム
              </p>
            </div>
          </div>

          {/* グローバル検索バー */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="枠組み・条約（NATO, CPTPPなど）や国名を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            {/* 検索候補ドロップダウン */}
            {isSearchFocused && (filteredResults.frameworks.length > 0 || filteredResults.countries.length > 0) && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50">
                {filteredResults.frameworks.length > 0 && (
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1">
                      枠組み・条約
                    </div>
                    {filteredResults.frameworks.map((f) => (
                      <button
                        key={f.id}
                        onMouseDown={() => {
                          onSelectFramework(f);
                          onModeChange('framework');
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-left text-xs transition-colors"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {f.acronym} - {f.nameJa}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}

                {filteredResults.countries.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1">
                      国・地域
                    </div>
                    {filteredResults.countries.map((c) => (
                      <button
                        key={c.alpha3}
                        onMouseDown={() => {
                          onSelectCountry(c);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-left text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flagEmoji || '🌐'}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {c.nameJa} ({c.nameEn})
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ナビゲーションモード切替タブ */}
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onModeChange('framework')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentMode === 'framework'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>枠組み表示</span>
            </button>

            <button
              onClick={() => onModeChange('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentMode === 'compare'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>掛け合わせ比較</span>
            </button>

            <button
              onClick={() => onModeChange('country')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentMode === 'country'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>国から探す</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
