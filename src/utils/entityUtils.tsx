import type { Country, EntityType, HistoricalEntity, MembershipStatus } from '../types';
import { COUNTRY_BY_ALPHA3 } from '../data/countries';
import { HISTORICAL_ENTITY_BY_ALPHA3 } from '../data/historicalEntities';

export type BaseEntity = Country | HistoricalEntity;

/**
 * 非国家主体（超国家機関・地域国際機関）専用のカラー
 */
export const NON_STATE_ENTITY_COLOR = '#8b5cf6'; // バイオレット・パープル
export const NON_STATE_ENTITY_HOVER_COLOR = '#7c3aed';

/**
 * ISO3コードまたはエンティティオブジェクトからエンティティを取得
 */
export function getEntity(code: string): BaseEntity | undefined {
  return HISTORICAL_ENTITY_BY_ALPHA3[code] || COUNTRY_BY_ALPHA3[code];
}

/**
 * 主体（国家・非国家主体）の短縮表示ラベルを取得
 * EUR -> EU, AFU -> AU, その他は alpha2 または alpha3
 */
export function getEntityShortLabel(entityOrCode: BaseEntity | string | null | undefined): string {
  if (!entityOrCode) return '';
  const code = typeof entityOrCode === 'string' ? entityOrCode.toUpperCase() : entityOrCode.alpha3;
  if (code === 'EUR' || code === 'EU') return 'EU';
  if (code === 'AFU' || code === 'AU') return 'AU';
  
  const entity = typeof entityOrCode === 'string' ? getEntity(entityOrCode) : entityOrCode;
  if (entity && 'alpha2' in entity && entity.alpha2) {
    return entity.alpha2;
  }
  return code;
}

/**
 * 非国家主体（Non-State Participant）であるか判定
 * 超国家機関（supranational: 例 EU / EUR）または地域国際機関（regional_org: 例 AU / AFU）
 */
export function isNonStateParticipant(entityOrCode: BaseEntity | string | null | undefined): boolean {
  if (!entityOrCode) return false;
  if (typeof entityOrCode === 'string') {
    const code = entityOrCode.toUpperCase();
    if (code === 'EUR' || code === 'EU' || code === 'AFU' || code === 'AU') return true;
    const entity = getEntity(code);
    return entity?.entityType === 'supranational' || entity?.entityType === 'regional_org';
  }
  return entityOrCode.entityType === 'supranational' || entityOrCode.entityType === 'regional_org';
}

/**
 * 国家主体（State Participant）であるか判定
 * 主権国家、特別実体、歴史的国家等
 */
export function isStateParticipant(entityOrCode: BaseEntity | string | null | undefined): boolean {
  return !isNonStateParticipant(entityOrCode);
}

/**
 * 正式加盟・メンバー（full member / state party / participating state / ratified）判定
 */
export function isFullMemberStatus(status: MembershipStatus): boolean {
  return status === 'member' || status === 'party' || status === 'participating_state' || status === 'ratified';
}

/**
 * エンティティ種別に応じた視覚バッジのレンダリング
 */
export function getEntityTypeBadge(entityType?: EntityType, lang: 'ja' | 'en' = 'ja') {
  if (!entityType || entityType === 'sovereign_state') return null;

  switch (entityType) {
    case 'supranational':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
          {lang === 'ja' ? '超国家機関' : 'Supranational'}
        </span>
      );
    case 'regional_org':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          {lang === 'ja' ? '地域国際機関' : 'Regional Org'}
        </span>
      );
    case 'historical_state':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
          {lang === 'ja' ? '歴史的主体' : 'Historical'}
        </span>
      );
    case 'special_entity':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          {lang === 'ja' ? '特別実体' : 'Special Entity'}
        </span>
      );
    default:
      return null;
  }
}
