export type FrameworkCategory =
  | 'security'      // 安全保障・防衛同盟
  | 'economic'      // 経済・貿易連携 (FTA, 経済共同体)
  | 'regional'      // 地域統合・地域機構
  | 'summit'        // 首脳会議・枠組み (G7, G20, BRICS等)
  | 'global_treaty';// 国際条約 (環境、軍縮、人権等)

export type MembershipStatus =
  | 'member'              // 国際機関の正式加盟国、または協議枠組みの正式メンバー（G7, G20, NATO, ASEAN等）
  | 'party'               // 法的拘束力を持つ国際条約の締約国（パリ協定, NPT, ICC, UNCLOS等）
  | 'participating_state' // 政治的合意フォーラムの参加国（OSCE等）
  | 'signatory'           // 条約・共同宣言への署名国（未発効または未批准）
  | 'candidate'           // 正式に承認された加盟候補国（EU等）
  | 'partner'             // パートナー国、協力パートナー（BRICSパートナー国、OSCE協力パートナー国等）
  | 'dialogue'            // 対話パートナー（後方互換・細分化）
  | 'observer'            // オブザーバー
  | 'suspended'           // 参加資格停止（メルコスールにおけるベネズエラ等）
  | 'withdrawn'           // 正式に手続きを経て脱退が発効した国（パリ協定の米国、ICCのフィリピン・ブルンジ等）
  | 'non_party'           // 一度も加盟・締結していない国（NPTのインド・イスラエル、UNCLOSの米国等）
  | 'unsigned'            // 署名撤回・批准意思放棄（ICC等）
  // 移行期間用エイリアス
  | 'ratified'
  | 'signed'
  | 'non-party';

export interface Country {
  numeric: string;   // ISO 3166-1 numeric 3桁 ("392")
  alpha3: string;    // ISO 3166-1 alpha-3 ("JPN")
  alpha2: string;    // ISO 3166-1 alpha-2 ("JP")
  nameJa: string;    // "日本"
  nameEn: string;    // "Japan"
  region: string;    // "アジア", "ヨーロッパ" 等
  subregion?: string;// "東アジア" 等
  flagEmoji?: string;// 🇯🇵
}

/**
 * 日付・年次文字列型
 * yyyy (例: "1949"), yyyymm (例: "202412"), yyyymmdd (例: "20241215") のいずれかの形式
 */
export type DateString = string;

export interface MembershipRecord {
  countryCode: string;             // alpha3 (例: "JPN")
  status: MembershipStatus;        // 現在のステータス

  // 条約関連フィールド (yyyy / yyyymm / yyyymmdd)
  signed?: DateString;             // 条約・合意文書への署名日/年
  ratified?: DateString;           // 署名後に国内手続きを経て批准・受諾・承認した日/年
  accession?: DateString;          // 署名を経ずに条約へ加入（Accession）した日/年
  inForce?: DateString;            // 条約・協定が当該国について発効した日/年
  inForceDate?: string;            // 発効日 (互換用)
  bilateralInForceDates?: Record<string, string>; // 相手国別二国間発効日 (例: { "CAN": "2026-09-01", "JPN": "2024-12-15" })

  // 組織・フォーラム関連フィールド (yyyy / yyyymm / yyyymmdd)
  joined?: DateString;             // 機構やフォーラムへの参加・加盟日/年
  firstParticipated?: DateString;  // 協議体・フォーラムへの初参加日/年
  declarationSigned?: DateString;  // 共同宣言・創設宣言署名日/年

  // プロセス・資格変動フィールド (yyyy / yyyymm / yyyymmdd)
  applied?: DateString;            // 加盟申請日/年
  candidate?: DateString;          // 加盟候補国として正式認定された日/年
  negotiationsStarted?: DateString;// 加盟交渉が開始された日/年
  suspended?: DateString;          // 参加・加盟資格の停止日/年
  withdrawalNotified?: DateString; // 脱退の正式通告日/年
  withdrawn?: DateString;          // 脱退が正式発効した日/年

  notes?: string;                  // 特記事項（例: "原加盟国", "2024年新規加盟"）

  // 移行互換用フィールド (必要に応じて)
  signedYear?: number;
  ratifiedYear?: number;
  accessionYear?: number;
  inForceYear?: number;
  joinedYear?: number;
  candidateYear?: number;
  negotiationsStartedYear?: number;
  suspendedYear?: number;
  withdrawnYear?: number;
  appliedYear?: number;
}

export interface FrameworkSource {
  titleJa: string;           // 一次資料・公式記録の日本語名称（例: "米国国務省（寄託者記録）"）
  titleEn: string;           // 一次資料の英語名称（例: "U.S. Department of State (Depositary)"）
  url: string;               // 一次資料の公式URL
  type?: 'depositary' | 'official' | 'treaty'; // 資料区分
}

export interface Framework {
  id: string;                // "nato", "cptpp"
  nameJa: string;            // "北大西洋条約機構"
  nameEn: string;            // "North Atlantic Treaty Organization"
  acronym: string;           // "NATO"
  category: FrameworkCategory;
  established: DateString;   // 創設/署名年 (例: "1949" または "19490404")
  establishedYear: number;   // タイムラインスライダー互換用数値 (1949)
  inForce?: DateString;      // 全体発効年 (例: "1949" または "19490824")
  inForceYear?: number;      // 互換用数値
  description: string;       // 概要・目的
  secretariat?: string;      // 本部・事務局所在地
  aliases?: string[];        // 別名・代替略称（例: ['pa', 'alianza-del-pacifico']）
  sources?: FrameworkSource[]; // 公式寄託記録・条約本文等の一次データソース
  members: MembershipRecord[];
}

export type ViewMode = 'framework' | 'compare' | 'country';

export type Language = 'ja' | 'en';
