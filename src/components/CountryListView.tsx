import React, { useState, useMemo } from 'react';
import type { Country } from '../types';
import { COUNTRIES } from '../data/countries';
import { FRAMEWORKS } from '../data/frameworks';
import { Search, Filter, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CountryListViewProps {
  onSelectCountry: (country: Country) => void;
}

export const CountryListView: React.FC<CountryListViewProps> = ({ onSelectCountry }) => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // 地域リスト
  const regions = useMemo(() => {
    const set = new Set<string>();
    COUNTRIES.forEach((c) => {
      if (c.region && c.region !== 'その他') set.add(c.region);
    });
    return Array.from(set).sort();
  }, []);

  // 各国の参加枠組み数を事前計算
  const frameworkCountByCountry = useMemo(() => {
    const map = new Map<string, number>();
    FRAMEWORKS.forEach((f) => {
      f.members.forEach((m) => {
        map.set(m.countryCode, (map.get(m.countryCode) || 0) + 1);
      });
    });
    return map;
  }, []);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) => {
      if (c.alpha3.startsWith('C0') || c.alpha3.startsWith('C1') || c.region === 'その他') {
        // 未割り当てのジオメトリフォールバックは除外
        if (!search) return false;
      }

      if (search) {
        const q = search.toLowerCase();
        const match =
          c.nameJa.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.alpha3.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedRegion !== 'all' && c.region !== selectedRegion) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // 登録枠組み数が多い順、同じなら言語に応じた国名順
      const ca = frameworkCountByCountry.get(a.alpha3) || 0;
      const cb = frameworkCountByCountry.get(b.alpha3) || 0;
      if (cb !== ca) return cb - ca;
      return language === 'en'
        ? a.nameEn.localeCompare(b.nameEn, 'en')
        : a.nameJa.localeCompare(b.nameJa, 'ja');
    });
  }, [search, selectedRegion, frameworkCountByCountry, language]);

  return (
    <div className="space-y-6">
      {/* 検索・絞り込みツールバー */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('countryListSearch')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 地域フィルター */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('filterRegionAll')}</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 国カード一覧グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredCountries.map((country) => {
          const count = frameworkCountByCountry.get(country.alpha3) || 0;
          return (
            <div
              key={country.alpha3}
              onClick={() => onSelectCountry(country)}
              className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {country.flagEmoji || '🌐'}
                </span>
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {language === 'en' ? country.nameEn : country.nameJa}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {language === 'en' ? country.nameJa : country.nameEn} ({country.alpha3})
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {country.region}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                {count > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {count} {language === 'ja' ? '枠組み' : 'blocs'}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">{language === 'ja' ? '未登録' : 'None'}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-xs text-slate-500 pt-2">
        {language === 'ja'
          ? `計 ${filteredCountries.length} カ国・地域を表示中`
          : `Showing ${filteredCountries.length} countries & territories`}
      </div>
    </div>
  );
};

