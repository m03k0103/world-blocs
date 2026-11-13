import type { Country } from '../types';
import { COUNTRIES } from '../data/countriesData';
import {
  HISTORICAL_ENTITIES,
  HISTORICAL_ENTITY_BY_ALPHA3,
  isHistoricalEntity,
} from '../data/historicalEntities';

export { HISTORICAL_ENTITIES, HISTORICAL_ENTITY_BY_ALPHA3, isHistoricalEntity };

export type BaseEntity = Country | (typeof HISTORICAL_ENTITIES)[number];

/**
 * 歴史的主体を Country 互換形式でマッピング（下位互換性確保用）
 */
const HISTORICAL_COUNTRY_COMPAT: Record<string, Country> = Object.fromEntries(
  HISTORICAL_ENTITIES.map((h) => [
    h.alpha3,
    {
      numeric: h.iso3166_3 || '000',
      alpha3: h.alpha3,
      alpha2: h.alpha3.slice(0, 2),
      nameJa: h.nameJa,
      nameEn: h.nameEn,
      region: h.region,
      subregion: h.subregion,
      flagEmoji: h.flagEmoji,
      entityType: 'historical_state' as const,
    },
  ])
);

const RAW_COUNTRY_MAP: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.alpha3, c])
);

export const COUNTRY_BY_ALPHA3: Record<string, Country> = {
  ...RAW_COUNTRY_MAP,
  ...HISTORICAL_COUNTRY_COMPAT,
  // 特別参加主体・地域組織エイリアス
  EU: RAW_COUNTRY_MAP['EUR'],
  AU: RAW_COUNTRY_MAP['AFU'],
  KOS: RAW_COUNTRY_MAP['XKX'],
  // 後方互換性用エイリアス
  C044: RAW_COUNTRY_MAP['BHS'],
  C204: RAW_COUNTRY_MAP['BEN'],
  C854: RAW_COUNTRY_MAP['BFA'],
  C270: RAW_COUNTRY_MAP['GMB'],
  C324: RAW_COUNTRY_MAP['GIN'],
  C624: RAW_COUNTRY_MAP['GNB'],
  C430: RAW_COUNTRY_MAP['LBR'],
  C694: RAW_COUNTRY_MAP['SLE'],
  C768: RAW_COUNTRY_MAP['TGO'],
};

export const COUNTRY_BY_NUMERIC: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.numeric, c])
);

/**
 * 全参加主体（主権国家＋超国家組織＋地域機関＋特別実体＋歴史的国家）の統合ルックアップマップ
 */
export const ENTITY_BY_ALPHA3: Record<string, BaseEntity> = {
  ...COUNTRY_BY_ALPHA3,
  ...HISTORICAL_ENTITY_BY_ALPHA3,
};

/**
 * alpha-3 コードから参加主体（国家または歴史的主体）を取得する統一ヘルパー
 */
export function getEntity(code: string): BaseEntity | undefined {
  if (!code) return undefined;
  return (
    ENTITY_BY_ALPHA3[code] ||
    COUNTRY_BY_ALPHA3[code] ||
    HISTORICAL_ENTITY_BY_ALPHA3[code]
  );
}
