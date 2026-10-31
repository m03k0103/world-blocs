import React, { useState, useMemo } from 'react';
import type { Country, StatIndicatorId } from '../types';
import { FRAMEWORKS } from '../data/frameworks';
import { COUNTRIES, getEntity } from '../data/countries';
import {
  COUNTRY_STATS,
  STAT_INDICATORS,
  formatStatValue,
  getChoroplethColor,
} from '../data/countryStats';
import { WorldMap, type CountryMapData } from './WorldMap';
import { FrameworkCombobox } from './FrameworkCombobox';
import { useLanguage } from '../context/LanguageContext';
import { isFullMemberStatus } from '../utils/entityUtils';
import {
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  Search,
  Download,
  ArrowUpDown,
  Filter,
  Globe2,
  ExternalLink,
  Award,
} from 'lucide-react';

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
  const { t, language } = useLanguage();

  const [activeIndicator, setActiveIndicator] = useState<StatIndicatorId>(initialIndicator);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>(initialFrameworkId);

  // テーブル用ステート
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortField, setSortField] = useState<'rank' | 'name' | 'value'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const indicatorMeta = STAT_INDICATORS[activeIndicator];

  // 選択枠組みオブジェクト
  const selectedFramework = useMemo(() => {
    if (selectedFrameworkId === 'all') return null;
    return FRAMEWORKS.find((f) => f.id === selectedFrameworkId) || null;
  }, [selectedFrameworkId]);

  // 枠組み参加主体のうち、主権国家・特別実体の正式加盟国alpha3コード一覧
  const frameworkMemberCodes = useMemo(() => {
    if (!selectedFramework) return null;
    const set = new Set<string>();
    selectedFramework.members.forEach((m) => {
      if (isFullMemberStatus(m.status)) {
        const ent = getEntity(m.countryCode);
        if (ent && ent.entityType !== 'supranational' && ent.entityType !== 'regional_org') {
          set.add(m.countryCode);
        }
      }
    });
    return set;
  }, [selectedFramework]);

  // 全世界における有効国リスト（主権国家・特別実体）
  const validCountries = useMemo(() => {
    return COUNTRIES.filter(
      (c) =>
        c.alpha3 !== 'Cundefined' &&
        c.alpha3 !== 'ATA' &&
        c.alpha3 !== 'ATF' &&
        c.entityType !== 'supranational' &&
        c.entityType !== 'regional_org' &&
        c.entityType !== 'historical_state'
    );
  }, []);

  // 地域一覧
  const regions = useMemo(() => {
    const set = new Set<string>();
    validCountries.forEach((c) => {
      if (c.region) set.add(c.region);
    });
    return Array.from(set).sort();
  }, [validCountries]);

  // 全世界での合計値（シェア計算用）
  const worldTotals = useMemo(() => {
    let totalPop = 0;
    let totalGdp = 0;
    validCountries.forEach((c) => {
      const s = COUNTRY_STATS[c.alpha3];
      if (s) {
        if (s.population) totalPop += s.population;
        if (s.gdp) totalGdp += s.gdp;
      }
    });
    return { totalPop, totalGdp };
  }, [validCountries]);

  // 現在の指標における全有効国の値（最小値・最大値・順位計算用）
  const indicatorStatsData = useMemo(() => {
    const list: {
      country: Country;
      value: number | undefined;
      genderGapRank?: number;
      isIncludedInFramework: boolean;
    }[] = [];

    validCountries.forEach((country) => {
      const stats = COUNTRY_STATS[country.alpha3];
      const isIncluded = frameworkMemberCodes ? frameworkMemberCodes.has(country.alpha3) : true;
      let val: number | undefined;

      if (stats) {
        if (activeIndicator === 'population') val = stats.population;
        else if (activeIndicator === 'gdp') val = stats.gdp;
        else if (activeIndicator === 'gdp_per_capita') val = stats.gdpPerCapita;
        else if (activeIndicator === 'gender_gap') val = stats.genderGapScore;
      }

      list.push({
        country,
        value: val,
        genderGapRank: stats?.genderGapRank,
        isIncludedInFramework: isIncluded,
      });
    });

    // フィルタ対象内での有効数値リスト（順位付け用）
    const targetItems = list.filter((item) => item.isIncludedInFramework && item.value !== undefined);

    // 降順ソートで順位付け（ジェンダーギャップもスコアが高いほど上位）
    targetItems.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const rankMap = new Map<string, number>();
    targetItems.forEach((item, index) => {
      rankMap.set(item.country.alpha3, index + 1);
    });

    // 最小値・最大値
    const values = targetItems.map((item) => item.value!).filter((v) => v > 0);
    const minVal = values.length > 0 ? Math.min(...values) : 0;
    const maxVal = values.length > 0 ? Math.max(...values) : 1;

    // 対象内での合計・加重平均
    let sumValue = 0;
    let countWithData = 0;
    let targetTotalPop = 0;
    let targetTotalGdp = 0;

    targetItems.forEach((item) => {
      sumValue += item.value!;
      countWithData += 1;
      const s = COUNTRY_STATS[item.country.alpha3];
      if (s?.population) targetTotalPop += s.population;
      if (s?.gdp) targetTotalGdp += s.gdp;
    });

    const averageValue = countWithData > 0 ? sumValue / countWithData : 0;

    return {
      allList: list,
      targetItems,
      rankMap,
      minVal,
      maxVal,
      sumValue,
      countWithData,
      averageValue,
      targetTotalPop,
      targetTotalGdp,
      topItem: targetItems.length > 0 ? targetItems[0] : null,
      bottomItem: targetItems.length > 0 ? targetItems[targetItems.length - 1] : null,
    };
  }, [validCountries, frameworkMemberCodes, activeIndicator]);

  // 地図描画用データマップ
  const mapDataMap = useMemo(() => {
    const map: Record<string, CountryMapData> = {};

    indicatorStatsData.allList.forEach(({ country, value, isIncludedInFramework }) => {
      const rank = indicatorStatsData.rankMap.get(country.alpha3);
      let shareStr: string | undefined;

      if (value !== undefined) {
        if (activeIndicator === 'population' && worldTotals.totalPop > 0) {
          const share = (value / worldTotals.totalPop) * 100;
          shareStr = `${share >= 0.1 ? share.toFixed(1) : '<0.1'}% (${language === 'ja' ? '世界シェア' : 'world'})`;
        } else if (activeIndicator === 'gdp' && worldTotals.totalGdp > 0) {
          const share = (value / worldTotals.totalGdp) * 100;
          shareStr = `${share >= 0.1 ? share.toFixed(1) : '<0.1'}% (${language === 'ja' ? '世界シェア' : 'world'})`;
        }
      }

      if (!isIncludedInFramework) {
        map[country.alpha3] = {
          isFilteredOut: true,
          statValue: value,
          statFormatted: formatStatValue(activeIndicator, value, language),
        };
      } else {
        const fill = getChoroplethColor(
          activeIndicator,
          value,
          indicatorStatsData.minVal,
          indicatorStatsData.maxVal,
          false
        );
        const hoverFill = getChoroplethColor(
          activeIndicator,
          value,
          indicatorStatsData.minVal,
          indicatorStatsData.maxVal,
          true
        );

        map[country.alpha3] = {
          customFill: fill,
          customHoverFill: hoverFill,
          statValue: value,
          statFormatted: formatStatValue(activeIndicator, value, language),
          statRank: rank,
          statShare: shareStr,
        };
      }
    });

    return map;
  }, [indicatorStatsData, activeIndicator, worldTotals, language]);

  // ランキングテーブル用フィルタ & ソート
  const filteredTableData = useMemo(() => {
    return indicatorStatsData.targetItems
      .filter((item) => {
        if (search) {
          const q = search.toLowerCase();
          const matchName =
            item.country.nameJa.toLowerCase().includes(q) ||
            item.country.nameEn.toLowerCase().includes(q) ||
            item.country.alpha3.toLowerCase().includes(q);
          if (!matchName) return false;
        }

        if (selectedRegion !== 'all' && item.country.region !== selectedRegion) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'rank') {
          const rankA = indicatorStatsData.rankMap.get(a.country.alpha3) ?? 9999;
          const rankB = indicatorStatsData.rankMap.get(b.country.alpha3) ?? 9999;
          diff = rankA - rankB;
        } else if (sortField === 'name') {
          diff =
            language === 'en'
              ? a.country.nameEn.localeCompare(b.country.nameEn, 'en')
              : a.country.nameJa.localeCompare(b.country.nameJa, 'ja');
        } else if (sortField === 'value') {
          diff = (b.value ?? 0) - (a.value ?? 0);
        }

        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [indicatorStatsData, search, selectedRegion, sortField, sortOrder, language]);

  const handleSort = (field: 'rank' | 'name' | 'value') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CSVエクスポート
  const handleExportCSV = () => {
    const sanitizeCsvCell = (val: string | number | undefined | null): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      language === 'ja' ? '順位' : 'Rank',
      'ISO3',
      language === 'ja' ? '国・地域名' : 'Country Name',
      language === 'ja' ? '地域' : 'Region',
      `${indicatorMeta[language === 'en' ? 'nameEn' : 'nameJa']} (${indicatorMeta[language === 'en' ? 'unitEn' : 'unitJa']})`,
      language === 'ja' ? '人口' : 'Population',
      language === 'ja' ? '名目GDP (百万USD)' : 'GDP (Million USD)',
      language === 'ja' ? '一人当たりGDP (USD)' : 'GDP per Capita (USD)',
      language === 'ja' ? 'ジェンダーギャップ指数' : 'Gender Gap Score',
    ];

    const rows = filteredTableData.map((item) => {
      const stats = COUNTRY_STATS[item.country.alpha3];
      const rank = indicatorStatsData.rankMap.get(item.country.alpha3) ?? '';
      return [
        rank,
        item.country.alpha3,
        language === 'en' ? item.country.nameEn : item.country.nameJa,
        item.country.region,
        item.value !== undefined ? item.value : '',
        stats?.population ?? '',
        stats?.gdp ?? '',
        stats?.gdpPerCapita ?? '',
        stats?.genderGapScore ?? '',
      ]
        .map(sanitizeCsvCell)
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fwSlug = selectedFramework ? `_${selectedFramework.acronym}` : '_Global';
    link.setAttribute('download', `WorldBlocs_${indicatorMeta.id}${fwSlug}_Stats.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveIndicator('population')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeIndicator === 'population'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>{language === 'ja' ? '人口' : 'Population'}</span>
          </button>
          <button
            onClick={() => setActiveIndicator('gdp')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeIndicator === 'gdp'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0" />
            <span>{language === 'ja' ? '名目GDP' : 'Nominal GDP'}</span>
          </button>
          <button
            onClick={() => setActiveIndicator('gdp_per_capita')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeIndicator === 'gdp_per_capita'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>{language === 'ja' ? '一人当たりGDP' : 'GDP per Capita'}</span>
          </button>
          <button
            onClick={() => setActiveIndicator('gender_gap')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeIndicator === 'gender_gap'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{language === 'ja' ? 'ジェンダーギャップ' : 'Gender Gap'}</span>
          </button>
        </div>
      </div>

      {/* 定量サマリーカード（4枚） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* カード1: 対象国数 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ja' ? '対象国・地域数' : 'Recorded Countries'}
            </span>
            <Globe2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {indicatorStatsData.countWithData}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
              {language === 'ja' ? 'カ国' : ' states'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {selectedFramework
              ? `${selectedFramework.acronym} (${language === 'ja' ? '加盟・参加国' : 'members'})`
              : language === 'ja'
              ? '全世界の収録国・地域'
              : 'Global dataset'}
          </div>
        </div>

        {/* カード2: 合計 / 平均値 & 世界シェア */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeIndicator === 'population' || activeIndicator === 'gdp'
                ? language === 'ja'
                  ? '対象国 合計規模'
                  : 'Total Aggregate'
                : language === 'ja'
                ? '対象国 平均値'
                : 'Average Value'}
            </span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 truncate">
            {activeIndicator === 'population' || activeIndicator === 'gdp'
              ? formatStatValue(activeIndicator, indicatorStatsData.sumValue, language)
              : formatStatValue(activeIndicator, indicatorStatsData.averageValue, language)}
          </div>
          <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            {activeIndicator === 'population' && worldTotals.totalPop > 0 && (
              <span>
                {language === 'ja' ? '世界シェア: ' : 'World Share: '}
                {((indicatorStatsData.sumValue / worldTotals.totalPop) * 100).toFixed(1)}%
              </span>
            )}
            {activeIndicator === 'gdp' && worldTotals.totalGdp > 0 && (
              <span>
                {language === 'ja' ? '世界シェア: ' : 'World Share: '}
                {((indicatorStatsData.sumValue / worldTotals.totalGdp) * 100).toFixed(1)}%
              </span>
            )}
            {activeIndicator === 'gdp_per_capita' && (
              <span>
                {language === 'ja' ? '加重平均: ' : 'Weighted: '}
                {indicatorStatsData.targetTotalPop > 0
                  ? formatStatValue(
                      'gdp_per_capita',
                      (indicatorStatsData.targetTotalGdp * 1000000) / indicatorStatsData.targetTotalPop,
                      language
                    )
                  : '—'}
              </span>
            )}
            {activeIndicator === 'gender_gap' && (
              <span>
                {language === 'ja' ? '完全平等 1.000 基準' : 'Base parity 1.000'}
              </span>
            )}
          </div>
        </div>

        {/* カード3: 最高国（1位） */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ja' ? '最高値（1位）' : 'Highest Rank (#1)'}
            </span>
            <span className="text-xs font-bold text-amber-500">#1</span>
          </div>
          {indicatorStatsData.topItem ? (
            <>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">{indicatorStatsData.topItem.country.flagEmoji || '🌐'}</span>
                <div className="truncate">
                  <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {language === 'en'
                      ? indicatorStatsData.topItem.country.nameEn
                      : indicatorStatsData.topItem.country.nameJa}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {indicatorStatsData.topItem.country.alpha3}
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">
                {formatStatValue(activeIndicator, indicatorStatsData.topItem.value, language)}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 mt-2">—</div>
          )}
        </div>

        {/* カード4: 最低国（最下位） */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ja' ? '最低値（最下位）' : 'Lowest in Group'}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              #{indicatorStatsData.targetItems.length}
            </span>
          </div>
          {indicatorStatsData.bottomItem ? (
            <>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">{indicatorStatsData.bottomItem.country.flagEmoji || '🌐'}</span>
                <div className="truncate">
                  <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {language === 'en'
                      ? indicatorStatsData.bottomItem.country.nameEn
                      : indicatorStatsData.bottomItem.country.nameJa}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {indicatorStatsData.bottomItem.country.alpha3}
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-1 font-mono">
                {formatStatValue(activeIndicator, indicatorStatsData.bottomItem.value, language)}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 mt-2">—</div>
          )}
        </div>
      </div>

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
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{language === 'ja' ? '指標カラースケール' : 'Indicator Color Scale'}</span>
            <span className="text-[11px] font-normal text-slate-500">
              {indicatorMeta.scaleType === 'log'
                ? language === 'ja'
                  ? '※ 桁数差を明瞭化するため対数スケール(Log10)で塗色'
                  : '* Logarithmic scale (Log10) applied'
                : language === 'ja'
                ? '※ 線形スケール(0.50〜0.95)'
                : '* Linear scale (0.50 - 0.95)'}
            </span>
          </div>

          {/* グラデーションバー */}
          <div
            className="h-3.5 w-full rounded-full border border-slate-300 dark:border-slate-700 shadow-inner"
            style={{
              background: `linear-gradient(to right, ${indicatorMeta.palette.join(', ')})`,
            }}
          />

          {/* 最小・中間・最大値ラベル */}
          <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400">
            <span>
              {language === 'ja' ? '最小: ' : 'Min: '}
              {formatStatValue(activeIndicator, indicatorStatsData.minVal, language)}
            </span>
            <span>
              {language === 'ja' ? '平均: ' : 'Avg: '}
              {formatStatValue(activeIndicator, indicatorStatsData.averageValue, language)}
            </span>
            <span>
              {language === 'ja' ? '最大: ' : 'Max: '}
              {formatStatValue(activeIndicator, indicatorStatsData.maxVal, language)}
            </span>
          </div>

          {/* グレーアウト凡例 */}
          <div className="flex items-center gap-4 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/40 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600" />
              <span>{language === 'ja' ? 'データ未集計 / 対象外' : 'No data / Filtered out'}</span>
            </div>
            {selectedFramework && (
              <div className="text-slate-400 italic">
                {language === 'ja'
                  ? `※ ${selectedFramework.acronym} 非加盟国はグレーで表示されます`
                  : `* Non-members of ${selectedFramework.acronym} are grayed out`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ランキング・データ一覧テーブルセクション */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'ja' ? '国別統計ランキング & データ一覧' : 'Country Ranking & Data Table'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'ja'
                  ? `表示中: ${filteredTableData.length} カ国・地域`
                  : `Showing: ${filteredTableData.length} countries & territories`}
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('exportCsv')}</span>
            </button>
          </div>

          {/* 検索・地域フィルタバー */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'ja' ? '国名やISOコードで検索...' : 'Search country or ISO...'}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="text-xs sm:text-sm py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('filterRegionAll')}</option>
                {regions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* テーブル表示領域 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 w-16"
                >
                  <div className="flex items-center gap-1">
                    <span>{language === 'ja' ? '順位' : 'Rank'}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('tableThCountry')}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">{t('tableThRegion')}</th>
                <th
                  onClick={() => handleSort('value')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>{indicatorMeta[language === 'en' ? 'nameEn' : 'nameJa']}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">
                  {language === 'ja' ? '一人当たりGDP' : 'GDP / Capita'}
                </th>
                <th className="py-3 px-4 text-right">
                  {language === 'ja' ? 'ジェンダーギャップ' : 'Gender Gap'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTableData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {t('tableEmpty')}
                  </td>
                </tr>
              ) : (
                filteredTableData.map((item) => {
                  const stats = COUNTRY_STATS[item.country.alpha3];
                  const rank = indicatorStatsData.rankMap.get(item.country.alpha3);
                  const isSelected = selectedCountryAlpha3 === item.country.alpha3;

                  // バー長比率
                  const maxV = indicatorStatsData.maxVal || 1;
                  const ratio = item.value !== undefined ? Math.min(100, Math.max(3, (item.value / maxV) * 100)) : 0;

                  return (
                    <tr
                      key={item.country.alpha3}
                      onClick={() => onSelectCountry?.(item.country)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-orange-50/80 dark:bg-orange-950/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                        {rank ? `#${rank}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg shrink-0">{item.country.flagEmoji || '🌐'}</span>
                          <div>
                            <div className="font-bold">
                              {language === 'en' ? item.country.nameEn : item.country.nameJa}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {item.country.alpha3}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {item.country.region}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {formatStatValue(activeIndicator, item.value, language)}
                          </div>
                          {indicatorMeta.scaleType === 'log' ? null : (
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${ratio}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {formatStatValue('gdp_per_capita', stats?.gdpPerCapita, language)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {stats?.genderGapScore !== undefined ? (
                          <span>
                            {formatStatValue('gender_gap', stats.genderGapScore, language)}
                            {stats.genderGapRank && (
                              <span className="text-[10px] text-slate-400 ml-1">
                                (#{stats.genderGapRank})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
