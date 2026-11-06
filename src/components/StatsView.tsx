import React, { useState, useMemo } from 'react';
import type { Country, StatIndicatorId } from '../types';
import { FRAMEWORKS } from '../data/frameworks';
import { STAT_INDICATORS } from '../data/countryStats';
import { WorldMap } from './WorldMap';
import { FrameworkCombobox } from './FrameworkCombobox';
import { useLanguage } from '../context/LanguageContext';
import { Globe2, ExternalLink } from 'lucide-react';
import { useStatsAggregation } from './stats/useStatsAggregation';
import { StatsIndicatorTabs } from './stats/StatsIndicatorTabs';
import { StatsSummaryCards } from './stats/StatsSummaryCards';
import { StatsLegend } from './stats/StatsLegend';
import { StatsTable } from './stats/StatsTable';

interface StatsViewProps {
  onSelectCountry?: (country: Country) => void;
  selectedCountryAlpha3?: string | null;
  initialIndicator?: StatIndicatorId;
  initialFrameworkId?: string;
  onFrameworkChange?: (frameworkId: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  onSelectCountry,
  selectedCountryAlpha3,
  initialIndicator = 'population',
  initialFrameworkId = 'all',
  onFrameworkChange,
}) => {
  const { language } = useLanguage();

  const [activeIndicator, setActiveIndicator] = useState<StatIndicatorId>(initialIndicator);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>(initialFrameworkId);

  const indicatorMeta = STAT_INDICATORS[activeIndicator];

  // 選択枠組みオブジェクト
  const selectedFramework = useMemo(() => {
    if (selectedFrameworkId === 'all') return null;
    return FRAMEWORKS.find((f) => f.id === selectedFrameworkId) || null;
  }, [selectedFrameworkId]);

  // 統計集計カスタムフック
  const {
    regions,
    worldTotals,
    indicatorStatsData,
    mapDataMap,
  } = useStatsAggregation(activeIndicator, selectedFramework, language);

  return (
    <div className="space-y-6">
      {/* 画面トップヘッダー & コントロール */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <Globe2 className="w-4 h-4" />
              <span>{language === 'ja' ? '統計・指標コロプレスマップ' : 'Choropleth Statistics Map'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {indicatorMeta[language === 'en' ? 'nameEn' : 'nameJa']}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {indicatorMeta[language === 'en' ? 'descriptionEn' : 'descriptionJa']}
            </p>
          </div>

          {/* 枠組み抽出フィルタ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 px-2 shrink-0">
              {language === 'ja' ? '対象枠組み:' : 'Framework:'}
            </span>
            <div className="w-full sm:w-64">
              <FrameworkCombobox
                frameworks={FRAMEWORKS}
                selectedFramework={selectedFramework}
                onSelect={(fw) => {
                  const newId = fw ? fw.id : 'all';
                  setSelectedFrameworkId(newId);
                  onFrameworkChange?.(newId);
                }}
                placeholder={language === 'ja' ? '🌐 全世界（すべての国・地域）' : '🌐 Worldwide (All Countries)'}
              />
            </div>
            {selectedFrameworkId !== 'all' && (
              <button
                onClick={() => {
                  setSelectedFrameworkId('all');
                  onFrameworkChange?.('all');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {language === 'ja' ? '全世界表示' : 'Global'}
              </button>
            )}
          </div>
        </div>

        {/* 指標切り替えタブ */}
        <StatsIndicatorTabs
          activeIndicator={activeIndicator}
          onSelectIndicator={setActiveIndicator}
          language={language}
        />
      </div>

      {/* 定量サマリーカード（4枚） */}
      <StatsSummaryCards
        activeIndicator={activeIndicator}
        selectedFramework={selectedFramework}
        indicatorStatsData={indicatorStatsData}
        worldTotals={worldTotals}
        language={language}
      />

      {/* 世界地図セクション */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {selectedFramework
              ? `${selectedFramework[language === 'en' ? 'nameEn' : 'nameJa']} (${language === 'ja' ? '加盟国のみ抽出表示' : 'Member states highlighted'})`
              : language === 'ja'
              ? '全世界すべての国・地域'
              : 'Worldwide all countries & territories'}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{language === 'ja' ? '一次資料:' : 'Source:'}</span>
            <a
              href={indicatorMeta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              <span>{indicatorMeta[language === 'en' ? 'sourceEn' : 'sourceJa']}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 世界地図コンポーネント */}
        <WorldMap
          countryDataMap={mapDataMap}
          mode="choropleth"
          statIndicatorName={indicatorMeta[language === 'en' ? 'nameEn' : 'nameJa']}
          onSelectCountry={onSelectCountry}
          selectedCountryAlpha3={selectedCountryAlpha3}
          hasFrameworkSelected={Boolean(selectedFramework)}
        />

        {/* カラーバー凡例 & スケール */}
        <StatsLegend
          activeIndicator={activeIndicator}
          selectedFramework={selectedFramework}
          minVal={indicatorStatsData.minVal}
          maxVal={indicatorStatsData.maxVal}
          averageValue={indicatorStatsData.averageValue}
          language={language}
        />
      </div>

      {/* ランキング・データ一覧テーブルセクション */}
      <StatsTable
        activeIndicator={activeIndicator}
        targetItems={indicatorStatsData.targetItems}
        rankMap={indicatorStatsData.rankMap}
        maxVal={indicatorStatsData.maxVal}
        regions={regions}
        selectedFramework={selectedFramework}
        selectedCountryAlpha3={selectedCountryAlpha3}
        onSelectCountry={onSelectCountry}
        language={language}
      />
    </div>
  );
};
