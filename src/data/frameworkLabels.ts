import type { FrameworkType } from '../types';

/**
 * 枠組みの5大カテゴリ表示ラベルおよびバッジスタイル定義
 */
export const CATEGORY_LABELS: Record<string, { labelJa: string; labelEn: string; badgeColor: string }> = {
  security: {
    labelJa: '安全保障',
    labelEn: 'Security & Defense',
    badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  economic: {
    labelJa: '経済・通商',
    labelEn: 'Economy & Trade',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  regional: {
    labelJa: '地域統合',
    labelEn: 'Regional Blocs',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  summit: {
    labelJa: '首脳・戦略対話',
    labelEn: 'Summits & Strategic Dialogue',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  global_treaty: {
    labelJa: '国際法・条約',
    labelEn: 'Global Treaties & Law',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
};

/**
 * 枠組みの法的・制度的性質（Schema 2.0）表示ラベルおよびバッジスタイル定義
 */
export const FRAMEWORK_TYPE_LABELS: Record<FrameworkType, { labelJa: string; labelEn: string; badgeColor: string }> = {
  treaty: {
    labelJa: '国際条約',
    labelEn: 'Treaty',
    badgeColor: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30',
  },
  international_org: {
    labelJa: '国際機関',
    labelEn: 'Intl Org',
    badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/30',
  },
  regional_integration: {
    labelJa: '地域統合体',
    labelEn: 'Regional Integration',
    badgeColor: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/30',
  },
  summit_forum: {
    labelJa: '首脳協議',
    labelEn: 'Summit Forum',
    badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/30',
  },
  political_dialogue: {
    labelJa: '政治対話',
    labelEn: 'Political Dialogue',
    badgeColor: 'bg-rose-500/30 text-rose-200 border-rose-400/30',
  },
};

/**
 * 加盟・締約・参加ステータス表示ラベル、Tailwindバッジカラー、および地図用HEXカラーコード
 */
export const STATUS_LABELS: Record<string, { labelJa: string; labelEn: string; color: string; hex: string }> = {
  member: {
    labelJa: '正式加盟・メンバー',
    labelEn: 'Member',
    color: 'bg-blue-600 text-white',
    hex: '#2563eb',
  },
  party: {
    labelJa: '条約締約国',
    labelEn: 'State Party',
    color: 'bg-indigo-600 text-white',
    hex: '#4f46e5',
  },
  participating_state: {
    labelJa: '参加国',
    labelEn: 'Participating State',
    color: 'bg-sky-600 text-white',
    hex: '#0284c7',
  },
  non_state_member: {
    labelJa: '非国家参加者',
    labelEn: 'Non-State Participant',
    color: 'bg-purple-600 text-white',
    hex: '#8b5cf6',
  },
  non_state_party: {
    labelJa: '非国家参加者',
    labelEn: 'Non-State Participant',
    color: 'bg-purple-600 text-white',
    hex: '#8b5cf6',
  },
  signatory: {
    labelJa: '署名国（未発効・未批准）',
    labelEn: 'Signatory',
    color: 'bg-sky-400 text-white',
    hex: '#38bdf8',
  },
  candidate: {
    labelJa: '加盟候補国',
    labelEn: 'Candidate / Applicant',
    color: 'bg-emerald-500 text-white',
    hex: '#10b981',
  },
  partner: {
    labelJa: 'パートナー国',
    labelEn: 'Partner Country',
    color: 'bg-violet-500 text-white',
    hex: '#8b5cf6',
  },
  dialogue: {
    labelJa: '対話パートナー',
    labelEn: 'Dialogue Partner',
    color: 'bg-violet-400 text-white',
    hex: '#a78bfa',
  },
  observer: {
    labelJa: 'オブザーバー',
    labelEn: 'Observer',
    color: 'bg-amber-500 text-white',
    hex: '#f59e0b',
  },
  suspended: {
    labelJa: '参加資格停止',
    labelEn: 'Suspended',
    color: 'bg-amber-700 text-white',
    hex: '#b45309',
  },
  withdrawn: {
    labelJa: '脱退国',
    labelEn: 'Withdrawn',
    color: 'bg-slate-500 text-white',
    hex: '#64748b',
  },
  non_party: {
    labelJa: '未締結・非当事国',
    labelEn: 'Non-Party',
    color: 'bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    hex: '#94a3b8',
  },
  unsigned: {
    labelJa: '署名撤回（批准意思放棄）',
    labelEn: 'Unsigned / Not Ratifying',
    color: 'bg-rose-500 text-white',
    hex: '#f43f5e',
  },

  // 後方互換用エイリアス
  ratified: {
    labelJa: '批准・受諾',
    labelEn: 'Ratified / Accepted',
    color: 'bg-indigo-600 text-white',
    hex: '#4f46e5',
  },
  signed: {
    labelJa: '署名のみ（未批准）',
    labelEn: 'Signatory only',
    color: 'bg-sky-400 text-white',
    hex: '#38bdf8',
  },
  'non-party': {
    labelJa: '未締結・非当事国',
    labelEn: 'Non-Party',
    color: 'bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    hex: '#94a3b8',
  },
};
