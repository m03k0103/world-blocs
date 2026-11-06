import React, { useState, useMemo } from 'react';
import type { Country, Framework, Language, StatIndicatorId } from '../../types';
import type { IndicatorItem } from './useStatsAggregation';
import {
  COUNTRY_STATS,
  STAT_INDICATORS,
  formatStatValue,
  INCOME_LEVEL_CONFIG,
} from '../../data/countryStats';
import { exportToCsv } from '../../utils/csv';
import { getLocalizedName } from '../../utils/i18nUtils';
import { Search, Download, ArrowUpDown, Filter } from 'lucide-react';

interface StatsTableProps {
  activeIndicator: StatIndicatorId;
  targetItems: IndicatorItem[];
  rankMap: Map<string, number>;
  maxVal: number;
  regions: string[];
  selectedFramework: Framework | null;
  selectedCountryAlpha3?: string | null;
  onSelectCountry?: (country: Country) => void;
  language: Language;
}

export const StatsTable: React.FC<StatsTableProps> = ({
  activeIndicator,
  targetItems,
  rankMap,
  maxVal,
  regions,
  selectedFramework,
  selectedCountryAlpha3,
  onSelectCountry,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortField, setSortField] = useState<'rank' | 'name' | 'value'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const indicatorMeta = STAT_INDICATORS[activeIndicator];

  // ランキングテーブル用フィルタ & ソート
  const filteredTableData = useMemo(() => {
    return targetItems
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
          const rankA = rankMap.get(a.country.alpha3) ?? 9999;
          const rankB = rankMap.get(b.country.alpha3) ?? 9999;
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
  }, [targetItems, search, selectedRegion, sortField, sortOrder, rankMap, language]);

  const handleSort = (field: 'rank' | 'name' | 'value') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CSVエクスポート（共通 exportToCsv を使用）
  const handleExportCSV = () => {
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
      language === 'ja' ? '世銀所得水準' : 'World Bank Income Level',
    ];

    const rows = filteredTableData.map((item) => {
      const stats = COUNTRY_STATS[item.country.alpha3];
      const rank = rankMap.get(item.country.alpha3) ?? '';
      return [
        rank,
        item.country.alpha3,
        getLocalizedName(item.country, language),
        item.country.region,
        item.value !== undefined ? item.value : '',
        stats?.population ?? '',
        stats?.gdp ?? '',
        stats?.gdpPerCapita ?? '',
        stats?.genderGapScore ?? '',
        stats?.incomeLevel
          ? language === 'ja'
            ? INCOME_LEVEL_CONFIG[stats.incomeLevel].nameJa
            : INCOME_LEVEL_CONFIG[stats.incomeLevel].nameEn
          : '',
      ];
    });

    const fwSlug = selectedFramework ? `_${selectedFramework.acronym}` : '_Global';
    exportToCsv({
      filename: `WorldBlocs_${indicatorMeta.id}${fwSlug}_Stats.csv`,
      headers,
      rows,
    });
  };

  return (
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
            <span>{language === 'ja' ? 'CSVエクスポート' : 'Export CSV'}</span>
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
              <option value="all">{language === 'ja' ? 'すべての地域' : 'All Regions'}</option>
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
                  <span>{language === 'ja' ? '国・地域名' : 'Country'}</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">{language === 'ja' ? '地域' : 'Region'}</th>
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
                  {language === 'ja' ? '該当するデータが見つかりません' : 'No data found'}
                </td>
              </tr>
            ) : (
              filteredTableData.map((item) => {
                const stats = COUNTRY_STATS[item.country.alpha3];
                const rank = rankMap.get(item.country.alpha3);
                const isSelected = selectedCountryAlpha3 === item.country.alpha3;

                // バー長比率
                const maxV = maxVal || 1;
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
                            {getLocalizedName(item.country, language)}
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
                      {activeIndicator === 'income_level' ? (
                        stats?.incomeLevel ? (
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: `${INCOME_LEVEL_CONFIG[stats.incomeLevel].color}20`,
                              color: INCOME_LEVEL_CONFIG[stats.incomeLevel].color,
                              border: `1px solid ${INCOME_LEVEL_CONFIG[stats.incomeLevel].color}40`,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: INCOME_LEVEL_CONFIG[stats.incomeLevel].color }}
                            />
                            <span>
                              {language === 'ja'
                                ? INCOME_LEVEL_CONFIG[stats.incomeLevel].nameJa
                                : INCOME_LEVEL_CONFIG[stats.incomeLevel].nameEn}
                            </span>
                            <span className="text-[10px] opacity-75">({stats.incomeLevel})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )
                      ) : (
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
                      )}
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
  );
};
