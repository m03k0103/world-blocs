import { useState, useEffect, useCallback } from 'react';
import type { ViewMode, Country, Framework } from './types';
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
import { findFramework, parseRouteFromUrl, getTargetUrl } from './utils/routing';

function AppContent() {
  const { t } = useLanguage();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const initialRoute = parseRouteFromUrl(basePath);
  const [currentMode, setCurrentMode] = useState<ViewMode>(initialRoute.mode);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(initialRoute.framework);
  const [compareAId, setCompareAId] = useState<string>(initialRoute.compareA?.id || '');
  const [compareBId, setCompareBId] = useState<string>(initialRoute.compareB?.id || '');
  const [modalCountry, setModalCountry] = useState<Country | null>(null);

  // 枠組み変更時のURL同期ハンドラ
  const handleSelectFramework = useCallback((framework: Framework | null) => {
    setSelectedFramework(framework);
    setCurrentMode('framework');

    const fA = findFramework(compareAId);
    const fB = findFramework(compareBId);
    const targetUrl = getTargetUrl(basePath, 'framework', framework, fA, fB);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ mode: 'framework', frameworkId: framework?.id }, '', targetUrl);
    }
  }, [basePath, compareAId, compareBId]);

  // 掛け合わせ比較変更時のURL同期ハンドラ
  const handleCompareChange = useCallback((aId: string, bId: string) => {
    setCompareAId(aId);
    setCompareBId(bId);
    setCurrentMode('compare');

    const fA = findFramework(aId);
    const fB = findFramework(bId);
    const targetUrl = getTargetUrl(basePath, 'compare', null, fA, fB);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ mode: 'compare', compareAId: aId, compareBId: bId }, '', targetUrl);
    }
  }, [basePath]);

  // モード切替ハンドラ
  const handleModeChange = useCallback((mode: ViewMode) => {
    setCurrentMode(mode);

    const fA = findFramework(compareAId);
    const fB = findFramework(compareBId);
    const targetUrl = getTargetUrl(basePath, mode, selectedFramework, fA, fB);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ mode }, '', targetUrl);
    }
  }, [basePath, selectedFramework, compareAId, compareBId]);

  // ブラウザの戻る・進むボタン（popstate）対応
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromUrl(basePath);
      setCurrentMode(route.mode);
      setSelectedFramework(route.framework);
      setCompareAId(route.compareA?.id || '');
      setCompareBId(route.compareB?.id || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [basePath]);

  // 初回ロード時、URLを正規化
  useEffect(() => {
    const route = parseRouteFromUrl(basePath);
    const normalizedUrl = getTargetUrl(
      basePath,
      route.mode,
      route.framework,
      route.compareA,
      route.compareB
    );
    if (
      window.location.pathname.toLowerCase() !== normalizedUrl.toLowerCase() &&
      window.location.pathname !== `${basePath}/` &&
      window.location.pathname !== `${basePath}`
    ) {
      window.history.replaceState({ mode: route.mode }, '', normalizedUrl);
    }
  }, [basePath]);

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
