import React, { useState, useMemo } from 'react';
import type { Framework, Country, MembershipStatus } from '../types';
import { FRAMEWORKS, CATEGORY_LABELS, STATUS_LABELS } from '../data/frameworks';
import { WorldMap } from './WorldMap';
import type { CountryMapData } from './WorldMap';
import { TimelineSlider } from './TimelineSlider';
import { TableView } from './TableView';
import { FrameworkCombobox } from './FrameworkCombobox';
import { Map, Table, Building2, Globe, FileText, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { extractYear, getEffectiveMembershipYear } from '../utils/date';

interface FrameworkViewProps {
  selectedFramework: Framework | null;
  onSelectFramework: (framework: Framework | null) => void;
  onSelectCountry: (country: Country) => void;
  selectedCountryAlpha3?: string | null;
}

export const FrameworkView: React.FC<FrameworkViewProps> = ({
  selectedFramework,
  onSelectFramework,
  onSelectCountry,
  selectedCountryAlpha3,
}) => {
  const { t, language } = useLanguage();
  const currentMaxYear = 2026;
  const [selectedYear, setSelectedYear] = useState<number>(currentMaxYear);
  const [activeTab, setActiveTab] = useState<'map' | 'table'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // カテゴリでフィルタリングされた枠組みリスト
  const filteredFrameworks = useMemo(() => {
    if (selectedCategory === 'all') return FRAMEWORKS;
    return FRAMEWORKS.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  // 選択された年における各国のステータスを計算
  const computedMembership = useMemo(() => {
    if (!selectedFramework) return [];
    return selectedFramework.members
      .map((m) => {
        let currentStatus: MembershipStatus | null = null;
        const effectiveJoinYear = getEffectiveMembershipYear(m);
        const candidateStartYear =
          extractYear(m.candidate) ||
          extractYear(m.negotiationsStarted) ||
          extractYear(m.applied) ||
          m.candidateYear ||
          m.negotiationsStartedYear ||
          m.appliedYear;
        const signedYear = extractYear(m.signed) || m.signedYear;
        const withdrawnYear = extractYear(m.withdrawn) || extractYear(m.withdrawalNotified) || m.withdrawnYear;
        const suspendedYear = extractYear(m.suspended) || m.suspendedYear;

        // 1. 加盟候補国、オブザーバー、パートナー、対話パートナーの場合
        if (m.status === 'candidate' || m.status === 'observer' || m.status === 'partner' || m.status === 'dialogue') {
          const startYear = candidateStartYear || signedYear;
          if (startYear) {
            currentStatus = selectedYear >= startYear ? m.status : null;
          } else {
            currentStatus = selectedYear >= selectedFramework.establishedYear ? m.status : null;
          }
        }
        // 2. 脱退国の場合
        else if (m.status === 'withdrawn') {
          if (withdrawnYear && selectedYear >= withdrawnYear) {
            currentStatus = 'withdrawn';
          } else if (effectiveJoinYear && selectedYear >= effectiveJoinYear) {
            currentStatus = (m.joined || m.joinedYear) ? 'member' : 'party';
          } else if (signedYear && selectedYear >= signedYear) {
            currentStatus = 'signatory';
          } else {
            currentStatus = null;
          }
        }
        // 3. 参加資格停止国の場合 (suspended)
        else if (m.status === 'suspended') {
          if (suspendedYear && selectedYear >= suspendedYear) {
            currentStatus = 'suspended';
          } else if (effectiveJoinYear && selectedYear >= effectiveJoinYear) {
            currentStatus = (m.joined || m.joinedYear) ? 'member' : 'party';
          } else if (signedYear && selectedYear >= signedYear) {
            currentStatus = 'signatory';
          } else {
            currentStatus = null;
          }
        }
        // 4. 署名撤回国 (unsigned)
        else if (m.status === 'unsigned') {
          if (withdrawnYear && selectedYear >= withdrawnYear) {
            currentStatus = 'unsigned';
          } else if (signedYear && selectedYear >= signedYear) {
            currentStatus = 'signatory';
          } else {
            currentStatus = null;
          }
        }
        // 5. 未締結・非当事国 (non_party / non-party)
        else if (m.status === 'non_party' || m.status === 'non-party') {
          currentStatus = selectedYear >= selectedFramework.establishedYear ? 'non_party' : null;
        }
        // 6. 正式加盟国・条約締約国・参加国 (member / party / participating_state / ratified)
        else if (
          m.status === 'member' ||
          m.status === 'party' ||
          m.status === 'participating_state' ||
          m.status === 'ratified'
        ) {
          if (effectiveJoinYear && selectedYear >= effectiveJoinYear) {
            currentStatus = m.status;
          } else if (signedYear && selectedYear >= signedYear) {
            currentStatus = 'signatory';
          } else if (candidateStartYear && selectedYear >= candidateStartYear) {
            currentStatus = 'candidate';
          } else {
            currentStatus = null;
          }
        }
        // 7. 署名国 (signatory / signed)
        else if (m.status === 'signatory' || m.status === 'signed') {
          if (signedYear && selectedYear >= signedYear) {
            currentStatus = m.status;
          } else {
            currentStatus = null;
          }
        }

        return {
          ...m,
          currentStatus,
        };
      })
      .filter((m): m is typeof m & { currentStatus: MembershipStatus } => m.currentStatus !== null);
  }, [selectedFramework, selectedYear]);

  // 地図描画用データマップ
  const mapData = useMemo(() => {
    const res: Record<string, CountryMapData> = {};
    computedMembership.forEach((m) => {
      const year =
        getEffectiveMembershipYear(m) ||
        extractYear(m.signed) ||
        extractYear(m.candidate) ||
        extractYear(m.applied) ||
        m.signedYear ||
        m.candidateYear ||
        m.appliedYear;

      res[m.countryCode] = {
        status: m.currentStatus,
        notes: m.notes,
        year,
      };
    });
    return res;
  }, [computedMembership]);

  // ステータス別集計カウント
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    computedMembership.forEach((m) => {
      counts[m.currentStatus] = (counts[m.currentStatus] || 0) + 1;
    });
    return counts;
  }, [computedMembership]);

  // 正式加盟・メンバー（full member / state party / participating state / ratified）判定
  const isFullMemberStatus = (status: MembershipStatus): boolean => {
    return status === 'member' || status === 'party' || status === 'participating_state' || status === 'ratified';
  };

  // 最新（現行）の正式加盟・メンバー数
  const latestMemberCount = useMemo(() => {
    if (!selectedFramework) return 0;
    return selectedFramework.members.filter((m) => isFullMemberStatus(m.status)).length;
  }, [selectedFramework]);

  // 選択年における正式加盟・メンバー数
  const activeMemberCount = useMemo(() => {
    return computedMembership.filter((m) => isFullMemberStatus(m.currentStatus)).length;
  }, [computedMembership]);

  // マイルストーンの生成
  const milestones = useMemo(() => {
    if (!selectedFramework) return [];
    const list: { year: number; label: string }[] = [];
    list.push({ year: selectedFramework.establishedYear, label: t('milestoneEstablished') });

    // 大きな加盟年を抽出
    const yearCounts: Record<number, number> = {};
    selectedFramework.members.forEach((m) => {
      const joinYear = getEffectiveMembershipYear(m);
      if (joinYear && joinYear !== selectedFramework.establishedYear) {
        yearCounts[joinYear] = (yearCounts[joinYear] || 0) + 1;
      }
    });

    Object.entries(yearCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([y, c]) => {
        list.push({ year: Number(y), label: `+${c}${t('milestoneJoinedSuffix')}` });
      });

    return list.sort((a, b) => a.year - b.year);
  }, [selectedFramework, t]);

  return (
    <div className="space-y-6">
      {/* 枠組みセレクター & カテゴリフィルター */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* カテゴリ選択 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t('all')}
            </button>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setSelectedCategory(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCategory === k
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {language === 'en' ? v.labelEn : v.labelJa}
              </button>
            ))}
          </div>

          {/* 枠組み検索・選択コンボボックス */}
          <div className="w-full md:w-auto min-w-[280px] sm:min-w-[340px]">
            <FrameworkCombobox
              frameworks={filteredFrameworks}
              selectedFramework={selectedFramework}
              onSelect={(found) => {
                onSelectFramework(found);
                if (found) {
                  setSelectedYear(currentMaxYear);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 枠組みヘッダー情報 or 未選択時ウェルカムカード */}
      {selectedFramework ? (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {CATEGORY_LABELS[selectedFramework.category]?.[language === 'en' ? 'labelEn' : 'labelJa']}
                </span>
                <span className="text-blue-300 font-mono text-xs">
                  {t('establishedLabel')}: {selectedFramework.establishedYear}{t('yearSliderSuffix')}
                  {selectedFramework.inForceYear && ` (${t('inForceLabel')}: ${selectedFramework.inForceYear}${t('yearSliderSuffix')})`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline gap-3">
                <span>{language === 'en' ? selectedFramework.nameEn : selectedFramework.nameJa}</span>
                <span className="text-blue-400 font-mono text-xl sm:text-2xl font-bold">
                  ({selectedFramework.acronym})
                </span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedFramework.description}
              </p>

              {/* 一次資料・公式記録リンク */}
              {selectedFramework.sources && selectedFramework.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-blue-200/90 font-medium flex items-center gap-1.5 shrink-0">
                    <FileText className="w-3.5 h-3.5 text-blue-300" />
                    {t('primarySourcesLabel')}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedFramework.sources.map((src, idx) => (
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
            <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex lg:flex-col gap-4 justify-around">
              <div className="text-center">
                <div className="text-xs text-blue-200 font-medium">{t('membersCount')}</div>
                <div className="text-3xl font-black font-mono mt-0.5 text-white">
                  {latestMemberCount}
                  <span className="text-sm font-normal text-blue-200 ml-1">{t('countriesSuffix')}</span>
                </div>
                {selectedYear !== currentMaxYear && (
                  <div className="text-[11px] text-blue-300/80 font-mono mt-0.5">
                    {language === 'ja'
                      ? `${selectedYear}年当時: ${activeMemberCount}カ国`
                      : `${selectedYear}: ${activeMemberCount}`}
                  </div>
                )}
              </div>
              {selectedFramework.secretariat && (
                <div className="text-center lg:border-t lg:border-white/10 lg:pt-3">
                  <div className="text-xs text-blue-200 font-medium flex items-center justify-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {t('secretariatLabel')}
                  </div>
                  <div className="text-xs font-semibold mt-0.5 text-white truncate max-w-[140px]">
                    {selectedFramework.secretariat}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {t('noFrameworkSelected')}
              </span>
              <span className="text-slate-400 text-xs">
                {language === 'ja'
                  ? `全世界マップ表示中（全${FRAMEWORKS.length}枠組み収録）`
                  : `Global map view active (${FRAMEWORKS.length} frameworks recorded)`}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('selectFrameworkPrompt')}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                {t('selectFrameworkDesc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* タイムライン・年スライダー */}
      {selectedFramework && (
        <TimelineSlider
          minYear={selectedFramework.establishedYear}
          maxYear={currentMaxYear}
          currentYear={selectedYear}
          onYearChange={setSelectedYear}
          milestones={milestones}
        />
      )}

      {/* 凡例 & 表示タブ切替 */}
      {selectedFramework ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* 凡例 (Legend) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 mr-1">{t('legend')}</span>
            {Object.entries(STATUS_LABELS).map(([k, v]) => {
              // 後方互換用エイリアスキーは凡例から除外
              if (k === 'ratified' || k === 'signed' || k === 'non-party') return null;

              const count = statusCounts[k] || 0;
              if (count === 0 && selectedYear === currentMaxYear && !selectedFramework.members.some(m => m.status === k)) {
                return null;
              }
              return (
                <div
                  key={k}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                    style={{ backgroundColor: v.hex }}
                  ></span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {language === 'en' ? v.labelEn : v.labelJa}
                  </span>
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[11px] ml-0.5">
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>

          {/* タブ切り替え（地図 / リスト） */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              {t('viewMapTab')}
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              {t('viewTableTab')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>{t('clickCountryHint')}</span>
          </div>
          <div className="text-slate-400 font-medium">
            {language === 'ja'
              ? `全${FRAMEWORKS.length}枠組みのデータを閲覧可能`
              : `${FRAMEWORKS.length} ${t('frameworksAvailable')}`}
          </div>
        </div>
      )}

      {/* メイン表示部（地図 or テーブル） */}
      {selectedFramework && activeTab === 'table' ? (
        <TableView
          members={computedMembership}
          frameworkName={selectedFramework.acronym}
          onSelectCountry={onSelectCountry}
        />
      ) : (
        <div className="space-y-2">
          <WorldMap
            countryDataMap={mapData}
            mode="single"
            hasFrameworkSelected={Boolean(selectedFramework)}
            onSelectCountry={onSelectCountry}
            selectedCountryAlpha3={selectedCountryAlpha3}
          />
          {selectedFramework && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-right pr-2">
              {t('smallStatesNotice')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
