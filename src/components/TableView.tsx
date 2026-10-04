import React, { useState, useMemo } from 'react';
import type { MembershipRecord, Country, MembershipStatus } from '../types';
import { COUNTRY_BY_ALPHA3 } from '../data/countries';
import { STATUS_LABELS } from '../data/frameworks';
import { Search, Download, ArrowUpDown, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TableViewProps {
  members: (MembershipRecord & { currentStatus: MembershipStatus })[];
  frameworkName: string;
  onSelectCountry?: (country: Country) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  members,
  frameworkName,
  onSelectCountry,
}) => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'year' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 地域一覧
  const regions = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      const c = COUNTRY_BY_ALPHA3[m.countryCode];
      if (c?.region) set.add(c.region);
    });
    return Array.from(set).sort();
  }, [members]);

  // フィルタ & ソート
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        const c = COUNTRY_BY_ALPHA3[m.countryCode];
        if (!c) return false;

        if (search) {
          const q = search.toLowerCase();
          const matchName =
            c.nameJa.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.alpha3.toLowerCase().includes(q);
          if (!matchName) return false;
        }

        if (selectedRegion !== 'all' && c.region !== selectedRegion) {
          return false;
        }

        if (selectedStatus !== 'all' && m.currentStatus !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const ca = COUNTRY_BY_ALPHA3[a.countryCode];
        const cb = COUNTRY_BY_ALPHA3[b.countryCode];
        if (!ca || !cb) return 0;

        let diff = 0;
        if (sortField === 'name') {
          diff = language === 'en'
            ? ca.nameEn.localeCompare(cb.nameEn, 'en')
            : ca.nameJa.localeCompare(cb.nameJa, 'ja');
        } else if (sortField === 'year') {
          const ya = a.ratifiedYear || a.signedYear || a.appliedYear || 9999;
          const yb = b.ratifiedYear || b.signedYear || b.appliedYear || 9999;
          diff = ya - yb;
        } else if (sortField === 'status') {
          diff = a.currentStatus.localeCompare(b.currentStatus);
        }

        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [members, search, selectedRegion, selectedStatus, sortField, sortOrder, language]);

  const handleSort = (field: 'name' | 'year' | 'status') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CSVエクスポート
  const handleExportCSV = () => {
    const headers = language === 'ja'
      ? ['ISO3', '国名（日）', '国名（英）', '地域', 'ステータス', '加盟/批准/申請年', '備考']
      : ['ISO3', 'Name (JA)', 'Name (EN)', 'Region', 'Status', 'Year (Ratified/Signed/Applied)', 'Notes'];

    const rows = filteredMembers.map((m) => {
      const c = COUNTRY_BY_ALPHA3[m.countryCode];
      const statusLabel = STATUS_LABELS[m.currentStatus]
        ? (language === 'en' ? STATUS_LABELS[m.currentStatus].labelEn : STATUS_LABELS[m.currentStatus].labelJa)
        : m.currentStatus;

      return [
        m.countryCode,
        c?.nameJa || '',
        c?.nameEn || '',
        c?.region || '',
        statusLabel,
        m.ratifiedYear || m.signedYear || m.appliedYear || '',
        `"${(m.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${frameworkName}${t('csvFileSuffix')}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* フィルタ・検索ツールバー */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* 検索入力 */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('tableSearchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 地域フィルタ */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('filterRegionAll')}</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* ステータスフィルタ */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('filterStatusAll')}</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {language === 'en' ? v.labelEn : v.labelJa}
              </option>
            ))}
          </select>
        </div>

        {/* CSVエクスポート */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {t('exportCsv')}
        </button>
      </div>

      {/* テーブル本体 */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900/80 sticky top-0 z-10 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {t('tableThCountry')}
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3 px-4">{t('tableThRegion')}</th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {t('tableThStatus')}
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('year')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {t('tableThYear')}
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3 px-4">{t('tableThNotes')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  {t('tableEmpty')}
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const c = COUNTRY_BY_ALPHA3[m.countryCode];
                if (!c) return null;
                const statusMeta = STATUS_LABELS[m.currentStatus];

                return (
                  <tr
                    key={m.countryCode}
                    onClick={() => onSelectCountry && onSelectCountry(c)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.flagEmoji || '🌐'}</span>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {language === 'en' ? c.nameEn : c.nameJa}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {language === 'en' ? c.nameJa : c.nameEn} ({c.alpha3})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                      {c.region}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          statusMeta ? statusMeta.color : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {statusMeta
                          ? (language === 'en' ? statusMeta.labelEn : statusMeta.labelJa)
                          : m.currentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {m.ratifiedYear
                        ? `${m.ratifiedYear}${language === 'ja' ? '年' : ''}`
                        : m.signedYear
                        ? `${m.signedYear}${language === 'ja' ? '年(署名)' : ' (Signed)'}`
                        : m.appliedYear
                        ? `${m.appliedYear}${language === 'ja' ? '年(申請)' : ' (Applied)'}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {m.notes || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-right">
        {language === 'ja'
          ? `全 ${filteredMembers.length} カ国・地域を表示中`
          : `Showing ${filteredMembers.length} countries & territories`}
      </div>
    </div>
  );
};
