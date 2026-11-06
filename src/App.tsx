import { useState } from 'react';
import type { Country } from './types';
import { FRAMEWORKS } from './data/frameworks';
import { Navbar } from './components/Navbar';
import { FrameworkView } from './components/FrameworkView';
import { CompareView } from './components/CompareView';
import { CountryListView } from './components/CountryListView';
import { StatsView } from './components/StatsView';
import { CountryProfileModal } from './components/CountryProfileModal';
import { Globe } from 'lucide-react';
import { LanguageProvider } from './context/LanguageProvider';
import { useLanguage } from './context/LanguageContext';
import { useAppRouter } from './hooks/useAppRouter';

function AppContent() {
  const { t } = useLanguage();
  const [modalCountry, setModalCountry] = useState<Country | null>(null);

  // ルーティング・URL・ブラウザ履歴同期フック
  const {
    currentMode,
    selectedFramework,
    compareAId,
    compareBId,
    handleSelectFramework,
    handleCompareChange,
    handleModeChange,
  } = useAppRouter();

  const handleSelectCountry = (country: Country) => {
    setModalCountry(country);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* ナビゲーションバー */}
      <Navbar
        currentMode={currentMode}
        onModeChange={handleModeChange}
        onSelectCountry={handleSelectCountry}
        onSelectFramework={handleSelectFramework}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'framework' && (
          <FrameworkView
            selectedFramework={selectedFramework}
            onSelectFramework={handleSelectFramework}
            onSelectCountry={handleSelectCountry}
            selectedCountryAlpha3={modalCountry?.alpha3}
          />
        )}

        {currentMode === 'compare' && (
          <CompareView
            onSelectCountry={handleSelectCountry}
            selectedCountryAlpha3={modalCountry?.alpha3}
            frameworkAId={compareAId}
            frameworkBId={compareBId}
            onCompareChange={handleCompareChange}
          />
        )}

        {currentMode === 'stats' && (
          <StatsView
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
            <Globe className="w-4 h-4 text-blue-500" />
            <span>{t('rights')}</span>
          </div>

          <div className="flex items-center gap-6">
            <span>
              {t('footerRecorded')}: {FRAMEWORKS.length}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
