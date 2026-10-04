import { useState, useEffect, useCallback } from 'react';
import type { ViewMode, Country, Framework } from './types';
import { FRAMEWORKS } from './data/frameworks';
import { Navbar } from './components/Navbar';
import { FrameworkView } from './components/FrameworkView';
import { CompareView } from './components/CompareView';
import { CountryListView } from './components/CountryListView';
import { CountryProfileModal } from './components/CountryProfileModal';
import { Globe2 } from 'lucide-react';

// URLパス・クエリ・ハッシュから枠組みを特定するヘルパー
function getFrameworkFromUrl(): Framework | null {
  // 1. パス末尾セグメントから判定（例: /world-blocs/EU -> 'EU'）
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const last = segments[segments.length - 1].toLowerCase();
    if (last !== 'world-blocs' && last !== 'index.html') {
      const match = FRAMEWORKS.find(
        (f) => f.acronym.toLowerCase() === last || f.id.toLowerCase() === last
      );
      if (match) return match;
    }
  }

  // 2. クエリパラメータから判定 (?f=EU または ?framework=EU)
  const params = new URLSearchParams(window.location.search);
  const paramVal = params.get('f') || params.get('framework');
  if (paramVal) {
    const valLower = paramVal.toLowerCase();
    const match = FRAMEWORKS.find(
      (f) => f.acronym.toLowerCase() === valLower || f.id.toLowerCase() === valLower
    );
    if (match) return match;
  }

  // 3. ハッシュから判定 (#/EU または #EU)
  const hashVal = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hashVal) {
    const match = FRAMEWORKS.find(
      (f) => f.acronym.toLowerCase() === hashVal || f.id.toLowerCase() === hashVal
    );
    if (match) return match;
  }

  return null;
}

export function App() {
  const initialFramework = getFrameworkFromUrl() || FRAMEWORKS[0];
  const [currentMode, setCurrentMode] = useState<ViewMode>('framework');
  const [selectedFramework, setSelectedFramework] = useState<Framework>(initialFramework);
  const [modalCountry, setModalCountry] = useState<Country | null>(null);

  // ベースパス（GitHub Pages では '/world-blocs'、ローカルでは ''）
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  // 枠組み変更時のURL同期ハンドラ
  const handleSelectFramework = useCallback((framework: Framework) => {
    setSelectedFramework(framework);
    setCurrentMode('framework');

    // ブラウザURLを /world-blocs/{ACRONYM} に同期（大文字表記）
    const targetUrl = `${basePath}/${framework.acronym}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ frameworkId: framework.id }, '', targetUrl);
    }
  }, [basePath]);

  // モード切替ハンドラ
  const handleModeChange = useCallback((mode: ViewMode) => {
    setCurrentMode(mode);
    if (mode !== 'framework') {
      const targetUrl = `${basePath}/`;
      window.history.pushState({ mode }, '', targetUrl);
    } else {
      const targetUrl = `${basePath}/${selectedFramework.acronym}`;
      window.history.pushState({ frameworkId: selectedFramework.id }, '', targetUrl);
    }
  }, [basePath, selectedFramework]);

  // ブラウザの戻る・進むボタン（popstate）対応
  useEffect(() => {
    const handlePopState = () => {
      const matched = getFrameworkFromUrl();
      if (matched) {
        setSelectedFramework(matched);
        setCurrentMode('framework');
      } else {
        // パス末尾に枠組み名がない場合はベース画面
        setCurrentMode('framework');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 初回ロード時、URLに指定された枠組みがあればURLを正規化
  useEffect(() => {
    const matched = getFrameworkFromUrl();
    if (matched) {
      const normalizedUrl = `${basePath}/${matched.acronym}`;
      if (window.location.pathname.toLowerCase() !== normalizedUrl.toLowerCase()) {
        window.history.replaceState({ frameworkId: matched.id }, '', normalizedUrl);
      }
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
            <span>World Blocs (IR-DB) &copy; 2026</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>GitHub Pages 完全対応</span>
          </div>

          <div className="flex items-center gap-6">
            <span>収録枠組み: {FRAMEWORKS.length}件</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>ダイレクトURL連携対応</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
