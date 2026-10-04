import React, { useState, useMemo } from 'react';
import type { Country } from '../types';
import { FRAMEWORKS } from '../data/frameworks';
import { COUNTRY_BY_ALPHA3 } from '../data/countries';
import { WorldMap } from './WorldMap';
import type { CountryMapData } from './WorldMap';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CompareViewProps {
  onSelectCountry: (country: Country) => void;
  selectedCountryAlpha3?: string | null;
}

export const CompareView: React.FC<CompareViewProps> = ({
  onSelectCountry,
  selectedCountryAlpha3,
}) => {
  const { t, language } = useLanguage();
  const [frameworkAId, setFrameworkAId] = useState<string>('eu');
  const [frameworkBId, setFrameworkBId] = useState<string>('nato');
  const [filterIntersection, setFilterIntersection] = useState<'all' | 'both' | 'a_only' | 'b_only'>('all');

  const frameworkA = useMemo(() => FRAMEWORKS.find((f) => f.id === frameworkAId) || FRAMEWORKS[0], [frameworkAId]);
  const frameworkB = useMemo(() => FRAMEWORKS.find((f) => f.id === frameworkBId) || FRAMEWORKS[1], [frameworkBId]);

  // 有効な参加国コードを取得（批准または正式加盟）
  const validMembersA = useMemo(() => {
    return new Set(
      frameworkA.members
        .filter((m) => m.status === 'ratified' || m.status === 'signed' || m.status === 'candidate')
        .map((m) => m.countryCode)
    );
  }, [frameworkA]);

  const validMembersB = useMemo(() => {
    return new Set(
      frameworkB.members
        .filter((m) => m.status === 'ratified' || m.status === 'signed' || m.status === 'candidate')
        .map((m) => m.countryCode)
    );
  }, [frameworkB]);

  // 重複（積集合）、Aのみ、Bのみの分類
  const comparisonResults = useMemo(() => {
    const both: Country[] = [];
    const aOnly: Country[] = [];
    const bOnly: Country[] = [];

    const allCountryCodes = new Set([...validMembersA, ...validMembersB]);

    allCountryCodes.forEach((code) => {
      const inA = validMembersA.has(code);
      const inB = validMembersB.has(code);
      const country = COUNTRY_BY_ALPHA3[code];
      if (!country) return;

      if (inA && inB) {
        both.push(country);
      } else if (inA) {
        aOnly.push(country);
      } else if (inB) {
        bOnly.push(country);
      }
    });

    if (language === 'en') {
      both.sort((x, y) => x.nameEn.localeCompare(y.nameEn, 'en'));
      aOnly.sort((x, y) => x.nameEn.localeCompare(y.nameEn, 'en'));
      bOnly.sort((x, y) => x.nameEn.localeCompare(y.nameEn, 'en'));
    } else {
      both.sort((x, y) => x.nameJa.localeCompare(y.nameJa, 'ja'));
      aOnly.sort((x, y) => x.nameJa.localeCompare(y.nameJa, 'ja'));
      bOnly.sort((x, y) => x.nameJa.localeCompare(y.nameJa, 'ja'));
    }

    return { both, aOnly, bOnly };
  }, [validMembersA, validMembersB, language]);

  // 地図用のデータマップ
  const mapData = useMemo(() => {
    const res: Record<string, CountryMapData> = {};

    comparisonResults.both.forEach((c) => {
      res[c.alpha3] = { inFrameworkA: true, inFrameworkB: true };
    });
    comparisonResults.aOnly.forEach((c) => {
      res[c.alpha3] = { inFrameworkA: true, inFrameworkB: false };
    });
    comparisonResults.bOnly.forEach((c) => {
      res[c.alpha3] = { inFrameworkA: false, inFrameworkB: true };
    });

    return res;
  }, [comparisonResults]);

  // クイック比較プリセット
  const presets = [
    { title: 'EU × NATO', a: 'eu', b: 'nato', descJa: '欧州統合と軍事同盟の重なり', descEn: 'European integration & defense alliance' },
    { title: 'EU × EEA', a: 'eu', b: 'eea', descJa: '欧州単一市場とEFTA3カ国の統合関係', descEn: 'EU single market & EFTA integration' },
    { title: 'MERCOSUR × 太平洋同盟', a: 'mercosur', b: 'pacific-alliance', descJa: '南米大西洋側 vs 太平洋側の二大経済圏', descEn: 'Atlantic vs Pacific Latin American blocs' },
    { title: 'USMCA × CPTPP', a: 'usmca', b: 'cptpp', descJa: '北米協定 vs アジア太平洋メガFTA', descEn: 'North America vs Asia-Pacific mega-FTA' },
    { title: 'P5 × G7', a: 'p5', b: 'g7', descJa: '安保理常任理事国 vs 先進主要国', descEn: 'UNSC P5 vs Advanced G7 nations' },
    { title: 'OECD × BRICS', a: 'oecd', b: 'brics', descJa: '先進国クラブ vs 新興大国連合', descEn: 'Advanced economies vs Emerging powers' },
    { title: 'CPTPP × RCEP', a: 'cptpp', b: 'rcep', descJa: 'アジア太平洋のメガFTA比較', descEn: 'Asia-Pacific mega-FTAs compared' },
    { title: 'AUKUS × Quad', a: 'aukus', b: 'quad', descJa: 'インド太平洋の先端防衛協力', descEn: 'Indo-Pacific advanced security partnerships' },
    { title: 'G7 × BRICS', a: 'g7', b: 'brics', descJa: '主要先進国 vs 新興大国連合', descEn: 'G7 advanced nations vs BRICS powers' },
    { title: 'ICC × G7', a: 'icc', b: 'g7', descJa: '国際司法と主要国（米国の不参加）', descEn: 'International justice & G7 (US non-party)' },
    { title: 'NPT × TPNW', a: 'npt', b: 'tpnw', descJa: '核不拡散条約 vs 核兵器禁止条約', descEn: 'Non-Proliferation vs Prohibition of Nuclear Weapons' },
  ];

  return (
    <div className="space-y-6">
      {/* プリセットボタン */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {t('compareFeaturedPresets')}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.title}
              onClick={() => {
                setFrameworkAId(p.a);
                setFrameworkBId(p.b);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                frameworkAId === p.a && frameworkBId === p.b
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-900 dark:text-purple-200 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-purple-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">{p.title}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {language === 'en' ? p.descEn : p.descJa}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 枠組み選択セレクター */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 枠組みA */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border-2 border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              {language === 'ja' ? '枠組み A（青色）' : 'Framework A (Blue)'}
            </span>
          </div>
          <select
            value={frameworkAId}
            onChange={(e) => setFrameworkAId(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.acronym} - {language === 'en' ? f.nameEn : f.nameJa}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
            {frameworkA.description}
          </div>
        </div>

        {/* 枠組みB */}
        <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">
              {language === 'ja' ? '枠組み B（赤色）' : 'Framework B (Red)'}
            </span>
          </div>
          <select
            value={frameworkBId}
            onChange={(e) => setFrameworkBId(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.acronym} - {language === 'en' ? f.nameEn : f.nameJa}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
            {frameworkB.description}
          </div>
        </div>
      </div>

      {/* ベン図風サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aのみ */}
        <div
          onClick={() => setFilterIntersection(filterIntersection === 'a_only' ? 'all' : 'a_only')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterIntersection === 'a_only'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">
              {frameworkA.acronym} {t('compareAOnlyCount')}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-3xl font-black font-mono mt-2">
            {comparisonResults.aOnly.length}
            <span className="text-sm font-normal ml-1">{t('countriesSuffix')}</span>
          </div>
          <div className="text-xs opacity-75 mt-1 truncate">
            {comparisonResults.aOnly.map((c) => (language === 'en' ? c.nameEn : c.nameJa)).join(', ') || (language === 'ja' ? 'なし' : 'None')}
          </div>
        </div>

        {/* 両方に参加（積集合） */}
        <div
          onClick={() => setFilterIntersection(filterIntersection === 'both' ? 'all' : 'both')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterIntersection === 'both'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 hover:border-purple-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              ★ {language === 'ja' ? '両方に参加（重複）' : 'Both (Intersection)'}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          </div>
          <div className="text-3xl font-black font-mono mt-2 text-purple-900 dark:text-purple-100">
            {comparisonResults.both.length}
            <span className="text-sm font-normal ml-1">{t('countriesSuffix')}</span>
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-300 mt-1 truncate">
            {comparisonResults.both.map((c) => (language === 'en' ? c.nameEn : c.nameJa)).join(', ') || (language === 'ja' ? '該当なし' : 'None')}
          </div>
        </div>

        {/* Bのみ */}
        <div
          onClick={() => setFilterIntersection(filterIntersection === 'b_only' ? 'all' : 'b_only')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterIntersection === 'b_only'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">
              {frameworkB.acronym} {t('compareBOnlyCount')}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          </div>
          <div className="text-3xl font-black font-mono mt-2">
            {comparisonResults.bOnly.length}
            <span className="text-sm font-normal ml-1">{t('countriesSuffix')}</span>
          </div>
          <div className="text-xs opacity-75 mt-1 truncate">
            {comparisonResults.bOnly.map((c) => (language === 'en' ? c.nameEn : c.nameJa)).join(', ') || (language === 'ja' ? 'なし' : 'None')}
          </div>
        </div>
      </div>

      {/* 世界地図（掛け合わせオーバーレイ） */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#8b5cf6]"></span>
              {language === 'ja' ? '両方に参加' : 'Members of Both'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
              {language === 'ja' ? `${frameworkA.acronym} のみ` : `${frameworkA.acronym} only`}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
              {language === 'ja' ? `${frameworkB.acronym} のみ` : `${frameworkB.acronym} only`}
            </span>
          </div>
          <div>{t('mapClickTip')}</div>
        </div>

        <WorldMap
          countryDataMap={mapData}
          mode="compare"
          colorA="#3b82f6"
          colorB="#ef4444"
          colorBoth="#8b5cf6"
          labelA={frameworkA.acronym}
          labelB={frameworkB.acronym}
          onSelectCountry={onSelectCountry}
          selectedCountryAlpha3={selectedCountryAlpha3}
        />
      </div>

      {/* 比較国一覧タグクラウド */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>{language === 'ja' ? '重複・参加国の詳細内訳' : 'Detailed Member Breakdown'}</span>
          {filterIntersection !== 'all' && (
            <button
              onClick={() => setFilterIntersection('all')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {language === 'ja' ? 'フィルター解除（すべて表示）' : 'Clear filter (Show all)'}
            </button>
          )}
        </h3>

        {(filterIntersection === 'all' || filterIntersection === 'both') && comparisonResults.both.length > 0 && (
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <div className="text-xs font-bold text-purple-800 dark:text-purple-300 mb-2">
              ★ {language === 'ja'
                ? `${frameworkA.acronym} と ${frameworkB.acronym} の両方に参加している国（${comparisonResults.both.length}カ国）`
                : `Countries in both ${frameworkA.acronym} and ${frameworkB.acronym} (${comparisonResults.both.length} countries)`}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {comparisonResults.both.map((c) => (
                <button
                  key={c.alpha3}
                  onClick={() => onSelectCountry(c)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-xs font-semibold hover:border-purple-500 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{c.flagEmoji || '🌐'}</span>
                  <span>{language === 'en' ? c.nameEn : c.nameJa}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(filterIntersection === 'all' || filterIntersection === 'a_only') && comparisonResults.aOnly.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2">
              {language === 'ja'
                ? `${frameworkA.acronym} のみに参加している国（${comparisonResults.aOnly.length}カ国）`
                : `Countries in ${frameworkA.acronym} only (${comparisonResults.aOnly.length} countries)`}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {comparisonResults.aOnly.map((c) => (
                <button
                  key={c.alpha3}
                  onClick={() => onSelectCountry(c)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-xs font-semibold hover:border-blue-500 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{c.flagEmoji || '🌐'}</span>
                  <span>{language === 'en' ? c.nameEn : c.nameJa}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(filterIntersection === 'all' || filterIntersection === 'b_only') && comparisonResults.bOnly.length > 0 && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <div className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">
              {language === 'ja'
                ? `${frameworkB.acronym} のみに参加している国（${comparisonResults.bOnly.length}カ国）`
                : `Countries in ${frameworkB.acronym} only (${comparisonResults.bOnly.length} countries)`}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {comparisonResults.bOnly.map((c) => (
                <button
                  key={c.alpha3}
                  onClick={() => onSelectCountry(c)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 text-xs font-semibold hover:border-red-500 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{c.flagEmoji || '🌐'}</span>
                  <span>{language === 'en' ? c.nameEn : c.nameJa}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
