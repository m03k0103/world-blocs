import type { StatIndicatorId, IncomeLevelId } from '../types';

export interface IncomeLevelConfig {
  id: IncomeLevelId;
  nameJa: string;
  nameEn: string;
  shortLabelJa: string;
  shortLabelEn: string;
  color: string;
  hoverColor: string;
  descriptionJa: string;
  descriptionEn: string;
  order: number; // 4: HIC, 3: UMIC, 2: LMIC, 1: LIC
}

export const INCOME_LEVEL_CONFIG: Record<IncomeLevelId, IncomeLevelConfig> = {
  HIC: {
    id: 'HIC',
    nameJa: '高所得国',
    nameEn: 'High-Income Economies',
    shortLabelJa: '高所得',
    shortLabelEn: 'High Income',
    color: '#2563eb', // ロイヤルブルー
    hoverColor: '#1d4ed8',
    descriptionJa: 'GNI per capita $14,006以上（世界銀行基準）。主に先進国および産油国。',
    descriptionEn: 'GNI per capita of $14,006 or more. Advanced economies and high-income oil producers.',
    order: 4,
  },
  UMIC: {
    id: 'UMIC',
    nameJa: '高中所得国',
    nameEn: 'Upper-Middle-Income Economies',
    shortLabelJa: '高中所得',
    shortLabelEn: 'Upper Middle Income',
    color: '#0ea5e9', // スカイブルー
    hoverColor: '#0284c7',
    descriptionJa: 'GNI per capita $4,516〜$14,005。新興経済国（中国、ブラジル、トルコ等）。',
    descriptionEn: 'GNI per capita between $4,516 and $14,005. Emerging economies like China and Brazil.',
    order: 3,
  },
  LMIC: {
    id: 'LMIC',
    nameJa: '低中所得国',
    nameEn: 'Lower-Middle-Income Economies',
    shortLabelJa: '低中所得',
    shortLabelEn: 'Lower Middle Income',
    color: '#f59e0b', // アンバー
    hoverColor: '#d97706',
    descriptionJa: 'GNI per capita $1,146〜$4,515。発展途上経済国（インド、インドネシア等）。',
    descriptionEn: 'GNI per capita between $1,146 and $4,515. Developing economies such as India and Indonesia.',
    order: 2,
  },
  LIC: {
    id: 'LIC',
    nameJa: '低所得国',
    nameEn: 'Low-Income Economies',
    shortLabelJa: '低所得',
    shortLabelEn: 'Low Income',
    color: '#ef4444', // ローズレッド / コーラル
    hoverColor: '#dc2626',
    descriptionJa: 'GNI per capita $1,145以下。開発援助・低利融資の重点対象国。',
    descriptionEn: 'GNI per capita of $1,145 or less. Primary recipients of concessional development finance.',
    order: 1,
  },
};

export interface StatIndicatorMeta {
  id: StatIndicatorId;
  nameJa: string;
  nameEn: string;
  unitJa: string;
  unitEn: string;
  scaleType: 'log' | 'linear';
  sourceJa: string;
  sourceEn: string;
  sourceUrl: string;
  descriptionJa: string;
  descriptionEn: string;
  // カラーパレット (薄い色 -> 濃い色)
  palette: string[];
}

export const STAT_INDICATORS: Record<StatIndicatorId, StatIndicatorMeta> = {
  population: {
    id: 'population',
    nameJa: '人口',
    nameEn: 'Population',
    unitJa: '人',
    unitEn: 'people',
    scaleType: 'log',
    sourceJa: '国連人口基金 (UNFPA) / 世界銀行 (2023-2024)',
    sourceEn: 'UN Population Division / World Bank (2023-2024)',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.POP.TOTL',
    descriptionJa: '各国の総人口規模。国連および世界銀行の最新推計値に基づきます。',
    descriptionEn: 'Total population based on UN and World Bank estimates.',
    palette: ['#ecfdf5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46'],
  },
  gdp: {
    id: 'gdp',
    nameJa: '名目GDP',
    nameEn: 'Nominal GDP',
    unitJa: '百万USD',
    unitEn: 'Million USD',
    scaleType: 'log',
    sourceJa: 'IMF 世界経済見通し (WEO) / 世界銀行 (2024)',
    sourceEn: 'IMF World Economic Outlook (Oct 2024) / World Bank',
    sourceUrl: 'https://www.imf.org/en/Publications/WEO',
    descriptionJa: '各国の名目国内総生産（米ドル換算）。国の経済規模を表します。',
    descriptionEn: 'Nominal Gross Domestic Product in current US Dollars.',
    palette: ['#eff6ff', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a'],
  },
  gdp_per_capita: {
    id: 'gdp_per_capita',
    nameJa: '一人当たり名目GDP',
    nameEn: 'GDP per Capita',
    unitJa: 'USD',
    unitEn: 'USD',
    scaleType: 'log',
    sourceJa: 'IMF 世界経済見通し (WEO) / 世界銀行 (2024)',
    sourceEn: 'IMF World Economic Outlook (Oct 2024) / World Bank',
    sourceUrl: 'https://www.imf.org/en/Publications/WEO',
    descriptionJa: '国民一人当たりの名目GDP（米ドル）。国民の平均的な経済水準・所得規模を表します。',
    descriptionEn: 'Nominal GDP divided by total population in US Dollars.',
    palette: ['#f0fdf4', '#bbf7d0', '#86efac', '#38bdf8', '#3b82f6', '#6366f1', '#4f46e5', '#312e81'],
  },
  gender_gap: {
    id: 'gender_gap',
    nameJa: 'ジェンダーギャップ指数',
    nameEn: 'Gender Gap Index',
    unitJa: 'スコア (0〜1)',
    unitEn: 'Score (0-1)',
    scaleType: 'linear',
    sourceJa: '世界経済フォーラム (WEF) Global Gender Gap Report 2024',
    sourceEn: 'World Economic Forum Global Gender Gap Report 2024',
    sourceUrl: 'https://www.weforum.org/publications/global-gender-gap-report-2024/',
    descriptionJa: '経済・教育・健康・政治の4分野における男女格差を数値化した指標（1.000が完全平等）。',
    descriptionEn: 'Measures gender parity across Economic, Education, Health, and Political pillars (1.0 = parity).',
    palette: ['#fdf4ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#9333ea', '#581c87'],
  },
  income_level: {
    id: 'income_level',
    nameJa: '所得水準 (世銀分類)',
    nameEn: 'Income Group (World Bank)',
    unitJa: '区分',
    unitEn: 'Group',
    scaleType: 'linear',
    sourceJa: '世界銀行 所得水準分類 (FY2025基準)',
    sourceEn: 'World Bank Country and Lending Groups (FY2025)',
    sourceUrl: 'https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country-and-lending-groups',
    descriptionJa: '一人当たり国民総所得（GNI per capita, Atlas method）に基づく世界銀行の4段階経済分類（低所得・低中所得・高中所得・高所得）。',
    descriptionEn: 'World Bank 4-tier income classification based on GNI per capita Atlas method (LIC, LMIC, UMIC, HIC).',
    palette: ['#ef4444', '#f59e0b', '#0ea5e9', '#2563eb'],
  },
};
