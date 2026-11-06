import React from 'react';
import type { Framework, Language, StatIndicatorId } from '../../types';
import {
  STAT_INDICATORS,
  formatStatValue,
  INCOME_LEVEL_CONFIG,
} from '../../data/countryStats';

interface StatsLegendProps {
  activeIndicator: StatIndicatorId;
  selectedFramework: Framework | null;
  minVal: number;
  maxVal: number;
  averageValue: number;
  language: Language;
}

export const StatsLegend: React.FC<StatsLegendProps> = ({
  activeIndicator,
  selectedFramework,
  minVal,
  maxVal,
  averageValue,
  language,
}) => {
  const indicatorMeta = STAT_INDICATORS[activeIndicator];

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
      {activeIndicator === 'income_level' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>
              {language === 'ja'
                ? '世界銀行 所得水準分類 (FY2025 Atlas方式 GNI基準)'
                : 'World Bank Income Groups (FY2025 Atlas GNI)'}
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              {language === 'ja' ? '※ 4区分カテゴリカル塗色' : '* 4-tier categorical color coding'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: INCOME_LEVEL_CONFIG.HIC.color }}
              />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-blue-900 dark:text-blue-300">
                  {language === 'ja' ? '高所得国 (HIC)' : 'High Income'}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">≥ $14,006</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: INCOME_LEVEL_CONFIG.UMIC.color }}
              />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-sky-900 dark:text-sky-300">
                  {language === 'ja' ? '高中所得国 (UMIC)' : 'Upper-Middle'}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">$4,516 - $14,005</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: INCOME_LEVEL_CONFIG.LMIC.color }}
              />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-amber-900 dark:text-amber-300">
                  {language === 'ja' ? '低中所得国 (LMIC)' : 'Lower-Middle'}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">$1,146 - $4,515</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: INCOME_LEVEL_CONFIG.LIC.color }}
              />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-rose-900 dark:text-rose-300">
                  {language === 'ja' ? '低所得国 (LIC)' : 'Low Income'}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">≤ $1,145</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
              {formatStatValue(activeIndicator, minVal, language)}
            </span>
            <span>
              {language === 'ja' ? '平均: ' : 'Avg: '}
              {formatStatValue(activeIndicator, averageValue, language)}
            </span>
            <span>
              {language === 'ja' ? '最大: ' : 'Max: '}
              {formatStatValue(activeIndicator, maxVal, language)}
            </span>
          </div>
        </>
      )}

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
  );
};
