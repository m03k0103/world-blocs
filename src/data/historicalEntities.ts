import type { HistoricalEntity } from '../types';

/**
 * 歴史的参加主体マスタデータ (Schema 2.0 / Drop 32)
 *
 * 国際法規、国際条約寄託記録（UNTC等）、冷戦期〜近現代の主要条約・多国間機構に
 * 署名・批准・参加した歴史的国家および国家継承メタデータを厳格に定義。
 * 国コードは過去に ISO 3166-1 alpha-3 として運用され、現在は ISO 3166-3 に収録されている
 * 正式な国際規格コードに準拠。
 */
export const HISTORICAL_ENTITIES: HistoricalEntity[] = [
  {
    alpha3: 'SUN',
    iso3166_3: 'SUHH',
    nameJa: 'ソビエト社会主義共和国連邦',
    nameEn: 'Union of Soviet Socialist Republics',
    region: 'ユーラシア',
    subregion: '東ヨーロッパ・中央アジア',
    entityType: 'historical_state',
    period: {
      start: '19221230',
      end: '19911226'
    },
    succession: {
      type: 'continuation',
      successorCodes: ['RUS'],
      effectiveDate: '19911226',
      descriptionJa: '1991年12月26日の連邦最高会議宣言によりソビエト連邦解体。ロシア連邦が国際法上の同一性（国際連合安全保障理事会常任理事国の地位、核軍縮条約等の締約国としての権利義務）を法的に継続。他の旧構成14カ国は主権国家として独立。',
      descriptionEn: 'Dissolution of the USSR on December 26, 1991. The Russian Federation continued the international legal personality and UN Security Council permanent seat of the USSR, while other former Soviet republics became independent states.'
    },
    flagEmoji: '🚩'
  },
  {
    alpha3: 'DDR',
    iso3166_3: 'DDDL',
    nameJa: 'ドイツ民主共和国',
    nameEn: 'German Democratic Republic',
    region: 'ヨーロッパ',
    subregion: '中央ヨーロッパ',
    entityType: 'historical_state',
    period: {
      start: '19491007',
      end: '19901002'
    },
    succession: {
      type: 'unification',
      successorCodes: ['DEU'],
      effectiveDate: '19901003',
      descriptionJa: '1990年10月3日のドイツ再統一に伴い、旧東ドイツの5州がドイツ連邦共和国基本法第23条に基づきドイツ連邦共和国（DEU）に編入統合。ワルシャワ条約機構からは統一前日の1990年10月2日付で脱退。',
      descriptionEn: 'Accession of the German Democratic Republic to the Federal Republic of Germany under Article 23 of the Basic Law on October 3, 1990. Withdrew from the Warsaw Pact on October 2, 1990.'
    },
    flagEmoji: '🇩🇪'
  },
  {
    alpha3: 'CSK',
    iso3166_3: 'CSHH',
    nameJa: 'チェコスロバキア',
    nameEn: 'Czechoslovakia',
    region: 'ヨーロッパ',
    subregion: '中央ヨーロッパ',
    entityType: 'historical_state',
    period: {
      start: '19181028',
      end: '19921231'
    },
    succession: {
      type: 'dissolution',
      successorCodes: ['CZE', 'SVK'],
      effectiveDate: '19930101',
      descriptionJa: '1992年12月31日の連邦解消法発効（ビロード離婚）に伴い、1993年1月1日付でチェコ共和国（CZE）とスロバキア共和国（SVK）の2つの主権国家へ平和的に分離解体・共同継承。',
      descriptionEn: 'Peaceful dissolution of the Czech and Slovak Federative Republic (Velvet Divorce) on December 31, 1992, succeeded jointly by the Czech Republic and the Slovak Republic on January 1, 1993.'
    },
    flagEmoji: '🇨🇿'
  },
  {
    alpha3: 'YUG',
    iso3166_3: 'YUCS',
    nameJa: 'ユーゴスラビア社会主義連邦共和国',
    nameEn: 'Socialist Federal Republic of Yugoslavia',
    region: 'ヨーロッパ',
    subregion: '南東ヨーロッパ・バルカン',
    entityType: 'historical_state',
    period: {
      start: '19451129',
      end: '19920427'
    },
    succession: {
      type: 'dissolution',
      successorCodes: ['SRB', 'HRV', 'SVN', 'BIH', 'MKD', 'MNE', 'XKX'],
      effectiveDate: '19920427',
      descriptionJa: '1991年から1992年にかけての構成共和国の独立宣言とユーゴスラビア紛争により連邦解体。スロベニア、クロアチア、ボスニア・ヘルツェゴビナ、北マケドニアが独立し、残余のセルビア・モンテネグロが新連邦（のちセルビアとモンテネグロに分離、コソボ独立）を形成。',
      descriptionEn: 'Dissolution of the SFR Yugoslavia resulting in successor sovereign states including Slovenia, Croatia, Bosnia and Herzegovina, North Macedonia, Serbia, Montenegro, and Kosovo.'
    },
    flagEmoji: '🇷🇸'
  }
];

/**
 * alpha-3 コード（SUN, DDR, CSK, YUG等）による歴史的主体インデックス
 */
export const HISTORICAL_ENTITY_BY_ALPHA3: Record<string, HistoricalEntity> = Object.fromEntries(
  HISTORICAL_ENTITIES.map((e) => [e.alpha3, e])
);

/**
 * コードが歴史的参加主体か判定する型ガード
 */
export function isHistoricalEntity(entity: unknown): entity is HistoricalEntity {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'entityType' in entity &&
    (entity as HistoricalEntity).entityType === 'historical_state'
  );
}
