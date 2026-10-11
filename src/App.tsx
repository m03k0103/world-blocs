import { useState, useEffect, useCallback } from 'react';
import type { ViewMode, Country, Framework } from './types';
import { FRAMEWORKS } from './data/frameworks';
import { Navbar } from './components/Navbar';
import { FrameworkView } from './components/FrameworkView';
import { CompareView } from './components/CompareView';
import { CountryListView } from './components/CountryListView';
import { CountryProfileModal } from './components/CountryProfileModal';
import { Globe } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// 文字列を正規化して比較（ハイフン・アンダースコア・スペースを無視）
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[-_\s]+/g, '');
}

// 枠組みを特定するヘルパー
export function findFramework(key: string | null | undefined): Framework | null {
  if (!key) return null;
  const decoded = decodeURIComponent(key).trim();
  const norm = normalizeKey(decoded);
  return (
    FRAMEWORKS.find((f) => {
      if (normalizeKey(f.id) === norm) return true;
      if (normalizeKey(f.acronym) === norm) return true;
      if (f.aliases && f.aliases.some((a) => normalizeKey(a) === norm)) return true;
      return false;
    }) || null
  );
}

// URL用スラッグの生成（スペースをハイフンに変換）
function formatFrameworkSlug(f: Framework): string {
  return encodeURIComponent(f.acronym.replace(/\s+/g, '-'));
}

export interface ParsedRoute {
  mode: ViewMode;
  framework: Framework | null;
  compareA: Framework;
  compareB: Framework;
}

const DEFAULT_COMPARE_A_ID = 'waico';
const DEFAULT_COMPARE_B_ID = 'pax_silica';

function getDefaultFrameworkA(): Framework {
  return findFramework(DEFAULT_COMPARE_A_ID) || FRAMEWORKS[0];
}

function getDefaultFrameworkB(): Framework {
  return findFramework(DEFAULT_COMPARE_B_ID) || FRAMEWORKS[1] || FRAMEWORKS[0];
}

// URLからルート情報（mode, framework, compareA, compareB）を特定するパーサー
function parseRouteFromUrl(basePath: string): ParsedRoute {
  const defaultA = getDefaultFrameworkA();
  const defaultB = getDefaultFrameworkB();

  // 1. パス解析
  const pathname = decodeURIComponent(window.location.pathname);
  let relativePath = pathname;
  if (basePath && relativePath.toLowerCase().startsWith(basePath.toLowerCase())) {
    relativePath = relativePath.slice(basePath.length);
  }
  const segments = relativePath.split('/').filter(Boolean);

  // 1-1. 掛け合わせ比較パス: /compare/...
  if (segments.length > 0 && segments[0].toLowerCase() === 'compare') {
    let compA: Framework | null = null;
    let compB: Framework | null = null;

    if (segments.length >= 3) {
      compA = findFramework(segments[1]);
      compB = findFramework(segments[2]);
    } else if (segments.length === 2) {
      // /compare/A-vs-B や /compare/AxB
      const combined = segments[1];
      const vsMatch = combined.split(/-vs-|x/i);
      if (vsMatch.length === 2) {
        compA = findFramework(vsMatch[0]);
        compB = findFramework(vsMatch[1]);
      } else {
        compA = findFramework(combined);
      }
    }

    return {
      mode: 'compare',
      framework: null,
      compareA: compA || defaultA,
      compareB: compB || defaultB,
    };
  }

  // 1-2. 国一覧パス: /countries または /country
  if (
    segments.length > 0 &&
    (segments[0].toLowerCase() === 'countries' || segments[0].toLowerCase() === 'country')
  ) {
    return {
      mode: 'country',
      framework: null,
      compareA: defaultA,
      compareB: defaultB,
    };
  }

  // 1-3. 枠組み個別パス: /{ACRONYM}（例: /NATO, /Pax-Silica）
  if (segments.length > 0 && segments[0] !== 'index.html') {
    const matched = findFramework(segments[0]);
    if (matched) {
      return {
        mode: 'framework',
        framework: matched,
        compareA: defaultA,
        compareB: defaultB,
      };
    }
  }

  // 2. クエリパラメータフォールバック
  const params = new URLSearchParams(window.location.search);
  const qMode = params.get('mode') || params.get('tab');
  const qCompare = params.get('compare');
  const qParamA = params.get('a');
  const qParamB = params.get('b');
  const qFramework = params.get('f') || params.get('framework');

  if (qMode === 'compare' || qCompare || qParamA || qParamB) {
    let compA: Framework | null = null;
    let compB: Framework | null = null;

    if (qCompare) {
      const parts = qCompare.split(',');
      if (parts[0]) compA = findFramework(parts[0]);
      if (parts[1]) compB = findFramework(parts[1]);
    }
    if (qParamA) compA = findFramework(qParamA);
    if (qParamB) compB = findFramework(qParamB);

    return {
      mode: 'compare',
      framework: null,
      compareA: compA || defaultA,
      compareB: compB || defaultB,
    };
  }

  if (qMode === 'country' || qMode === 'countries') {
    return {
      mode: 'country',
      framework: null,
      compareA: defaultA,
      compareB: defaultB,
    };
  }

  if (qFramework) {
    const matched = findFramework(qFramework);
    if (matched) {
      return {
        mode: 'framework',
        framework: matched,
        compareA: defaultA,
        compareB: defaultB,
      };
    }
  }

  // 3. ハッシュフォールバック: #/compare/... や #/NATO
  const hashVal = window.location.hash.replace(/^#\/?/, '');
  if (hashVal) {
    const hashSegments = hashVal.split('/').filter(Boolean);
    if (hashSegments.length > 0 && hashSegments[0].toLowerCase() === 'compare') {
      const compA = hashSegments[1] ? findFramework(hashSegments[1]) : null;
      const compB = hashSegments[2] ? findFramework(hashSegments[2]) : null;
      return {
        mode: 'compare',
        framework: null,
        compareA: compA || defaultA,
        compareB: compB || defaultB,
      };
    }
    if (hashSegments.length > 0) {
      const matched = findFramework(hashSegments[0]);
      if (matched) {
        return {
          mode: 'framework',
          framework: matched,
          compareA: defaultA,
          compareB: defaultB,
        };
      }
    }
  }

  // デフォルト: 枠組み未選択（ホーム画面）
  return {
    mode: 'framework',
    framework: null,
    compareA: defaultA,
    compareB: defaultB,
  };
}

// 状態から目標URLを生成するヘルパー
function getTargetUrl(
  basePath: string,
  mode: ViewMode,
  framework: Framework | null,
  compA: Framework,
  compB: Framework
): string {
  if (mode === 'compare') {
    return `${basePath}/compare/${formatFrameworkSlug(compA)}/${formatFrameworkSlug(compB)}`;
  }
  if (mode === 'country') {
    return `${basePath}/countries`;
  }
  if (framework) {
    return `${basePath}/${formatFrameworkSlug(framework)}`;
  }
  return `${basePath}/`;
}

function AppContent() {
  const { t } = useLanguage();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const initialRoute = parseRouteFromUrl(basePath);
  const [currentMode, setCurrentMode] = useState<ViewMode>(initialRoute.mode);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(initialRoute.framework);
  const [compareAId, setCompareAId] = useState<string>(initialRoute.compareA.id);
  const [compareBId, setCompareBId] = useState<string>(initialRoute.compareB.id);
  const [modalCountry, setModalCountry] = useState<Country | null>(null);

  // 枠組み変更時のURL同期ハンドラ
  const handleSelectFramework = useCallback((framework: Framework | null) => {
    setSelectedFramework(framework);
    setCurrentMode('framework');

    const fA = findFramework(compareAId) || getDefaultFrameworkA();
    const fB = findFramework(compareBId) || getDefaultFrameworkB();
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

    const fA = findFramework(aId) || getDefaultFrameworkA();
    const fB = findFramework(bId) || getDefaultFrameworkB();
    const targetUrl = getTargetUrl(basePath, 'compare', null, fA, fB);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ mode: 'compare', compareAId: aId, compareBId: bId }, '', targetUrl);
    }
  }, [basePath]);

  // モード切替ハンドラ
  const handleModeChange = useCallback((mode: ViewMode) => {
    setCurrentMode(mode);

    const fA = findFramework(compareAId) || getDefaultFrameworkA();
    const fB = findFramework(compareBId) || getDefaultFrameworkB();
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
      setCompareAId(route.compareA.id);
      setCompareBId(route.compareB.id);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [basePath]);

  // 初回ロード時、URLを正規化（例: /compare -> /compare/WAICO/Pax-Silica）
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
