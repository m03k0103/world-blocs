import React from 'react';
import type { Framework, Language, StatIndicatorId } from '../../types';
import type { IndicatorItem } from './useStatsAggregation';
import { formatStatValue } from '../../data/countryStats';
import { getLocalizedName } from '../../utils/i18nUtils';
import { Users, Award, DollarSign, TrendingUp } from 'lucide-react';

interface StatsSummaryCardsProps {
  activeIndicator: StatIndicatorId;
  selectedFramework: Framework | null;
  indicatorStatsData: {
    allList: IndicatorItem[];
    targetItems: IndicatorItem[];
    sumValue: number;
    countWithData: number;
    averageValue: number;
    targetTotalPop: number;
    targetTotalGdp: number;
    countHic: number;
    countUmic: number;
    countLmic: number;
    countLic: number;
    topItem: IndicatorItem | null;
    bottomItem: IndicatorItem | null;
  };
  worldTotals: {
    totalPop: number;
    totalGdp: number;
  };
  language: Language;
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({
  activeIndicator,
  selectedFramework,
  indicatorStatsData,
  worldTotals,
  language,
}) => {
  if (activeIndicator === 'income_level') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* HIC: 高所得国 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-l-blue-600 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {language === 'ja' ? '高所得国 (HIC)' : 'High Income (HIC)'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {indicatorStatsData.countHic}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {indicatorStatsData.countWithData > 0
                ? `(${((indicatorStatsData.countHic / indicatorStatsData.countWithData) * 100).toFixed(1)}%)`
                : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ja' ? '一人当たりGNI: $14,006 以上' : 'GNI per capita: ≥ $14,006'}
          </p>
        </div>

        {/* UMIC: 高中所得国 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-l-sky-500 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {language === 'ja' ? '高中所得国 (UMIC)' : 'Upper-Middle (UMIC)'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {indicatorStatsData.countUmic}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {indicatorStatsData.countWithData > 0
                ? `(${((indicatorStatsData.countUmic / indicatorStatsData.countWithData) * 100).toFixed(1)}%)`
                : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ja' ? '一人当たりGNI: $4,516 〜 $14,005' : 'GNI per capita: $4,516 - $14,005'}
          </p>
        </div>

        {/* LMIC: 低中所得国 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {language === 'ja' ? '低中所得国 (LMIC)' : 'Lower-Middle (LMIC)'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {indicatorStatsData.countLmic}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {indicatorStatsData.countWithData > 0
                ? `(${((indicatorStatsData.countLmic / indicatorStatsData.countWithData) * 100).toFixed(1)}%)`
                : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ja' ? '一人当たりGNI: $1,146 〜 $4,515' : 'GNI per capita: $1,146 - $4,515'}
          </p>
        </div>

        {/* LIC: 低所得国 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              {language === 'ja' ? '低所得国 (LIC)' : 'Low Income (LIC)'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {indicatorStatsData.countLic}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {indicatorStatsData.countWithData > 0
                ? `(${((indicatorStatsData.countLic / indicatorStatsData.countWithData) * 100).toFixed(1)}%)`
                : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ja' ? '一人当たりGNI: $1,145 以下' : 'GNI per capita: ≤ $1,145'}
          </p>
        </div>
      </div>
    );
  }

  // 通常指標時（人口、名目GDP、一人当たりGDP、ジェンダーギャップ）
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* カード1: 対象国数 */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'ja' ? '対象国・地域数' : 'Recorded Countries'}
          </span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {indicatorStatsData.countWithData}
          </span>
          <span className="text-xs text-slate-500">
            / {indicatorStatsData.allList.length}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {selectedFramework
            ? language === 'ja'
              ? `${selectedFramework.acronym} 加盟国のデータ保有数`
              : `Countries with data in ${selectedFramework.acronym}`
            : language === 'ja'
            ? '全世界の統計保有国数'
            : 'Countries with recorded statistics'}
        </p>
      </div>

      {/* カード2: 最大・首位国 */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'ja' ? '首位 / 最大国' : 'Highest Value Country'}
          </span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        {indicatorStatsData.topItem ? (
          <div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl">
                {indicatorStatsData.topItem.country.flagEmoji || '🌐'}
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {getLocalizedName(indicatorStatsData.topItem.country, language)}
              </span>
            </div>
            <p className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {formatStatValue(activeIndicator, indicatorStatsData.topItem.value, language)}
            </p>
          </div>
        ) : (
          <div className="mt-2 text-sm text-slate-400">—</div>
        )}
      </div>

      {/* カード3: 最小・最下位国 */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'ja' ? '最少 / 最低国' : 'Lowest Value Country'}
          </span>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        {indicatorStatsData.bottomItem ? (
          <div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl">
                {indicatorStatsData.bottomItem.country.flagEmoji || '🌐'}
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {getLocalizedName(indicatorStatsData.bottomItem.country, language)}
              </span>
            </div>
            <p className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 mt-1">
              {formatStatValue(activeIndicator, indicatorStatsData.bottomItem.value, language)}
            </p>
          </div>
        ) : (
          <div className="mt-2 text-sm text-slate-400">—</div>
        )}
      </div>

      {/* カード4: 平均値 または 世界シェア */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {selectedFramework
              ? activeIndicator === 'population' || activeIndicator === 'gdp'
                ? language === 'ja'
                  ? '全世界シェア'
                  : 'World Total Share'
                : language === 'ja'
                ? '枠組み内平均'
                : 'Framework Average'
              : language === 'ja'
              ? '全世界平均'
              : 'Worldwide Average'}
          </span>
          <DollarSign className="w-4 h-4 text-blue-500" />
        </div>
        <div className="mt-2">
          {selectedFramework && activeIndicator === 'population' && worldTotals.totalPop > 0 ? (
            <div>
              <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                {((indicatorStatsData.sumValue / worldTotals.totalPop) * 100).toFixed(1)}%
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {formatStatValue('population', indicatorStatsData.sumValue, language)}
              </p>
            </div>
          ) : selectedFramework && activeIndicator === 'gdp' && worldTotals.totalGdp > 0 ? (
            <div>
              <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                {((indicatorStatsData.sumValue / worldTotals.totalGdp) * 100).toFixed(1)}%
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {formatStatValue('gdp', indicatorStatsData.sumValue, language)}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {formatStatValue(activeIndicator, indicatorStatsData.averageValue, language)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'ja' ? 'データ保有国の単純平均' : 'Simple arithmetic mean'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
