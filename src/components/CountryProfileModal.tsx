import React, { useMemo } from 'react';
import type { Country, Framework, MembershipStatus } from '../types';
import { FRAMEWORKS, CATEGORY_LABELS, STATUS_LABELS } from '../data/frameworks';
import { X, Award } from 'lucide-react';

interface CountryProfileModalProps {
  country: Country | null;
  onClose: () => void;
  onSelectFramework: (framework: Framework) => void;
}

export const CountryProfileModal: React.FC<CountryProfileModalProps> = ({
  country,
  onClose,
  onSelectFramework,
}) => {
  if (!country) return null;

  // この国が参加している全枠組みを取得
  const joinedFrameworks = useMemo(() => {
    const list: {
      framework: Framework;
      status: MembershipStatus;
      signedYear?: number;
      ratifiedYear?: number;
      appliedYear?: number;
      withdrawnYear?: number;
      notes?: string;
    }[] = [];

    FRAMEWORKS.forEach((f) => {
      const mem = f.members.find((m) => m.countryCode === country.alpha3);
      if (mem) {
        list.push({
          framework: f,
          status: mem.status,
          signedYear: mem.signedYear,
          ratifiedYear: mem.ratifiedYear,
          appliedYear: mem.appliedYear,
          withdrawnYear: mem.withdrawnYear,
          notes: mem.notes,
        });
      }
    });

    // 加盟年順にソート
    return list.sort((a, b) => {
      const ya = a.ratifiedYear || a.signedYear || a.appliedYear || 9999;
      const yb = b.ratifiedYear || b.signedYear || b.appliedYear || 9999;
      return ya - yb;
    });
  }, [country]);

  // カテゴリ別にグルーピング
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, typeof joinedFrameworks>();
    joinedFrameworks.forEach((item) => {
      const cat = item.framework.category;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(item);
    });
    return map;
  }, [joinedFrameworks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{country.flagEmoji || '🌐'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-slate-200 font-medium">
                  {country.region}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  ISO: {country.alpha3} / {country.numeric}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                {country.nameJa}
              </h2>
              <div className="text-sm text-slate-300 font-medium">
                {country.nameEn}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダルボディ（スクロール領域） */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* サマリーバー */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Award className="w-4 h-4 text-amber-500" />
              登録データベース内での参加枠組み数
            </div>
            <div className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
              {joinedFrameworks.length}
              <span className="text-xs font-normal text-slate-500 ml-1">件</span>
            </div>
          </div>

          {joinedFrameworks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              現在、初期登録データベース内にこの国の参加枠組み情報は登録されていません。
            </div>
          ) : (
            <div className="space-y-6">
              {/* カテゴリ別参加一覧 */}
              {Array.from(groupedByCategory.entries()).map(([catKey, items]) => {
                const catMeta = CATEGORY_LABELS[catKey];
                return (
                  <div key={catKey} className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span>{catMeta ? catMeta.labelJa : catKey}</span>
                      <span className="text-slate-300 font-mono">({items.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      {items.map((item) => {
                        const statusMeta = STATUS_LABELS[item.status];
                        return (
                          <div
                            key={item.framework.id}
                            onClick={() => {
                              onSelectFramework(item.framework);
                              onClose();
                            }}
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all shadow-xs group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.framework.acronym}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.framework.nameJa}
                                  </span>
                                </div>

                                {item.notes && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.notes}
                                  </div>
                                )}
                              </div>

                              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                    statusMeta ? statusMeta.color : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {statusMeta ? statusMeta.labelJa : item.status}
                                </span>

                                <div className="text-[11px] font-mono text-slate-400">
                                  {item.ratifiedYear
                                    ? `${item.ratifiedYear}年加盟`
                                    : item.signedYear
                                    ? `${item.signedYear}年署名`
                                    : item.appliedYear
                                    ? `${item.appliedYear}年申請`
                                    : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
