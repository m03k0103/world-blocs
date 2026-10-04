import React, { useState, useMemo } from 'react';
import type { Framework, Country, MembershipStatus } from '../types';
import { FRAMEWORKS, CATEGORY_LABELS, STATUS_LABELS } from '../data/frameworks';
import { WorldMap } from './WorldMap';
import type { CountryMapData } from './WorldMap';
import { TimelineSlider } from './TimelineSlider';
import { TableView } from './TableView';
import { Map, Table, Building2, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

        // 1. 加盟申請・候補国、オブザーバー、対話パートナーの場合（ステータス種別を最優先）
        if (m.status === 'candidate' || m.status === 'observer' || m.status === 'dialogue') {
          const startYear = m.appliedYear || m.signedYear;
          if (startYear) {
            currentStatus = selectedYear >= startYear ? m.status : null;
          } else {
            currentStatus = selectedYear >= selectedFramework.establishedYear ? m.status : null;
          }
        }
        // 2. 脱退・資格停止国の場合
        else if (m.status === 'withdrawn') {
          if (m.withdrawnYear && selectedYear >= m.withdrawnYear) {
            currentStatus = 'withdrawn';
          } else if (m.ratifiedYear && selectedYear >= m.ratifiedYear) {
            // 脱退前かつ批准年以降は ratified
            currentStatus = 'ratified';
          } else if (m.signedYear && selectedYear >= m.signedYear) {
            // 脱退前かつ署名年以降は signed
            currentStatus = 'signed';
          } else {
            currentStatus = null;
          }
        }
        // 3. 正加盟・批准国 (ratified)
        else if (m.status === 'ratified') {
          if (m.ratifiedYear && selectedYear >= m.ratifiedYear) {
            currentStatus = 'ratified';
          } else if (m.signedYear && selectedYear >= m.signedYear) {
            currentStatus = 'signed';
          } else {
            currentStatus = null;
          }
        }
        // 4. 署名のみ未批准 (signed)
        else if (m.status === 'signed') {
          if (m.signedYear && selectedYear >= m.signedYear) {
            currentStatus = 'signed';
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
      res[m.countryCode] = {
        status: m.currentStatus,
        notes: m.notes,
        year: m.ratifiedYear || m.signedYear || m.appliedYear,
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

  // マイルストーンの生成
  const milestones = useMemo(() => {
    if (!selectedFramework) return [];
    const list: { year: number; label: string }[] = [];
    list.push({ year: selectedFramework.establishedYear, label: t('milestoneEstablished') });

    // 大きな加盟年を抽出
    const yearCounts: Record<number, number> = {};
    selectedFramework.members.forEach((m) => {
      if (m.ratifiedYear && m.ratifiedYear !== selectedFramework.establishedYear) {
        yearCounts[m.ratifiedYear] = (yearCounts[m.ratifiedYear] || 0) + 1;
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

          {/* 枠組みドロップダウン */}
          <div className="flex items-center gap-2 min-w-[280px]">
            <select
              value={selectedFramework?.id || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  onSelectFramework(null);
                } else {
                  const found = FRAMEWORKS.find((f) => f.id === val);
                  if (found) {
                    onSelectFramework(found);
                    setSelectedYear(currentMaxYear);
                  }
                }
              }}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">{t('frameworkPlaceholder')}</option>
              {filteredFrameworks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.acronym} - {language === 'en' ? f.nameEn : f.nameJa}
                </option>
              ))}
            </select>
            {selectedFramework && (
              <button
                type="button"
                onClick={() => onSelectFramework(null)}
                className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                title={t('clearSelection')}
              >
                {t('clearSelection')}
              </button>
            )}
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
            </div>

            {/* 右側サマリーバッジ */}
            <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex lg:flex-col gap-4 justify-around">
              <div className="text-center">
                <div className="text-xs text-blue-200 font-medium">{t('membersCount')}</div>
                <div className="text-3xl font-black font-mono mt-0.5 text-white">
                  {computedMembership.length}
                  <span className="text-sm font-normal text-blue-200 ml-1">{t('countriesSuffix')}</span>
                </div>
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
              const count = statusCounts[k] || 0;
              if (count === 0 && selectedYear === currentMaxYear && !selectedFramework.members.some(m => m.status === k)) {
                return null;
              }
              return (
                <div
                  key={k}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
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
