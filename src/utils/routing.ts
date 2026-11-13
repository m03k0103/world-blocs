import type { ViewMode, Framework } from '../types';
import { findFramework, normalizeFrameworkKey } from './frameworkUtils';

// 文字列を正規化して比較（後方互換）
export function normalizeKey(str: string): string {
  return normalizeFrameworkKey(str);
}

// 枠組み特定ヘルパーは frameworkUtils に一元化（完全後方互換 re-export）
export { findFramework };
// URL用スラッグの生成（スペースをハイフンに変換）
export function formatFrameworkSlug(f: Framework): string {
  return encodeURIComponent(f.acronym.replace(/\s+/g, '-'));
}

export interface ParsedRoute {
  mode: ViewMode;
  framework: Framework | null;
  compareA: Framework | null;
  compareB: Framework | null;
}

// URLからルート情報（mode, framework, compareA, compareB）を特定するパーサー
export function parseRouteFromUrl(
  basePath: string,
  pathnameArg?: string,
  searchArg?: string,
  hashArg?: string
): ParsedRoute {
  // 1. パス解析
  const rawPathname =
    pathnameArg ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const pathname = decodeURIComponent(rawPathname);
  let relativePath = pathname;
  if (basePath && basePath !== '.' && relativePath.toLowerCase().startsWith(basePath.toLowerCase())) {
    relativePath = relativePath.slice(basePath.length);
  }
  const segments = relativePath.split('/').filter(Boolean);
  if (segments.length > 0 && segments[0].toLowerCase() === 'world-blocs') {
    segments.shift();
  }

  // 1-0. 統計マップパス: /stats
  if (segments.length > 0 && segments[0].toLowerCase() === 'stats') {
    return {
      mode: 'stats',
      framework: null,
      compareA: null,
      compareB: null,
    };
  }

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
      compareA: compA,
      compareB: compB,
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
      compareA: null,
      compareB: null,
    };
  }

  // 1-3. 枠組み個別パス: /{ACRONYM}（例: /NATO, /Pax-Silica）
  if (segments.length > 0 && segments[0] !== 'index.html') {
    const matched = findFramework(segments[0]);
    if (matched) {
      return {
        mode: 'framework',
        framework: matched,
        compareA: null,
        compareB: null,
      };
    }
  }

  // 2. クエリパラメータフォールバック
  const rawSearch = searchArg ?? (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(rawSearch);
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
      compareA: compA,
      compareB: compB,
    };
  }

  if (qMode === 'stats') {
    return {
      mode: 'stats',
      framework: null,
      compareA: null,
      compareB: null,
    };
  }

  if (qMode === 'country' || qMode === 'countries') {
    return {
      mode: 'country',
      framework: null,
      compareA: null,
      compareB: null,
    };
  }

  if (qFramework) {
    const matched = findFramework(qFramework);
    if (matched) {
      return {
        mode: 'framework',
        framework: matched,
        compareA: null,
        compareB: null,
      };
    }
  }

  // 3. ハッシュフォールバック: #/compare/... や #/NATO
  const rawHash = hashArg ?? (typeof window !== 'undefined' ? window.location.hash : '');
  const hashVal = rawHash.replace(/^#\/?/, '');
  if (hashVal) {
    const hashSegments = hashVal.split('/').filter(Boolean);
    if (hashSegments.length > 0 && hashSegments[0].toLowerCase() === 'compare') {
      const compA = hashSegments[1] ? findFramework(hashSegments[1]) : null;
      const compB = hashSegments[2] ? findFramework(hashSegments[2]) : null;
      return {
        mode: 'compare',
        framework: null,
        compareA: compA,
        compareB: compB,
      };
    }
    if (hashSegments.length > 0) {
      const matched = findFramework(hashSegments[0]);
      if (matched) {
        return {
          mode: 'framework',
          framework: matched,
          compareA: null,
          compareB: null,
        };
      }
    }
  }

  // デフォルト: 枠組み未選択（ホーム画面）
  return {
    mode: 'framework',
    framework: null,
    compareA: null,
    compareB: null,
  };
}

// 状態から目標URLを生成するヘルパー
export function getTargetUrl(
  basePath: string,
  mode: ViewMode,
  framework: Framework | null,
  compA: Framework | null,
  compB: Framework | null
): string {
  if (mode === 'stats') {
    return `${basePath}/stats`;
  }
  if (mode === 'compare') {
    if (compA && compB) {
      return `${basePath}/compare/${formatFrameworkSlug(compA)}/${formatFrameworkSlug(compB)}`;
    }
    if (compA) {
      return `${basePath}/compare/${formatFrameworkSlug(compA)}`;
    }
    return `${basePath}/compare`;
  }
  if (mode === 'country') {
    return `${basePath}/countries`;
  }
  if (framework) {
    return `${basePath}/${formatFrameworkSlug(framework)}`;
  }
  return `${basePath}/`;
}
