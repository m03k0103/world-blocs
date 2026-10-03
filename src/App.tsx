import { useState } from 'react';
import type { ViewMode, Country, Framework } from './types';
import { FRAMEWORKS } from './data/frameworks';
import { Navbar } from './components/Navbar';
import { FrameworkView } from './components/FrameworkView';
import { CompareView } from './components/CompareView';
import { CountryListView } from './components/CountryListView';
import { CountryProfileModal } from './components/CountryProfileModal';
import { Globe2 } from 'lucide-react';

export function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>('framework');
  const [selectedFramework, setSelectedFramework] = useState<Framework>(FRAMEWORKS[0]); // 初期表示: NATO
  const [modalCountry, setModalCountry] = useState<Country | null>(null);

  const handleSelectCountry = (country: Country) => {
    setModalCountry(country);
  };

  const handleSelectFramework = (framework: Framework) => {
    setSelectedFramework(framework);
    setCurrentMode('framework');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* ナビゲーションバー */}
      <Navbar
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        onSelectCountry={handleSelectCountry}
        onSelectFramework={handleSelectFramework}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'framework' && (
          <FrameworkView
            selectedFramework={selectedFramework}
            onSelectFramework={setSelectedFramework}
            onSelectCountry={handleSelectCountry}
            selectedCountryAlpha3={modalCountry?.alpha3}
          />
        )}

        {currentMode === 'compare' && (
          <CompareView
            onSelectCountry={handleSelectCountry}
            selectedCountryAlpha3={modalCountry?.alpha3}
          />
        )}

        {currentMode === 'country' && (
          <CountryListView onSelectCountry={handleSelectCountry} />
        )}
      </main>

      {/* 国詳細プロファイルモーダル */}
      <CountryProfileModal
        country={modalCountry}
        onClose={() => setModalCountry(null)}
        onSelectFramework={handleSelectFramework}
      />

      {/* フッター */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-500" />
            <span>国際関係データベース (IR-DB) &copy; 2026</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>GitHub Pages 完全対応</span>
          </div>

          <div className="flex items-center gap-6">
            <span>収録枠組み: {FRAMEWORKS.length}件</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>時系列スライダー & 複数枠組み掛け合わせ分析</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
