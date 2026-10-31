// 国別統計マスタデータ（人口・名目GDP・一人当たりGDP・ジェンダーギャップ指数）
// 一次資料・出典:
// - 人口: 国連 World Population Prospects / 世界銀行 (2023-2024)
// - 名目GDP / 一人当たりGDP: IMF World Economic Outlook (2024) / 世界銀行
// - ジェンダーギャップ指数: 世界経済フォーラム (WEF) Global Gender Gap Report 2024 (146カ国)
import type { CountryStatRecord, StatIndicatorId } from '../types';

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
};

export const COUNTRY_STATS: Record<string, CountryStatRecord> = {
  "BHS": {
    "alpha3": "BHS",
    "population": 412623,
    "gdp": 14390,
    "gdpPerCapita": 34875,
    "year": 2024
  },
  "BEN": {
    "alpha3": "BEN",
    "population": 13712828,
    "gdp": 21371,
    "gdpPerCapita": 1558,
    "genderGapScore": 0.644,
    "genderGapRank": 133,
    "year": 2024
  },
  "BFA": {
    "alpha3": "BFA",
    "population": 23251485,
    "gdp": 21902,
    "gdpPerCapita": 942,
    "genderGapScore": 0.64,
    "genderGapRank": 130,
    "year": 2024
  },
  "FLK": {
    "alpha3": "FLK",
    "population": 50000,
    "gdp": 500,
    "gdpPerCapita": 10000,
    "year": 2024
  },
  "GMB": {
    "alpha3": "GMB",
    "population": 2773168,
    "gdp": 2514,
    "gdpPerCapita": 907,
    "genderGapScore": 0.638,
    "genderGapRank": 119,
    "year": 2024
  },
  "GIN": {
    "alpha3": "GIN",
    "population": 14190612,
    "gdp": 25476,
    "gdpPerCapita": 1795,
    "genderGapScore": 0.614,
    "genderGapRank": 138,
    "year": 2024
  },
  "GNB": {
    "alpha3": "GNB",
    "population": 2150842,
    "gdp": 2151,
    "gdpPerCapita": 1000,
    "year": 2024
  },
  "LBR": {
    "alpha3": "LBR",
    "population": 5418377,
    "gdp": 4754,
    "gdpPerCapita": 877,
    "genderGapScore": 0.76,
    "genderGapRank": 46,
    "year": 2024
  },
  "PRI": {
    "alpha3": "PRI",
    "population": 3205691,
    "gdp": 120838,
    "gdpPerCapita": 37695,
    "year": 2024
  },
  "SLE": {
    "alpha3": "SLE",
    "population": 8791092,
    "gdp": 4558,
    "gdpPerCapita": 518,
    "genderGapScore": 0.667,
    "genderGapRank": 113,
    "year": 2024
  },
  "TGO": {
    "alpha3": "TGO",
    "population": 9053799,
    "gdp": 9832,
    "gdpPerCapita": 1086,
    "genderGapScore": 0.706,
    "genderGapRank": 92,
    "year": 2024
  },
  "ISL": {
    "alpha3": "ISL",
    "population": 393600,
    "gdp": 33338,
    "gdpPerCapita": 84594,
    "genderGapScore": 0.935,
    "genderGapRank": 1,
    "year": 2024
  },
  "IRL": {
    "alpha3": "IRL",
    "population": 5395790,
    "gdp": 609157,
    "gdpPerCapita": 112895,
    "genderGapScore": 0.802,
    "genderGapRank": 9,
    "year": 2024
  },
  "AZE": {
    "alpha3": "AZE",
    "population": 10145212,
    "gdp": 75641,
    "gdpPerCapita": 7456,
    "genderGapScore": 0.655,
    "genderGapRank": 121,
    "year": 2024
  },
  "AFG": {
    "alpha3": "AFG",
    "population": 42239854,
    "gdp": 14500,
    "gdpPerCapita": 343,
    "genderGapScore": 0.405,
    "genderGapRank": 146,
    "year": 2024
  },
  "USA": {
    "alpha3": "USA",
    "population": 340003797,
    "gdp": 29298013,
    "gdpPerCapita": 86170,
    "genderGapScore": 0.748,
    "genderGapRank": 43,
    "year": 2024
  },
  "ARE": {
    "alpha3": "ARE",
    "population": 10986400,
    "gdp": 552325,
    "gdpPerCapita": 50274,
    "genderGapScore": 0.741,
    "genderGapRank": 74,
    "year": 2024
  },
  "DZA": {
    "alpha3": "DZA",
    "population": 45606480,
    "gdp": 266780,
    "gdpPerCapita": 5850,
    "genderGapScore": 0.636,
    "genderGapRank": 140,
    "year": 2024
  },
  "ARG": {
    "alpha3": "ARG",
    "population": 45696159,
    "gdp": 638365,
    "gdpPerCapita": 13970,
    "genderGapScore": 0.757,
    "genderGapRank": 56,
    "year": 2024
  },
  "ALB": {
    "alpha3": "ALB",
    "population": 2761785,
    "gdp": 25297,
    "gdpPerCapita": 9110,
    "genderGapScore": 0.786,
    "genderGapRank": 17,
    "year": 2024
  },
  "ARM": {
    "alpha3": "ARM",
    "population": 2777970,
    "gdp": 25408,
    "gdpPerCapita": 8716,
    "genderGapScore": 0.721,
    "genderGapRank": 64,
    "year": 2024
  },
  "AGO": {
    "alpha3": "AGO",
    "population": 36684202,
    "gdp": 113286,
    "gdpPerCapita": 3088,
    "genderGapScore": 0.656,
    "genderGapRank": 120,
    "year": 2024
  },
  "YEM": {
    "alpha3": "YEM",
    "population": 34449825,
    "gdp": 16940,
    "gdpPerCapita": 492,
    "year": 2024
  },
  "GBR": {
    "alpha3": "GBR",
    "population": 69281000,
    "gdp": 3695540,
    "gdpPerCapita": 53341,
    "genderGapScore": 0.789,
    "genderGapRank": 15,
    "year": 2024
  },
  "ISR": {
    "alpha3": "ISR",
    "population": 10002200,
    "gdp": 542284,
    "gdpPerCapita": 54217,
    "genderGapScore": 0.72,
    "genderGapRank": 91,
    "year": 2024
  },
  "ITA": {
    "alpha3": "ITA",
    "population": 58952704,
    "gdp": 2383436,
    "gdpPerCapita": 40430,
    "genderGapScore": 0.703,
    "genderGapRank": 87,
    "year": 2024
  },
  "IRQ": {
    "alpha3": "IRQ",
    "population": 45504560,
    "gdp": 265894,
    "gdpPerCapita": 5843,
    "year": 2024
  },
  "IRN": {
    "alpha3": "IRN",
    "population": 89172767,
    "gdp": 463499,
    "gdpPerCapita": 5198,
    "genderGapScore": 0.582,
    "genderGapRank": 143,
    "year": 2024
  },
  "IND": {
    "alpha3": "IND",
    "population": 1450935791,
    "gdp": 3760813,
    "gdpPerCapita": 2592,
    "genderGapScore": 0.641,
    "genderGapRank": 129,
    "year": 2024
  },
  "IDN": {
    "alpha3": "IDN",
    "population": 283487931,
    "gdp": 1396302,
    "gdpPerCapita": 4925,
    "genderGapScore": 0.697,
    "genderGapRank": 100,
    "year": 2024
  },
  "UGA": {
    "alpha3": "UGA",
    "population": 48582334,
    "gdp": 53896,
    "gdpPerCapita": 1109,
    "genderGapScore": 0.724,
    "genderGapRank": 78,
    "year": 2024
  },
  "UKR": {
    "alpha3": "UKR",
    "population": 37000000,
    "gdp": 188943,
    "gdpPerCapita": 5106,
    "genderGapScore": 0.725,
    "genderGapRank": 62,
    "year": 2024
  },
  "UZB": {
    "alpha3": "UZB",
    "population": 36412350,
    "gdp": 112659,
    "gdpPerCapita": 3094,
    "year": 2024
  },
  "URY": {
    "alpha3": "URY",
    "population": 3423108,
    "gdp": 82605,
    "gdpPerCapita": 24131,
    "genderGapScore": 0.714,
    "genderGapRank": 81,
    "year": 2024
  },
  "ECU": {
    "alpha3": "ECU",
    "population": 18197622,
    "gdp": 121592,
    "gdpPerCapita": 6682,
    "genderGapScore": 0.749,
    "genderGapRank": 47,
    "year": 2024
  },
  "EGY": {
    "alpha3": "EGY",
    "population": 116538258,
    "gdp": 389060,
    "gdpPerCapita": 3338,
    "genderGapScore": 0.635,
    "genderGapRank": 135,
    "year": 2024
  },
  "EST": {
    "alpha3": "EST",
    "population": 1365884,
    "gdp": 43486,
    "gdpPerCapita": 31855,
    "genderGapScore": 0.775,
    "genderGapRank": 23,
    "year": 2024
  },
  "SWZ": {
    "alpha3": "SWZ",
    "population": 1210822,
    "gdp": 5085,
    "gdpPerCapita": 4199,
    "genderGapScore": 0.718,
    "genderGapRank": 80,
    "year": 2024
  },
  "ETH": {
    "alpha3": "ETH",
    "population": 126527060,
    "gdp": 205130,
    "gdpPerCapita": 1621,
    "genderGapScore": 0.71,
    "genderGapRank": 75,
    "year": 2024
  },
  "ERI": {
    "alpha3": "ERI",
    "population": 3748901,
    "gdp": 2383,
    "gdpPerCapita": 636,
    "year": 2024
  },
  "SLV": {
    "alpha3": "SLV",
    "population": 6364943,
    "gdp": 35333,
    "gdpPerCapita": 5551,
    "genderGapScore": 0.714,
    "genderGapRank": 71,
    "year": 2024
  },
  "AUS": {
    "alpha3": "AUS",
    "population": 27194286,
    "gdp": 1757022,
    "gdpPerCapita": 64610,
    "genderGapScore": 0.78,
    "genderGapRank": 24,
    "year": 2024
  },
  "AUT": {
    "alpha3": "AUT",
    "population": 9177982,
    "gdp": 534791,
    "gdpPerCapita": 58269,
    "genderGapScore": 0.784,
    "genderGapRank": 21,
    "year": 2024
  },
  "OMN": {
    "alpha3": "OMN",
    "population": 4644384,
    "gdp": 111311,
    "gdpPerCapita": 23967,
    "genderGapScore": 0.614,
    "genderGapRank": 142,
    "year": 2024
  },
  "NLD": {
    "alpha3": "NLD",
    "population": 17993485,
    "gdp": 1213936,
    "gdpPerCapita": 67465,
    "genderGapScore": 0.788,
    "genderGapRank": 28,
    "year": 2024
  },
  "GHA": {
    "alpha3": "GHA",
    "population": 34121985,
    "gdp": 75244,
    "gdpPerCapita": 2205,
    "genderGapScore": 0.698,
    "genderGapRank": 104,
    "year": 2024
  },
  "GUY": {
    "alpha3": "GUY",
    "population": 813834,
    "gdp": 21822,
    "gdpPerCapita": 26814,
    "year": 2024
  },
  "KAZ": {
    "alpha3": "KAZ",
    "population": 20592571,
    "gdp": 291480,
    "gdpPerCapita": 14155,
    "genderGapScore": 0.71,
    "genderGapRank": 76,
    "year": 2024
  },
  "QAT": {
    "alpha3": "QAT",
    "population": 2716391,
    "gdp": 221404,
    "gdpPerCapita": 81491,
    "genderGapScore": 0.627,
    "genderGapRank": 139,
    "year": 2024
  },
  "CAN": {
    "alpha3": "CAN",
    "population": 41262329,
    "gdp": 2270076,
    "gdpPerCapita": 55016,
    "genderGapScore": 0.772,
    "genderGapRank": 36,
    "year": 2024
  },
  "GAB": {
    "alpha3": "GAB",
    "population": 2436566,
    "gdp": 21013,
    "gdpPerCapita": 8624,
    "year": 2024
  },
  "CMR": {
    "alpha3": "CMR",
    "population": 28647560,
    "gdp": 53205,
    "gdpPerCapita": 1857,
    "genderGapScore": 0.672,
    "genderGapRank": 112,
    "year": 2024
  },
  "KHM": {
    "alpha3": "KHM",
    "population": 16944826,
    "gdp": 35168,
    "gdpPerCapita": 2075,
    "genderGapScore": 0.686,
    "genderGapRank": 102,
    "year": 2024
  },
  "CYP": {
    "alpha3": "CYP",
    "population": 1251488,
    "gdp": 34220,
    "gdpPerCapita": 37136,
    "genderGapScore": 0.678,
    "genderGapRank": 106,
    "year": 2024
  },
  "CUB": {
    "alpha3": "CUB",
    "population": 11194449,
    "gdp": 107352,
    "gdpPerCapita": 9590,
    "year": 2024
  },
  "GRC": {
    "alpha3": "GRC",
    "population": 10405134,
    "gdp": 256238,
    "gdpPerCapita": 24626,
    "genderGapScore": 0.698,
    "genderGapRank": 93,
    "year": 2024
  },
  "KGZ": {
    "alpha3": "KGZ",
    "population": 7037590,
    "gdp": 15307,
    "gdpPerCapita": 2175,
    "genderGapScore": 0.697,
    "genderGapRank": 86,
    "year": 2024
  },
  "GTM": {
    "alpha3": "GTM",
    "population": 18092026,
    "gdp": 110035,
    "gdpPerCapita": 6082,
    "genderGapScore": 0.664,
    "genderGapRank": 115,
    "year": 2024
  },
  "KWT": {
    "alpha3": "KWT",
    "population": 4310108,
    "gdp": 160395,
    "gdpPerCapita": 37214,
    "genderGapScore": 0.631,
    "genderGapRank": 137,
    "year": 2024
  },
  "GRL": {
    "alpha3": "GRL",
    "population": 50000,
    "gdp": 500,
    "gdpPerCapita": 10000,
    "year": 2024
  },
  "HRV": {
    "alpha3": "HRV",
    "population": 3855641,
    "gdp": 88843,
    "gdpPerCapita": 22966,
    "genderGapScore": 0.73,
    "genderGapRank": 59,
    "year": 2024
  },
  "KEN": {
    "alpha3": "KEN",
    "population": 55100586,
    "gdp": 116321,
    "gdpPerCapita": 2111,
    "genderGapScore": 0.718,
    "genderGapRank": 77,
    "year": 2024
  },
  "CIV": {
    "alpha3": "CIV",
    "population": 31165654,
    "gdp": 86911,
    "gdpPerCapita": 2789,
    "year": 2024
  },
  "CRI": {
    "alpha3": "CRI",
    "population": 5212173,
    "gdp": 96058,
    "gdpPerCapita": 18430,
    "genderGapScore": 0.793,
    "genderGapRank": 35,
    "year": 2024
  },
  "COM": {
    "alpha3": "COM",
    "population": 852075,
    "gdp": 1422,
    "gdpPerCapita": 1669,
    "genderGapScore": 0.631,
    "genderGapRank": 136,
    "year": 2024
  },
  "COL": {
    "alpha3": "COL",
    "population": 52886363,
    "gdp": 420504,
    "gdpPerCapita": 7951,
    "genderGapScore": 0.758,
    "genderGapRank": 32,
    "year": 2024
  },
  "COG": {
    "alpha3": "COG",
    "population": 6106869,
    "gdp": 15501,
    "gdpPerCapita": 2538,
    "year": 2024
  },
  "COD": {
    "alpha3": "COD",
    "population": 102262808,
    "gdp": 73760,
    "gdpPerCapita": 721,
    "genderGapScore": 0.612,
    "genderGapRank": 141,
    "year": 2024
  },
  "SAU": {
    "alpha3": "SAU",
    "population": 35300280,
    "gdp": 1254141,
    "gdpPerCapita": 35528,
    "genderGapScore": 0.64,
    "genderGapRank": 131,
    "year": 2024
  },
  "ZMB": {
    "alpha3": "ZMB",
    "population": 20569737,
    "gdp": 29872,
    "gdpPerCapita": 1452,
    "genderGapScore": 0.689,
    "genderGapRank": 85,
    "year": 2024
  },
  "DJI": {
    "alpha3": "DJI",
    "population": 1136455,
    "gdp": 4364,
    "gdpPerCapita": 3840,
    "year": 2024
  },
  "JAM": {
    "alpha3": "JAM",
    "population": 2825544,
    "gdp": 20098,
    "gdpPerCapita": 7113,
    "genderGapScore": 0.756,
    "genderGapRank": 41,
    "year": 2024
  },
  "GEO": {
    "alpha3": "GEO",
    "population": 3712500,
    "gdp": 32865,
    "gdpPerCapita": 8852,
    "genderGapScore": 0.734,
    "genderGapRank": 55,
    "year": 2024
  },
  "SYR": {
    "alpha3": "SYR",
    "population": 23227014,
    "gdp": 9000,
    "gdpPerCapita": 387,
    "year": 2024
  },
  "SGP": {
    "alpha3": "SGP",
    "population": 6036860,
    "gdp": 572877,
    "gdpPerCapita": 94897,
    "genderGapScore": 0.739,
    "genderGapRank": 49,
    "year": 2024
  },
  "ZWE": {
    "alpha3": "ZWE",
    "population": 16665409,
    "gdp": 35919,
    "gdpPerCapita": 2155,
    "genderGapScore": 0.727,
    "genderGapRank": 45,
    "year": 2024
  },
  "CHE": {
    "alpha3": "CHE",
    "population": 9005582,
    "gdp": 969920,
    "gdpPerCapita": 107702,
    "genderGapScore": 0.795,
    "genderGapRank": 18,
    "year": 2024
  },
  "SWE": {
    "alpha3": "SWE",
    "population": 10569709,
    "gdp": 604827,
    "gdpPerCapita": 57223,
    "genderGapScore": 0.816,
    "genderGapRank": 5,
    "year": 2024
  },
  "SDN": {
    "alpha3": "SDN",
    "population": 48109006,
    "gdp": 26865,
    "gdpPerCapita": 558,
    "genderGapScore": 0.568,
    "genderGapRank": 144,
    "year": 2024
  },
  "ESP": {
    "alpha3": "ESP",
    "population": 48848840,
    "gdp": 1725672,
    "gdpPerCapita": 35327,
    "genderGapScore": 0.791,
    "genderGapRank": 10,
    "year": 2024
  },
  "SUR": {
    "alpha3": "SUR",
    "population": 623236,
    "gdp": 4337,
    "gdpPerCapita": 6959,
    "genderGapScore": 0.725,
    "genderGapRank": 60,
    "year": 2024
  },
  "LKA": {
    "alpha3": "LKA",
    "population": 22037000,
    "gdp": 84357,
    "gdpPerCapita": 3828,
    "genderGapScore": 0.658,
    "genderGapRank": 122,
    "year": 2024
  },
  "SVK": {
    "alpha3": "SVK",
    "population": 5424687,
    "gdp": 140808,
    "gdpPerCapita": 25935,
    "genderGapScore": 0.714,
    "genderGapRank": 63,
    "year": 2024
  },
  "SVN": {
    "alpha3": "SVN",
    "population": 2116972,
    "gdp": 72101,
    "gdpPerCapita": 34026,
    "genderGapScore": 0.75,
    "genderGapRank": 39,
    "year": 2024
  },
  "SEN": {
    "alpha3": "SEN",
    "population": 17763163,
    "gdp": 35450,
    "gdpPerCapita": 1996,
    "genderGapScore": 0.684,
    "genderGapRank": 105,
    "year": 2024
  },
  "SRB": {
    "alpha3": "SRB",
    "population": 6605168,
    "gdp": 81800,
    "gdpPerCapita": 12384,
    "genderGapScore": 0.73,
    "genderGapRank": 58,
    "year": 2024
  },
  "SOM": {
    "alpha3": "SOM",
    "population": 18143378,
    "gdp": 12804,
    "gdpPerCapita": 706,
    "year": 2024
  },
  "SLB": {
    "alpha3": "SLB",
    "population": 740424,
    "gdp": 1700,
    "gdpPerCapita": 2296,
    "year": 2024
  },
  "THA": {
    "alpha3": "THA",
    "population": 71668011,
    "gdp": 529386,
    "gdpPerCapita": 7387,
    "genderGapScore": 0.711,
    "genderGapRank": 65,
    "year": 2024
  },
  "TJK": {
    "alpha3": "TJK",
    "population": 10143543,
    "gdp": 13753,
    "gdpPerCapita": 1356,
    "genderGapScore": 0.672,
    "genderGapRank": 111,
    "year": 2024
  },
  "TZA": {
    "alpha3": "TZA",
    "population": 67438106,
    "gdp": 85980,
    "gdpPerCapita": 1275,
    "genderGapScore": 0.723,
    "genderGapRank": 68,
    "year": 2024
  },
  "CZE": {
    "alpha3": "CZE",
    "population": 10905028,
    "gdp": 347083,
    "gdpPerCapita": 31828,
    "genderGapScore": 0.702,
    "genderGapRank": 88,
    "year": 2024
  },
  "TCD": {
    "alpha3": "TCD",
    "population": 18278568,
    "gdp": 13149,
    "gdpPerCapita": 719,
    "genderGapScore": 0.58,
    "genderGapRank": 143,
    "year": 2024
  },
  "TUN": {
    "alpha3": "TUN",
    "population": 12458223,
    "gdp": 54708,
    "gdpPerCapita": 4391,
    "genderGapScore": 0.642,
    "genderGapRank": 128,
    "year": 2024
  },
  "CHL": {
    "alpha3": "CHL",
    "population": 19764771,
    "gdp": 329261,
    "gdpPerCapita": 16659,
    "genderGapScore": 0.781,
    "genderGapRank": 21,
    "year": 2024
  },
  "DNK": {
    "alpha3": "DNK",
    "population": 5976992,
    "gdp": 424525,
    "gdpPerCapita": 71026,
    "genderGapScore": 0.804,
    "genderGapRank": 14,
    "year": 2024
  },
  "DEU": {
    "alpha3": "DEU",
    "population": 83516593,
    "gdp": 4685593,
    "gdpPerCapita": 56104,
    "genderGapScore": 0.81,
    "genderGapRank": 6,
    "year": 2024
  },
  "DOM": {
    "alpha3": "DOM",
    "population": 11332972,
    "gdp": 126114,
    "gdpPerCapita": 11128,
    "genderGapScore": 0.704,
    "genderGapRank": 83,
    "year": 2024
  },
  "TTO": {
    "alpha3": "TTO",
    "population": 1534937,
    "gdp": 28140,
    "gdpPerCapita": 18333,
    "year": 2024
  },
  "TKM": {
    "alpha3": "TKM",
    "population": 6516100,
    "gdp": 83884,
    "gdpPerCapita": 12873,
    "year": 2024
  },
  "TUR": {
    "alpha3": "TUR",
    "population": 85518661,
    "gdp": 1359124,
    "gdpPerCapita": 15893,
    "genderGapScore": 0.644,
    "genderGapRank": 127,
    "year": 2024
  },
  "NGA": {
    "alpha3": "NGA",
    "population": 232679478,
    "gdp": 252262,
    "gdpPerCapita": 1084,
    "genderGapScore": 0.65,
    "genderGapRank": 125,
    "year": 2024
  },
  "NAM": {
    "alpha3": "NAM",
    "population": 2604172,
    "gdp": 13374,
    "gdpPerCapita": 5136,
    "genderGapScore": 0.805,
    "genderGapRank": 8,
    "year": 2024
  },
  "NIC": {
    "alpha3": "NIC",
    "population": 7046310,
    "gdp": 18829,
    "gdpPerCapita": 2672,
    "genderGapScore": 0.811,
    "genderGapRank": 7,
    "year": 2024
  },
  "NER": {
    "alpha3": "NER",
    "population": 27202843,
    "gdp": 19629,
    "gdpPerCapita": 722,
    "genderGapScore": 0.631,
    "genderGapRank": 134,
    "year": 2024
  },
  "NCL": {
    "alpha3": "NCL",
    "population": 50000,
    "gdp": 500,
    "gdpPerCapita": 10000,
    "year": 2024
  },
  "NZL": {
    "alpha3": "NZL",
    "population": 5290000,
    "gdp": 261497,
    "gdpPerCapita": 49432,
    "genderGapScore": 0.835,
    "genderGapRank": 4,
    "year": 2024
  },
  "NPL": {
    "alpha3": "NPL",
    "population": 30896590,
    "gdp": 43665,
    "gdpPerCapita": 1413,
    "genderGapScore": 0.663,
    "genderGapRank": 117,
    "year": 2024
  },
  "NOR": {
    "alpha3": "NOR",
    "population": 5572279,
    "gdp": 500886,
    "gdpPerCapita": 89889,
    "genderGapScore": 0.875,
    "genderGapRank": 2,
    "year": 2024
  },
  "BHR": {
    "alpha3": "BHR",
    "population": 1577000,
    "gdp": 47844,
    "gdpPerCapita": 30339,
    "genderGapScore": 0.666,
    "genderGapRank": 116,
    "year": 2024
  },
  "HTI": {
    "alpha3": "HTI",
    "population": 11724763,
    "gdp": 24046,
    "gdpPerCapita": 2051,
    "year": 2024
  },
  "PAK": {
    "alpha3": "PAK",
    "population": 251269164,
    "gdp": 371747,
    "gdpPerCapita": 1479,
    "genderGapScore": 0.57,
    "genderGapRank": 145,
    "year": 2024
  },
  "PAN": {
    "alpha3": "PAN",
    "population": 4468087,
    "gdp": 87347,
    "gdpPerCapita": 19549,
    "genderGapScore": 0.741,
    "genderGapRank": 52,
    "year": 2024
  },
  "VUT": {
    "alpha3": "VUT",
    "population": 334506,
    "gdp": 1126,
    "gdpPerCapita": 3366,
    "genderGapScore": 0.67,
    "genderGapRank": 109,
    "year": 2024
  },
  "PNG": {
    "alpha3": "PNG",
    "population": 10329931,
    "gdp": 31716,
    "gdpPerCapita": 3070,
    "year": 2024
  },
  "PRY": {
    "alpha3": "PRY",
    "population": 6861524,
    "gdp": 45817,
    "gdpPerCapita": 6677,
    "genderGapScore": 0.721,
    "genderGapRank": 70,
    "year": 2024
  },
  "PSE": {
    "alpha3": "PSE",
    "population": 5483450,
    "gdp": 17396,
    "gdpPerCapita": 3172,
    "year": 2024
  },
  "HUN": {
    "alpha3": "HUN",
    "population": 9597085,
    "gdp": 223413,
    "gdpPerCapita": 23319,
    "genderGapScore": 0.686,
    "genderGapRank": 101,
    "year": 2024
  },
  "BGD": {
    "alpha3": "BGD",
    "population": 173562364,
    "gdp": 450119,
    "gdpPerCapita": 2593,
    "genderGapScore": 0.689,
    "genderGapRank": 99,
    "year": 2024
  },
  "FJI": {
    "alpha3": "FJI",
    "population": 936375,
    "gdp": 5801,
    "gdpPerCapita": 6195,
    "genderGapScore": 0.655,
    "genderGapRank": 121,
    "year": 2024
  },
  "PHL": {
    "alpha3": "PHL",
    "population": 115843670,
    "gdp": 461671,
    "gdpPerCapita": 3985,
    "genderGapScore": 0.779,
    "genderGapRank": 25,
    "year": 2024
  },
  "FIN": {
    "alpha3": "FIN",
    "population": 5619911,
    "gdp": 298729,
    "gdpPerCapita": 53156,
    "genderGapScore": 0.875,
    "genderGapRank": 3,
    "year": 2024
  },
  "BTN": {
    "alpha3": "BTN",
    "population": 787424,
    "gdp": 3110,
    "gdpPerCapita": 3950,
    "genderGapScore": 0.695,
    "genderGapRank": 103,
    "year": 2024
  },
  "BRA": {
    "alpha3": "BRA",
    "population": 211998573,
    "gdp": 2185822,
    "gdpPerCapita": 10311,
    "genderGapScore": 0.696,
    "genderGapRank": 57,
    "year": 2024
  },
  "FRA": {
    "alpha3": "FRA",
    "population": 68551653,
    "gdp": 3160443,
    "gdpPerCapita": 46103,
    "genderGapScore": 0.781,
    "genderGapRank": 22,
    "year": 2024
  },
  "BGR": {
    "alpha3": "BGR",
    "population": 6447710,
    "gdp": 107933,
    "gdpPerCapita": 16087,
    "genderGapScore": 0.744,
    "genderGapRank": 38,
    "year": 2024
  },
  "BRN": {
    "alpha3": "BRN",
    "population": 452524,
    "gdp": 15506,
    "gdpPerCapita": 34267,
    "genderGapScore": 0.701,
    "genderGapRank": 96,
    "year": 2024
  },
  "BDI": {
    "alpha3": "BDI",
    "population": 13238559,
    "gdp": 3190,
    "gdpPerCapita": 241,
    "genderGapScore": 0.741,
    "genderGapRank": 44,
    "year": 2024
  },
  "VNM": {
    "alpha3": "VNM",
    "population": 100987686,
    "gdp": 476325,
    "gdpPerCapita": 4717,
    "genderGapScore": 0.715,
    "genderGapRank": 72,
    "year": 2024
  },
  "VEN": {
    "alpha3": "VEN",
    "population": 29000000,
    "gdp": 102328,
    "gdpPerCapita": 3529,
    "year": 2024
  },
  "BLR": {
    "alpha3": "BLR",
    "population": 9200617,
    "gdp": 75962,
    "gdpPerCapita": 8256,
    "genderGapScore": 0.751,
    "genderGapRank": 41,
    "year": 2024
  },
  "BLZ": {
    "alpha3": "BLZ",
    "population": 410825,
    "gdp": 3296,
    "gdpPerCapita": 8023,
    "genderGapScore": 0.686,
    "genderGapRank": 108,
    "year": 2024
  },
  "PER": {
    "alpha3": "PER",
    "population": 34217848,
    "gdp": 291752,
    "gdpPerCapita": 8526,
    "genderGapScore": 0.762,
    "genderGapRank": 34,
    "year": 2024
  },
  "BEL": {
    "alpha3": "BEL",
    "population": 11858610,
    "gdp": 670983,
    "gdpPerCapita": 56582,
    "genderGapScore": 0.793,
    "genderGapRank": 12,
    "year": 2024
  },
  "POL": {
    "alpha3": "POL",
    "population": 36559233,
    "gdp": 917767,
    "gdpPerCapita": 25104,
    "genderGapScore": 0.736,
    "genderGapRank": 48,
    "year": 2024
  },
  "BIH": {
    "alpha3": "BIH",
    "population": 3233526,
    "gdp": 29078,
    "gdpPerCapita": 8433,
    "genderGapScore": 0.718,
    "genderGapRank": 66,
    "year": 2024
  },
  "BWA": {
    "alpha3": "BWA",
    "population": 2675352,
    "gdp": 21418,
    "gdpPerCapita": 8006,
    "genderGapScore": 0.719,
    "genderGapRank": 79,
    "year": 2024
  },
  "BOL": {
    "alpha3": "BOL",
    "population": 12388571,
    "gdp": 49334,
    "gdpPerCapita": 3982,
    "genderGapScore": 0.73,
    "genderGapRank": 51,
    "year": 2024
  },
  "PRT": {
    "alpha3": "PRT",
    "population": 10694681,
    "gdp": 313657,
    "gdpPerCapita": 29328,
    "genderGapScore": 0.778,
    "genderGapRank": 26,
    "year": 2024
  },
  "HND": {
    "alpha3": "HND",
    "population": 10593798,
    "gdp": 37355,
    "gdpPerCapita": 3526,
    "genderGapScore": 0.744,
    "genderGapRank": 42,
    "year": 2024
  },
  "MDG": {
    "alpha3": "MDG",
    "population": 30325732,
    "gdp": 17249,
    "gdpPerCapita": 569,
    "genderGapScore": 0.737,
    "genderGapRank": 50,
    "year": 2024
  },
  "MWI": {
    "alpha3": "MWI",
    "population": 20931751,
    "gdp": 11241,
    "gdpPerCapita": 537,
    "genderGapScore": 0.676,
    "genderGapRank": 109,
    "year": 2024
  },
  "MLI": {
    "alpha3": "MLI",
    "population": 23293698,
    "gdp": 21659,
    "gdpPerCapita": 930,
    "genderGapScore": 0.605,
    "genderGapRank": 142,
    "year": 2024
  },
  "MLT": {
    "alpha3": "MLT",
    "population": 535064,
    "gdp": 22737,
    "gdpPerCapita": 41738,
    "genderGapScore": 0.713,
    "genderGapRank": 84,
    "year": 2024
  },
  "MYS": {
    "alpha3": "MYS",
    "population": 35557673,
    "gdp": 422227,
    "gdpPerCapita": 11874,
    "genderGapScore": 0.676,
    "genderGapRank": 114,
    "year": 2024
  },
  "MMR": {
    "alpha3": "MMR",
    "population": 54179306,
    "gdp": 68013,
    "gdpPerCapita": 1255,
    "genderGapScore": 0.65,
    "genderGapRank": 123,
    "year": 2024
  },
  "MEX": {
    "alpha3": "MEX",
    "population": 130861007,
    "gdp": 1830489,
    "gdpPerCapita": 13988,
    "genderGapScore": 0.768,
    "genderGapRank": 33,
    "year": 2024
  },
  "MRT": {
    "alpha3": "MRT",
    "population": 4862989,
    "gdp": 10762,
    "gdpPerCapita": 2213,
    "year": 2024
  },
  "MOZ": {
    "alpha3": "MOZ",
    "population": 33897354,
    "gdp": 22497,
    "gdpPerCapita": 664,
    "genderGapScore": 0.776,
    "genderGapRank": 31,
    "year": 2024
  },
  "MDA": {
    "alpha3": "MDA",
    "population": 2512758,
    "gdp": 18308,
    "gdpPerCapita": 7488,
    "genderGapScore": 0.793,
    "genderGapRank": 13,
    "year": 2024
  },
  "MAR": {
    "alpha3": "MAR",
    "population": 37840000,
    "gdp": 152377,
    "gdpPerCapita": 4027,
    "genderGapScore": 0.625,
    "genderGapRank": 136,
    "year": 2024
  },
  "MNG": {
    "alpha3": "MNG",
    "population": 3447157,
    "gdp": 21943,
    "gdpPerCapita": 6244,
    "genderGapScore": 0.716,
    "genderGapRank": 67,
    "year": 2024
  },
  "MNE": {
    "alpha3": "MNE",
    "population": 616695,
    "gdp": 8010,
    "gdpPerCapita": 11636,
    "genderGapScore": 0.714,
    "genderGapRank": 61,
    "year": 2024
  },
  "JOR": {
    "alpha3": "JOR",
    "population": 11337052,
    "gdp": 53570,
    "gdpPerCapita": 4725,
    "genderGapScore": 0.637,
    "genderGapRank": 126,
    "year": 2024
  },
  "LAO": {
    "alpha3": "LAO",
    "population": 7633779,
    "gdp": 16004,
    "gdpPerCapita": 2096,
    "genderGapScore": 0.733,
    "genderGapRank": 54,
    "year": 2024
  },
  "LVA": {
    "alpha3": "LVA",
    "population": 1883008,
    "gdp": 47424,
    "gdpPerCapita": 25136,
    "genderGapScore": 0.771,
    "genderGapRank": 27,
    "year": 2024
  },
  "LTU": {
    "alpha3": "LTU",
    "population": 2862380,
    "gdp": 81453,
    "gdpPerCapita": 28407,
    "genderGapScore": 0.8,
    "genderGapRank": 11,
    "year": 2024
  },
  "LBY": {
    "alpha3": "LBY",
    "population": 6888388,
    "gdp": 48221,
    "gdpPerCapita": 7000,
    "year": 2024
  },
  "ROU": {
    "alpha3": "ROU",
    "population": 19051804,
    "gdp": 382564,
    "gdpPerCapita": 20080,
    "genderGapScore": 0.693,
    "genderGapRank": 95,
    "year": 2024
  },
  "LUX": {
    "alpha3": "LUX",
    "population": 660809,
    "gdp": 88556,
    "gdpPerCapita": 131384,
    "genderGapScore": 0.753,
    "genderGapRank": 40,
    "year": 2024
  },
  "RWA": {
    "alpha3": "RWA",
    "population": 14094683,
    "gdp": 13701,
    "gdpPerCapita": 972,
    "genderGapScore": 0.794,
    "genderGapRank": 34,
    "year": 2024
  },
  "LSO": {
    "alpha3": "LSO",
    "population": 2330318,
    "gdp": 2395,
    "gdpPerCapita": 1028,
    "genderGapScore": 0.705,
    "genderGapRank": 89,
    "year": 2024
  },
  "LBN": {
    "alpha3": "LBN",
    "population": 5353930,
    "gdp": 21780,
    "gdpPerCapita": 4068,
    "genderGapScore": 0.638,
    "genderGapRank": 132,
    "year": 2024
  },
  "RUS": {
    "alpha3": "RUS",
    "population": 143669648,
    "gdp": 2186462,
    "gdpPerCapita": 14962,
    "year": 2024
  },
  "KOR": {
    "alpha3": "KOR",
    "population": 51751065,
    "gdp": 1875388,
    "gdpPerCapita": 36239,
    "genderGapScore": 0.696,
    "genderGapRank": 94,
    "year": 2024
  },
  "HKG": {
    "alpha3": "HKG",
    "population": 7498100,
    "gdp": 407000,
    "gdpPerCapita": 54280,
    "year": 2024
  },
  "ESH": {
    "alpha3": "ESH",
    "population": 50000,
    "gdp": 500,
    "gdpPerCapita": 10000,
    "year": 2024
  },
  "GNQ": {
    "alpha3": "GNQ",
    "population": 1714671,
    "gdp": 12853,
    "gdpPerCapita": 7496,
    "year": 2024
  },
  "TWN": {
    "alpha3": "TWN",
    "population": 23420442,
    "gdp": 802958,
    "gdpPerCapita": 34432,
    "year": 2024
  },
  "CAF": {
    "alpha3": "CAF",
    "population": 5742315,
    "gdp": 2810,
    "gdpPerCapita": 489,
    "year": 2024
  },
  "CHN": {
    "alpha3": "CHN",
    "population": 1408975000,
    "gdp": 18729668,
    "gdpPerCapita": 13293,
    "genderGapScore": 0.678,
    "genderGapRank": 107,
    "year": 2024
  },
  "TLS": {
    "alpha3": "TLS",
    "population": 1360596,
    "gdp": 2043,
    "gdpPerCapita": 1502,
    "genderGapScore": 0.71,
    "genderGapRank": 69,
    "year": 2024
  },
  "ZAF": {
    "alpha3": "ZAF",
    "population": 64007187,
    "gdp": 401145,
    "gdpPerCapita": 6267,
    "genderGapScore": 0.785,
    "genderGapRank": 19,
    "year": 2024
  },
  "SSD": {
    "alpha3": "SSD",
    "population": 11088796,
    "gdp": 6517,
    "gdpPerCapita": 588,
    "year": 2024
  },
  "JPN": {
    "alpha3": "JPN",
    "population": 123975371,
    "gdp": 4190008,
    "gdpPerCapita": 33797,
    "genderGapScore": 0.663,
    "genderGapRank": 118,
    "year": 2024
  },
  "MKD": {
    "alpha3": "MKD",
    "population": 1832000,
    "gdp": 16674,
    "gdpPerCapita": 8758,
    "genderGapScore": 0.715,
    "genderGapRank": 73,
    "year": 2024
  },
  "PRK": {
    "alpha3": "PRK",
    "population": 26160821,
    "gdp": 16500,
    "gdpPerCapita": 630,
    "year": 2024
  },
  "LIE": {
    "alpha3": "LIE",
    "population": 39584,
    "gdp": 7758,
    "gdpPerCapita": 196000,
    "year": 2024
  },
  "AND": {
    "alpha3": "AND",
    "population": 80088,
    "gdp": 3897,
    "gdpPerCapita": 48660,
    "year": 2024
  },
  "ATG": {
    "alpha3": "ATG",
    "population": 94298,
    "gdp": 2127,
    "gdpPerCapita": 22556,
    "year": 2024
  },
  "BRB": {
    "alpha3": "BRB",
    "population": 281995,
    "gdp": 6863,
    "gdpPerCapita": 24337,
    "genderGapScore": 0.777,
    "genderGapRank": 30,
    "year": 2024
  },
  "CPV": {
    "alpha3": "CPV",
    "population": 598682,
    "gdp": 2718,
    "gdpPerCapita": 4540,
    "genderGapScore": 0.761,
    "genderGapRank": 37,
    "year": 2024
  },
  "DMA": {
    "alpha3": "DMA",
    "population": 73040,
    "gdp": 708,
    "gdpPerCapita": 9693,
    "year": 2024
  },
  "GRD": {
    "alpha3": "GRD",
    "population": 126183,
    "gdp": 1406,
    "gdpPerCapita": 11143,
    "year": 2024
  },
  "KIR": {
    "alpha3": "KIR",
    "population": 133515,
    "gdp": 279,
    "gdpPerCapita": 2090,
    "year": 2024
  },
  "MDV": {
    "alpha3": "MDV",
    "population": 523787,
    "gdp": 7199,
    "gdpPerCapita": 13744,
    "genderGapScore": 0.649,
    "genderGapRank": 124,
    "year": 2024
  },
  "MHL": {
    "alpha3": "MHL",
    "population": 41996,
    "gdp": 284,
    "gdpPerCapita": 6763,
    "year": 2024
  },
  "MUS": {
    "alpha3": "MUS",
    "population": 1261043,
    "gdp": 15890,
    "gdpPerCapita": 12601,
    "genderGapScore": 0.704,
    "genderGapRank": 110,
    "year": 2024
  },
  "FSM": {
    "alpha3": "FSM",
    "population": 115224,
    "gdp": 460,
    "gdpPerCapita": 3992,
    "year": 2024
  },
  "MCO": {
    "alpha3": "MCO",
    "population": 39050,
    "gdp": 9996,
    "gdpPerCapita": 240862,
    "year": 2024
  },
  "NRU": {
    "alpha3": "NRU",
    "population": 12780,
    "gdp": 154,
    "gdpPerCapita": 12050,
    "year": 2024
  },
  "PLW": {
    "alpha3": "PLW",
    "population": 18055,
    "gdp": 308,
    "gdpPerCapita": 17059,
    "year": 2024
  },
  "KNA": {
    "alpha3": "KNA",
    "population": 47755,
    "gdp": 1134,
    "gdpPerCapita": 23746,
    "year": 2024
  },
  "LCA": {
    "alpha3": "LCA",
    "population": 180251,
    "gdp": 2520,
    "gdpPerCapita": 13980,
    "year": 2024
  },
  "VCT": {
    "alpha3": "VCT",
    "population": 103698,
    "gdp": 1128,
    "gdpPerCapita": 10878,
    "year": 2024
  },
  "WSM": {
    "alpha3": "WSM",
    "population": 225681,
    "gdp": 1024,
    "gdpPerCapita": 4537,
    "year": 2024
  },
  "SMR": {
    "alpha3": "SMR",
    "population": 33660,
    "gdp": 2033,
    "gdpPerCapita": 60398,
    "year": 2024
  },
  "STP": {
    "alpha3": "STP",
    "population": 231856,
    "gdp": 603,
    "gdpPerCapita": 2601,
    "year": 2024
  },
  "SYC": {
    "alpha3": "SYC",
    "population": 100447,
    "gdp": 2141,
    "gdpPerCapita": 21315,
    "year": 2024
  },
  "TON": {
    "alpha3": "TON",
    "population": 107773,
    "gdp": 547,
    "gdpPerCapita": 5075,
    "year": 2024
  },
  "TUV": {
    "alpha3": "TUV",
    "population": 11396,
    "gdp": 63,
    "gdpPerCapita": 5528,
    "year": 2024
  },
  "VAT": {
    "alpha3": "VAT",
    "population": 764,
    "gdp": 21,
    "gdpPerCapita": 27487,
    "year": 2024
  },
  "COK": {
    "alpha3": "COK",
    "population": 17564,
    "gdp": 300,
    "gdpPerCapita": 17080,
    "year": 2024
  },
  "NIU": {
    "alpha3": "NIU",
    "population": 1937,
    "gdp": 35,
    "gdpPerCapita": 18069,
    "year": 2024
  },
  "XKX": {
    "alpha3": "XKX",
    "population": 1761985,
    "gdp": 10469,
    "gdpPerCapita": 5942,
    "year": 2024
  }
};

/**
 * 統計値のローカライズ表示フォーマッター
 */
export function formatStatValue(
  indicatorId: StatIndicatorId,
  value: number | undefined,
  language: 'ja' | 'en'
): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return language === 'ja' ? 'データなし' : 'No data';
  }

  if (indicatorId === 'population') {
    if (language === 'ja') {
      if (value >= 100000000) {
        return `${(value / 100000000).toFixed(2)}億人`;
      }
      if (value >= 10000) {
        return `${(value / 10000).toFixed(1)}万人`;
      }
      return `${value.toLocaleString()}人`;
    } else {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)}B`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)}M`;
      }
      return value.toLocaleString();
    }
  }

  if (indicatorId === 'gdp') {
    // gdp は百万USD単位
    const usd = value * 1000000;
    if (language === 'ja') {
      if (usd >= 1000000000000) {
        return `$${(usd / 1000000000000).toFixed(2)}兆`;
      }
      if (usd >= 100000000) {
        return `$${(usd / 100000000).toFixed(1)}億`;
      }
      return `$${(value).toLocaleString()}M`;
    } else {
      if (usd >= 1000000000000) {
        return `$${(usd / 1000000000000).toFixed(2)}T`;
      }
      if (usd >= 1000000000) {
        return `$${(usd / 1000000000).toFixed(2)}B`;
      }
      return `$${value.toLocaleString()}M`;
    }
  }

  if (indicatorId === 'gdp_per_capita') {
    return `$${Math.round(value).toLocaleString()}`;
  }

  if (indicatorId === 'gender_gap') {
    return value.toFixed(3);
  }

  return String(value);
}

/**
 * 統計値に応じたグラデーションカラーの計算
 */
export function getChoroplethColor(
  indicatorId: StatIndicatorId,
  value: number | undefined,
  minVal: number,
  maxVal: number,
  isHovered = false
): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return isHovered ? '#94a3b8' : 'var(--map-neutral, #e2e8f0)';
  }

  const meta = STAT_INDICATORS[indicatorId];
  const palette = meta.palette;

  // 比率 (0.0 〜 1.0) の計算
  let ratio = 0;
  if (meta.scaleType === 'log') {
    const safeMin = Math.max(minVal, 1);
    const safeVal = Math.max(value, 1);
    const safeMax = Math.max(maxVal, safeMin + 1);
    const logMin = Math.log10(safeMin);
    const logMax = Math.log10(safeMax);
    const logVal = Math.log10(safeVal);
    ratio = (logVal - logMin) / (logMax - logMin);
  } else {
    // 線形スケール (ジェンダーギャップ指数など)
    const span = maxVal - minVal;
    ratio = span > 0 ? (value - minVal) / span : 0.5;
  }

  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const index = Math.min(palette.length - 1, Math.floor(clampedRatio * palette.length));
  return palette[index];
}
