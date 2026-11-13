// 国マスタデータ・ルックアップユーティリティの再エクスポートハブ（完全後方互換）
export { COUNTRIES } from './countriesData';
export {
  HISTORICAL_ENTITIES,
  HISTORICAL_ENTITY_BY_ALPHA3,
  isHistoricalEntity,
  COUNTRY_BY_ALPHA3,
  COUNTRY_BY_NUMERIC,
  ENTITY_BY_ALPHA3,
  getEntity,
} from '../utils/countryUtils';
export type { BaseEntity } from '../utils/countryUtils';
