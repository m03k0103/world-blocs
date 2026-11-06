import React from 'react';
import type { Country, HistoricalEntity, Language } from '../../types';
import type { CountryMapData } from '../WorldMap';
import { STATUS_LABELS } from '../../data/frameworkLabels';
import { getLocalizedName } from '../../utils/i18nUtils';

export interface HoverInfo {
  x: number;
  y: number;
  country: Country;
  data?: CountryMapData;
  historicalContext?: {
    entity: HistoricalEntity;
    isSuccessor: boolean;
  };
}

interface MapTooltipProps {
  hoverInfo: HoverInfo | null;
  mode?: 'single' | 'compare' | 'choropleth';
  labelA?: string;
  labelB?: string;
  statIndicatorName?: string;
  language: Language;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({
  hoverInfo,
  mode = 'single',
  labelA,
  labelB,
  statIndicatorName,
  language,
}) => {
  if (!hoverInfo) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-md transition-all duration-75 max-w-xs"
      style={{
        left: `${hoverInfo.x}px`,
        top: `${hoverInfo.y - 10}px`,
      }}
    >
      {hoverInfo.historicalContext ? (
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{hoverInfo.historicalContext.entity.flagEmoji || '🚩'}</span>
            <span className="font-bold text-sm text-amber-300">
              {getLocalizedName(hoverInfo.historicalContext.entity, language)}
            </span>
            <span className="text-amber-400/80 text-[11px] font-mono">
              ({hoverInfo.historicalContext.entity.alpha3})
            </span>
          </div>
          <div className="text-[10px] text-amber-200/90 font-medium bg-amber-950/60 px-2 py-1 rounded border border-amber-800/50 leading-relaxed">
            {language === 'ja'
              ? `※現代の「${hoverInfo.country.nameJa}」領域（${hoverInfo.historicalContext.entity.succession.descriptionJa}）`
              : `*Territory of ${hoverInfo.country.nameEn} (${hoverInfo.historicalContext.entity.succession.descriptionEn})`}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">{hoverInfo.country.flagEmoji || '🌐'}</span>
          <span className="font-bold text-sm">
            {getLocalizedName(hoverInfo.country, language)}
          </span>
          <span className="text-slate-400 text-[11px] font-mono">({hoverInfo.country.alpha3})</span>
        </div>
      )}

      {mode === 'compare' ? (
        <div className="space-y-1 pt-1 border-t border-slate-700/60">
          {hoverInfo.data?.inFrameworkA && hoverInfo.data?.inFrameworkB ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-purple-200 bg-purple-900/60">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              {language === 'ja' ? '両方の枠組みに参加' : 'Member of both frameworks'}
            </div>
          ) : hoverInfo.data?.inFrameworkA ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-blue-200 bg-blue-900/60">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {language === 'ja' ? `${labelA || '枠組みA'} のみ参加` : `Member of ${labelA || 'Framework A'} only`}
            </div>
          ) : hoverInfo.data?.inFrameworkB ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-red-200 bg-red-900/60">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              {language === 'ja' ? `${labelB || '枠組みB'} のみ参加` : `Member of ${labelB || 'Framework B'} only`}
            </div>
          ) : (
            <div className="text-slate-400">{language === 'ja' ? 'いずれも非参加' : 'Non-member'}</div>
          )}
        </div>
      ) : mode === 'choropleth' ? (
        <div className="space-y-1 pt-1 border-t border-slate-700/60">
          {hoverInfo.data?.statFormatted ? (
            <>
              <div className="flex items-center justify-between gap-3 font-medium">
                <span className="text-slate-300 truncate">
                  {statIndicatorName || (language === 'ja' ? '指標値' : 'Indicator Value')}:
                </span>
                <span className="font-semibold text-sky-300 font-mono">
                  {hoverInfo.data.statFormatted}
                </span>
              </div>
              {(hoverInfo.data.statRank !== undefined || hoverInfo.data.statShare) && (
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  {hoverInfo.data.statRank !== undefined && (
                    <span className="font-semibold text-amber-300 font-mono">
                      #{hoverInfo.data.statRank}
                    </span>
                  )}
                  {hoverInfo.data.statShare && (
                    <span className="text-slate-400">{hoverInfo.data.statShare}</span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-slate-400">{language === 'ja' ? 'データ未集計' : 'No data recorded'}</div>
          )}
        </div>
      ) : (
        <div className="space-y-1 pt-1 border-t border-slate-700/60">
          {hoverInfo.data?.status ? (
            <div className="flex items-center gap-1.5 font-semibold">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    STATUS_LABELS[hoverInfo.data.status]?.hex || '#94a3b8',
                }}
              />
              <span>
                {STATUS_LABELS[hoverInfo.data.status]
                  ? STATUS_LABELS[hoverInfo.data.status][
                      language === 'en' ? 'labelEn' : 'labelJa'
                    ]
                  : hoverInfo.data.status}
              </span>
            </div>
          ) : (
            <div className="text-slate-400">{language === 'ja' ? '非参加国' : 'Non-member'}</div>
          )}

          {hoverInfo.data?.notes && (
            <div className="text-[11px] text-slate-300 leading-tight">
              {hoverInfo.data.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
