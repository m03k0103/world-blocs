import React from 'react';
import type { Country, Language } from '../../types';
import type { CountryMapData } from '../WorldMap';
import { STATUS_LABELS } from '../../data/frameworkLabels';
import { isNonStateParticipant } from '../../utils/entityUtils';
import { getLocalizedName } from '../../utils/i18nUtils';

interface MapEntityBadgesProps {
  regionalBlocMembers: { country: Country; data: CountryMapData }[];
  microstateMembers: { country: Country; data: CountryMapData }[];
  selectedCountryAlpha3?: string | null;
  onSelectCountry?: (country: Country) => void;
  getCountryFill: (alpha3: string, isHovered: boolean, isSelected: boolean) => string;
  mode?: 'single' | 'compare' | 'choropleth';
  labelA?: string;
  labelB?: string;
  language: Language;
}

export const MapEntityBadges: React.FC<MapEntityBadgesProps> = ({
  regionalBlocMembers,
  microstateMembers,
  selectedCountryAlpha3,
  onSelectCountry,
  getCountryFill,
  mode = 'single',
  labelA,
  labelB,
  language,
}) => {
  if (regionalBlocMembers.length === 0 && microstateMembers.length === 0) return null;

  const renderMemberItem = (country: Country, data: CountryMapData) => {
    const isSelected = selectedCountryAlpha3 === country.alpha3;
    const fill = getCountryFill(country.alpha3, false, isSelected);
    const isNonState = isNonStateParticipant(country.alpha3);
    const statusLabel = isNonState
      ? language === 'en'
        ? 'Non-State Participant'
        : '非国家参加者'
      : data.status && STATUS_LABELS[data.status]
      ? STATUS_LABELS[data.status][language === 'en' ? 'labelEn' : 'labelJa']
      : data.status;

    return (
      <button
        key={country.alpha3}
        onClick={() => onSelectCountry?.(country)}
        className={`w-full flex items-center justify-between gap-2 px-2 py-1 text-left text-xs transition-colors cursor-pointer rounded ${
          isSelected
            ? 'text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/70 dark:bg-orange-950/40'
            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-700/40'
        }`}
        title={getLocalizedName(country, language)}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-sm shrink-0">{country.flagEmoji || '🌐'}</span>
          <span className="truncate font-medium">
            {getLocalizedName(country, language)}
          </span>
        </div>
        {mode === 'compare' ? (
          <span className="flex items-center gap-1.5 text-[11px] shrink-0 text-slate-500 dark:text-slate-400">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: fill }}
            />
            <span className="truncate max-w-[84px]">
              {data.inFrameworkA && data.inFrameworkB
                ? language === 'ja'
                  ? '両方'
                  : 'Both'
                : data.inFrameworkA
                ? labelA
                : labelB}
            </span>
          </span>
        ) : (
          statusLabel && (
            <span className="flex items-center gap-1.5 text-[11px] shrink-0 text-slate-500 dark:text-slate-400">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: fill }}
              />
              <span className="truncate max-w-[84px]">{statusLabel}</span>
            </span>
          )
        )}
      </button>
    );
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md flex flex-col gap-2.5 max-w-[280px] sm:max-w-[320px] max-h-[calc(100%-2rem)] overflow-y-auto">
      {/* 地域組織・非国家参加 */}
      {regionalBlocMembers.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            {language === 'ja' ? '地域組織・非国家参加' : 'Regional / Non-state Members'}
          </div>
          <div className="flex flex-col">
            {regionalBlocMembers.map(({ country, data }) => renderMemberItem(country, data))}
          </div>
        </div>
      )}

      {/* セパレーター */}
      {regionalBlocMembers.length > 0 && microstateMembers.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700/80" />
      )}

      {/* 地図未表示の参加国 */}
      {microstateMembers.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            {language === 'ja' ? '地図未表示の参加国' : 'Other participating states'}
          </div>
          <div className="flex flex-col">
            {microstateMembers.map(({ country, data }) => renderMemberItem(country, data))}
          </div>
        </div>
      )}
    </div>
  );
};
