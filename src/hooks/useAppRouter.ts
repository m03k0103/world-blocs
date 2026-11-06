import { useState, useEffect, useCallback } from 'react';
import type { ViewMode, Framework } from '../types';
import { findFramework } from '../utils/frameworkUtils';
import { parseRouteFromUrl, getTargetUrl } from '../utils/routing';

export interface AppRouterState {
  basePath: string;
  currentMode: ViewMode;
  selectedFramework: Framework | null;
  compareAId: string;
  compareBId: string;
  handleSelectFramework: (framework: Framework | null) => void;
  handleCompareChange: (aId: string, bId: string) => void;
  handleModeChange: (mode: ViewMode) => void;
}

export function useAppRouter(): AppRouterState {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const initialRoute = parseRouteFromUrl(basePath);
  const [currentMode, setCurrentMode] = useState<ViewMode>(initialRoute.mode);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(initialRoute.framework);
  const [compareAId, setCompareAId] = useState<string>(initialRoute.compareA?.id || '');
  const [compareBId, setCompareBId] = useState<string>(initialRoute.compareB?.id || '');

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

  return {
    basePath,
    currentMode,
    selectedFramework,
    compareAId,
    compareBId,
    handleSelectFramework,
    handleCompareChange,
    handleModeChange,
  };
}
