export type FrameworkCategory =
  | 'security'      // 安全保障・防衛同盟
  | 'economic'      // 経済・貿易連携 (FTA, 経済共同体)
  | 'regional'      // 地域統合・地域機構
  | 'summit'        // 首脳会議・枠組み (G7, G20, BRICS等)
  | 'global_treaty';// 国際条約 (環境、軍縮、人権等)

export type MembershipStatus =
  | 'ratified'       // 批准・正式加盟
  | 'signed'         // 署名済・未批准
  | 'observer'       // オブザーバー・準加盟国
  | 'dialogue'       // 対話パートナー・協力国
  | 'candidate'      // 加盟申請・候補国
  | 'withdrawn';     // 脱退・停止

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

export interface MembershipRecord {
  countryCode: string;       // alpha3 (例: "JPN")
  status: MembershipStatus;  // 現在のステータス
  signedYear?: number;       // 署名年
  ratifiedYear?: number;     // 批准・加盟年
  withdrawnYear?: number;    // 脱退・停止年
  notes?: string;            // 特記事項（例: "原加盟国", "2024年新規加盟"）
}

export interface Framework {
  id: string;                // "nato", "cptpp"
  nameJa: string;            // "北大西洋条約機構"
  nameEn: string;            // "North Atlantic Treaty Organization"
  acronym: string;           // "NATO"
  category: FrameworkCategory;
  establishedYear: number;   // 創設/署名年 (1949)
  inForceYear?: number;      // 発効年 (1949)
  description: string;       // 概要・目的
  secretariat?: string;      // 本部・事務局所在地
  members: MembershipRecord[];
}

export type ViewMode = 'framework' | 'compare' | 'country';
