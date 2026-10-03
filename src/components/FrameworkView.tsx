import React, { useState, useMemo } from 'react';
import type { Framework, Country, MembershipStatus } from '../types';
import { FRAMEWORKS, CATEGORY_LABELS, STATUS_LABELS } from '../data/frameworks';
import { WorldMap } from './WorldMap';
import type { CountryMapData } from './WorldMap';
import { TimelineSlider } from './TimelineSlider';
import { TableView } from './TableView';
import { Map, Table, Building2 } from 'lucide-react';

interface FrameworkViewProps {
  selectedFramework: Framework;
  onSelectFramework: (framework: Framework) => void;
  onSelectCountry: (country: Country) => void;
  selectedCountryAlpha3?: string | null;
}

export const FrameworkView: React.FC<FrameworkViewProps> = ({
  selectedFramework,
  onSelectFramework,
  onSelectCountry,
  selectedCountryAlpha3,
}) => {
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
    return selectedFramework.members
      .map((m) => {
        let currentStatus: MembershipStatus | null = m.status;

        // 脱退年が選択年以下の場合はwithdrawn
        if (m.withdrawnYear && selectedYear >= m.withdrawnYear) {
          currentStatus = 'withdrawn';
        } else if (m.ratifiedYear && selectedYear >= m.ratifiedYear) {
          // 批准年以降
          currentStatus = 'ratified';
        } else if (m.signedYear && selectedYear >= m.signedYear) {
          // 署名年以降、批准前
          currentStatus = 'signed';
        } else if (m.status === 'candidate' || m.status === 'observer' || m.status === 'dialogue') {
          // オブザーバー・候補等で年指定なし
          currentStatus = m.status;
        } else {
          // まだ加盟・署名していない
          currentStatus = null;
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
        year: m.ratifiedYear || m.signedYear,
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
    const list: { year: number; label: string }[] = [];
    list.push({ year: selectedFramework.establishedYear, label: '設立' });

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
        list.push({ year: Number(y), label: `+${c}カ国加盟` });
      });

    return list.sort((a, b) => a.year - b.year);
  }, [selectedFramework]);

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
              すべて表示
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
                {v.labelJa}
              </button>
            ))}
          </div>

          {/* 枠組みドロップダウン */}
          <div className="min-w-[280px]">
            <select
              value={selectedFramework.id}
              onChange={(e) => {
                const found = FRAMEWORKS.find((f) => f.id === e.target.value);
                if (found) {
                  onSelectFramework(found);
                  setSelectedYear(currentMaxYear);
                }
              }}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {filteredFrameworks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.acronym} - {f.nameJa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 枠組みヘッダー情報 */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {CATEGORY_LABELS[selectedFramework.category]?.labelJa}
              </span>
              <span className="text-blue-300 font-mono text-xs">
                設立: {selectedFramework.establishedYear}年
                {selectedFramework.inForceYear && `（発効: ${selectedFramework.inForceYear}年）`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline gap-3">
              <span>{selectedFramework.nameJa}</span>
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
              <div className="text-xs text-blue-200 font-medium">参加国・地域</div>
              <div className="text-3xl font-black font-mono mt-0.5 text-white">
                {computedMembership.length}
                <span className="text-sm font-normal text-blue-200 ml-1">カ国</span>
              </div>
            </div>
            {selectedFramework.secretariat && (
              <div className="text-center lg:border-t lg:border-white/10 lg:pt-3">
                <div className="text-xs text-blue-200 font-medium flex items-center justify-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  事務局
                </div>
                <div className="text-xs font-semibold mt-0.5 text-white truncate max-w-[140px]">
                  {selectedFramework.secretariat}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* タイムライン・年スライダー */}
      <TimelineSlider
        minYear={selectedFramework.establishedYear}
        maxYear={currentMaxYear}
        currentYear={selectedYear}
        onYearChange={setSelectedYear}
        milestones={milestones}
      />

      {/* 凡例 & 表示タブ切替 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* 凡例 (Legend) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 mr-1">凡例:</span>
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
                  {v.labelJa}
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            地図で見る
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            リスト一覧
          </button>
        </div>
      </div>

      {/* メイン表示部（地図 or テーブル） */}
      {activeTab === 'map' ? (
        <WorldMap
          countryDataMap={mapData}
          mode="single"
          onSelectCountry={onSelectCountry}
          selectedCountryAlpha3={selectedCountryAlpha3}
        />
      ) : (
        <TableView
          members={computedMembership}
          frameworkName={selectedFramework.acronym}
          onSelectCountry={onSelectCountry}
        />
      )}
    </div>
  );
};
