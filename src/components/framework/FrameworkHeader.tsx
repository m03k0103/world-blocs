import React from 'react';
import type { Framework, MembershipRecord } from '../../types';
import { CATEGORY_LABELS, FRAMEWORK_TYPE_LABELS } from '../../data/frameworkLabels';
import { Building2, FileText, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MemberGroupCount {
  states: MembershipRecord[];
  nonStates: MembershipRecord[];
}

interface FrameworkHeaderProps {
  framework: Framework;
  latestMembers: MemberGroupCount;
  activeMembers: MemberGroupCount;
  selectedYear: number;
  currentMaxYear: number;
}

export const FrameworkHeader: React.FC<FrameworkHeaderProps> = ({
  framework,
  latestMembers,
  activeMembers,
  selectedYear,
  currentMaxYear,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
              {CATEGORY_LABELS[framework.category]?.[language === 'en' ? 'labelEn' : 'labelJa']}
            </span>
            {framework.frameworkType && FRAMEWORK_TYPE_LABELS[framework.frameworkType] && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  FRAMEWORK_TYPE_LABELS[framework.frameworkType].badgeColor
                }`}
              >
                {
                  FRAMEWORK_TYPE_LABELS[framework.frameworkType][
                    language === 'en' ? 'labelEn' : 'labelJa'
                  ]
                }
              </span>
            )}
            <span className="text-blue-300 font-mono text-xs">
              {t('establishedLabel')}: {framework.establishedYear}
              {t('yearSliderSuffix')}
              {framework.inForceYear &&
                ` (${t('inForceLabel')}: ${framework.inForceYear}${t('yearSliderSuffix')})`}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline gap-3">
            <span>{language === 'en' ? framework.nameEn : framework.nameJa}</span>
            <span className="text-blue-400 font-mono text-xl sm:text-2xl font-bold">
              ({framework.acronym})
            </span>
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">{framework.description}</p>

          {/* 一次資料・公式記録リンク */}
          {framework.sources && framework.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-blue-200/90 font-medium flex items-center gap-1.5 shrink-0">
                <FileText className="w-3.5 h-3.5 text-blue-300" />
                {t('primarySourcesLabel')}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {framework.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white border border-white/15 transition-all shadow-xs group"
                    title={src.url}
                  >
                    <span>{language === 'en' ? src.titleEn : src.titleJa}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右側サマリーバッジ */}
        <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex lg:flex-col gap-4 justify-around min-w-[140px]">
          <div className="text-center">
            <div className="text-xs text-blue-200 font-medium">
              {latestMembers.nonStates.length > 0 ? t('stateParticipants') : t('membersCount')}
            </div>
            <div className="text-3xl font-black font-mono mt-0.5 text-white">
              {latestMembers.states.length}
              <span className="text-sm font-normal text-blue-200 ml-1">
                {latestMembers.nonStates.length > 0
                  ? t('stateParticipantsSuffix')
                  : t('countriesSuffix')}
              </span>
            </div>
            {latestMembers.nonStates.length > 0 && (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/30 text-[11px] font-medium">
                <span>
                  +{latestMembers.nonStates.length} {t('nonStateParticipantsSuffix')}
                </span>
              </div>
            )}
            {selectedYear !== currentMaxYear && (
              <div className="text-[11px] text-blue-300/80 font-mono mt-1">
                {language === 'ja'
                  ? `${selectedYear}年当時: ${activeMembers.states.length}カ国${
                      activeMembers.nonStates.length > 0
                        ? ` + ${activeMembers.nonStates.length}非国家参加者`
                        : ''
                    }`
                  : `${selectedYear}: ${activeMembers.states.length} States${
                      activeMembers.nonStates.length > 0
                        ? ` + ${activeMembers.nonStates.length} Non-State`
                        : ''
                    }`}
              </div>
            )}
          </div>
          {framework.secretariat && (
            <div className="text-center lg:border-t lg:border-white/10 lg:pt-3">
              <div className="text-xs text-blue-200 font-medium flex items-center justify-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {t('secretariatLabel')}
              </div>
              <div className="text-xs font-semibold mt-0.5 text-white truncate max-w-[140px]">
                {framework.secretariat}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
