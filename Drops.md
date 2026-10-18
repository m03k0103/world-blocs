# World Blocs 改善・機能拡充マスタードキュメント (Drops.md)

> 最終更新: 2026-10-18  
> 運用規約は [`GLOBAL_RULES.md`](file:///C:/Users/m03k0/.gemini/antigravity/rules/GLOBAL_RULES.md) 第3章7項、および [`Agent.md`](file:///d:/dev/World/Agent.md) に準拠します。  
> 未着手の将来構想テーマは **「Track（トラック）」** として管理し、着手・完了した個別施策単位にはその時点の最新連番を付与して **「Drop（ドロップ）」** としてアーカイブ化します。

---

## 1. 今後の改善・開発構想（Tracks ロードマップ）

| Track ID / Drop | 構想テーマ | 主な対象枠組み・機能 | 到達目標・期待価値 | ステータス |
|:---:|:---|:---|:---|:---:|
| **Track [Eurasia-CentralAsia]** | **ユーラシア・中央アジア・旧ソ連圏 6枠組みの新規追加** | **CIS, EAEU, CICA, GUAM, ECO, CAREC（計6枠組み新設）**<br>- 独立国家共同体（`cis`）<br>- ユーラシア経済同盟（`eaeu`）<br>- アジア信頼醸成措置会議（`cica`）<br>- 民主主義と経済発展のための機構-GUAM（`guam`）<br>- 経済協力機構（`eco`）<br>- 中央アジア地域経済協力（`carec`） | 旧ソ連圏・中央アジア地域の安全保障・経済統合・地域協力枠組みの収録（全34→40枠組み） | **【計画策定済】** |

---

## 2. 各Trackの詳細

### 2-1. 【計画策定済】Track [Eurasia-CentralAsia] - ユーラシア・中央アジア・旧ソ連圏 6枠組みの新規追加

#### 背景・課題
- 旧ソ連構成国、中央アジア、コーカサス、およびアジア地域における多国間安全保障・経済統合・信頼醸成の主要6枠組み（CIS, EAEU, CICA, GUAM, ECO, CAREC）を新規追加し、既存の CSTO・SCO とあわせてユーラシア地域の国際関係を網羅する。

#### Change Request (CR) 表
| CR ID | 枠組みID / 名称 | カテゴリ / 法的性質 | 創設・構成国・一次資料仕様 |
|:---:|:---|:---|:---|
| CR-EU-1 | `cis`<br>独立国家共同体 (CIS) | `regional` / `international_org` | 1991年12月創設、1993年1月憲章調印。本部：ミンスク。正式加盟9カ国（RUS, BLR, KAZ, KGZ, TJK, UZB, ARM, AZE, MDA）、準加盟1カ国（TKM）、脱退2カ国（GEO, UKR）。出典：cis.minsk.by、外務省 |
| CR-EU-2 | `eaeu`<br>ユーラシア経済同盟 (EAEU) | `economic` / `regional_integration` | 2014年5月29日調印、2015年1月1日発効。本部：モスクワ。正式加盟5カ国（RUS, BLR, KAZ, ARM, KGZ）、オブザーバー3カ国（MDA, UZB, CUB）。出典：eaeunion.org、外務省 |
| CR-EU-3 | `cica`<br>アジア信頼醸成措置会議 (CICA) | `security` / `political_dialogue` | 1992年提唱、1999年外相会合、2002年首脳会議。本部：アスタナ。正式加盟28カ国、オブザーバー国（JPN, USA等）。出典：s-cica.org、外務省 |
| CR-EU-4 | `guam`<br>民主主義と経済発展のための機構-GUAM | `regional` / `international_org` | 1997年10月設立、2001年ヤルタ憲章、2006年国際機関化。本部：キーウ。正式加盟4カ国（GEO, UKR, AZE, MDA）、脱退1カ国（UZB）。出典：guam-organization.org、外務省 |
| CR-EU-5 | `eco`<br>経済協力機構 (ECO) | `economic` / `international_org` | 1985年設立（原加盟：IRN, PAK, TUR）、1992年拡大。本部：テヘラン。正式加盟10カ国（IRN, PAK, TUR, AFG, AZE, KAZ, KGZ, TJK, TKM, UZB）。出典：eco.int、外務省 |
| CR-EU-6 | `carec`<br>中央アジア地域経済協力 (CAREC) | `economic` / `political_dialogue` | 1997年創設（ADB主導）。事務局：マニラ（ADB内）。参加11カ国（AFG, AZE, GEO, KAZ, KGZ, MNG, PAK, CHN, TJK, TKM, UZB）。出典：carecprogram.org、ADB |

---

## 3. 実装済 Drop一覧（Drop 1 〜 Drop 37）

| Drop ID | 完了日 | 施策名 | 主な変更対象 | 到達成果・定量数値 |
|:---:|:---:|:---|:---|:---|
| **Drop 37** | 2026-10-18 | **Track [CodeQuality-Refinement]: Schema 2.0 連携バグ修正・静的解析警告解消・UI/バンドル最適化** | `TableView.tsx`, `CompareView.tsx`, `CountryListView.tsx`, `FrameworkView.tsx`, `CountryProfileModal.tsx`, `FrameworkCombobox.tsx`, `LanguageContext.tsx`, `routing.ts`, `vite.config.ts`, `package.json` | 歴史的主体（SUN, DDR, CSK）のテーブル一覧・比較画面正常表示、参加枠組み数厳格カウント、Escape/背景閉鎖対応、`oxlint` 警告ゼロ化（1,132件➔0件）、Vite チャンク分割によるバンドル最適化（単一633kB➔vendor 218kB, d3 21kB, app 393kB） |
| **Drop 36** | 2026-10-18 | **Track [UI-CategoryRedesign]: カテゴリ体系の再編・スリム化 & 所属枠組みの適正化** | `src/data/frameworks.ts`, `src/types/index.ts` | 5大カテゴリ表示名の簡潔化（安全保障、経済・通商、地域統合、首脳・戦略対話、国際法・条約）、Quad・Pax Silica・WAICO の「首脳・戦略対話」への再配置（各カテゴリ枠組み数：8, 10, 4, 7, 5） |

| Drop ID | 完了日 | 施策名 | 主な変更対象 | 到達成果・定量数値 |
|:---:|:---:|:---|:---|:---|
| **Drop 35** | 2026-10-17 | **Track [IR-RigorousDataModel] (Phase 4): 全34枠組みへの展開・データ整合性検証** | `src/data/frameworks.ts` | 全34枠組みへの `frameworkType` 設定完了（treaty:12, international_org:6, regional_integration:5, summit_forum:5, political_dialogue:6）。全1,090レコードの整合性検証（異常値 0 件） |
| **Drop 34** | 2026-10-17 | **Track [IR-RigorousDataModel] (Phase 3): 地図・テーブル・モーダルの Schema 2.0 対応** | `WorldMap.tsx`, `TableView.tsx`, `CountryProfileModal.tsx` | 歴史的主体（SUN, DDR, CSK, YUG）の後継国ポリゴン描画・ツールチップ表示、参加主体種別バッジ、`negotiationsApproved` 表示、国家継承解説ボックスの実装 |
| **Drop 33** | 2026-10-16 | **Track [IR-RigorousDataModel] (Phase 2): 代表的枠組みでの先行データモデル移行** | `src/data/frameworks.ts`, `src/utils/date.ts` | ワルシャワ条約機構の歴史的主体（SUN, DDR, CSK）移行、EU候補国の交渉合意・交渉開始の分離、G7/G20/パリ協定/Pax Silica の `EUR`・`AFU` 主体種別明示 |
| **Drop 32** | 2026-10-16 | **Track [IR-RigorousDataModel] (Phase 1): スキーマ拡張 & 歴史的主体マスタ新設** | `src/types/index.ts`, `src/data/historicalEntities.ts`, `src/data/countries.ts` | `EntityType`、`StateSuccession`、`HistoricalEntity`（ISO 3166-3 準拠）、`FrameworkType`、`negotiationsApproved`、`getEntity(code)` ヘルパーの新設 |
| **Drop 31** | 2026-10-16 | **Track [Perf-TopoJSON]: 世界地図 TopoJSON データのバンドル内包 & 一元化** | `WorldMap.tsx`, `src/data/countries-110m.json` | `public/data` と `docs/data` の重複 JSON を廃止し `src/data/` に集約。非同期 fetch を同期 import へ変更し初期描画の通信待機を解消 |
| **Drop 30** | 2026-10-15 | **Track [FactCheck-EuropeAmericas]: ファクトチェック第5弾（欧州・米州・通商 8枠組み）** | `src/data/frameworks.ts` | EU(27), EEA(30), OECD(38), USMCA(3), メルコスール(5), 太平洋同盟(4), AFTA(11), GAFTA(18), OSCE(57) の一次資料突合と `sources` 配備（全34枠組み配備完了） |
| **Drop 29** | 2026-10-15 | **Track [FactCheck-RegionalEurasia]: ファクトチェック第4弾（中東・ユーラシア 5枠組み）** | `src/data/frameworks.ts` | ワルシャワ条約機構(6), SCO(10), アラブ連盟(22), AZEC(11), 平和協議会(28) の一次資料突合と `sources` 配備 |
| **Drop 28** | 2026-10-15 | **Track [FactCheck-AsiaPacific]: ファクトチェック第3弾（アジア太平洋・先端外交 6枠組み）** | `src/data/frameworks.ts` | CPTPP(12), RCEP(15), APEC(21), ASEAN(11), Pax Silica(25), WAICO(37) の寄託政府・公式記録突合と `sources` 配備 |
| **Drop 27** | 2026-10-15 | **Track [FactCheck-Treaties]: ファクトチェック第2弾（国連条約・環境・軍縮・司法 6枠組み）** | `src/data/frameworks.ts` | パリ協定(194), NPT(192), TPNW(16), ICC(38), UNCLOS(40), P5(5) の国連条約局（UNTC）等公式記録突合と `sources` 配備 |
| **Drop 26** | 2026-10-15 | **Track [FactCheck-Summits]: ファクトチェック第1弾（主要首脳サミット 6枠組み）** | `src/data/frameworks.ts` | G7(8), G20(21), AUKUS(3), Quad(4), Five Eyes(5), BRICS(10) の各国政府公式記録突合と `sources` 配備 |
| **Drop 25** | 2026-10-14 | **Track [Security-CSTO]: CSTO アルメニア参加凍結注記 & 議会オブザーバー追加** | `src/data/frameworks.ts` | アルメニアの2024年2月活動停止注記追加、CSTO議会会議オブザーバー（AFG, SRB）の記録整備、外務省資料リンク追加 |
| **Drop 24** | 2026-10-14 | **Track [Data-Integrity]: 正式加盟・メンバー数の厳格カウントルール適用** | `FrameworkView.tsx`, `Agent.md` | ヘッダーの「参加国・地域」数から候補国・オブザーバー・脱退国等を除外し、現行の正式メンバー数のみを集計する仕様へ修正 |
| **Drop 23** | 2026-10-14 | **Track [Peace-Board]: 平和協議会（Board of Peace）の新規追加** | `src/data/frameworks.ts`, `src/data/countries.ts` | 第34番目の枠組みとして平和協議会（28カ国・地域）を追加、コソボ（`XKX`）マスタ追加 |
| **Drop 22** | 2026-10-13 | **Track [Security-Alliances]: NATO データ精度向上 & 一次資料リンク機能新設** | `src/data/frameworks.ts`, `src/types/index.ts`, `FrameworkView.tsx` | 候補国（GEO, BIH）日付補完、ギリシャ・スペイン注記補完、`sources` フィールドとリンク表示UIの新設 |
| **Drop 21** | 2026-10-13 | **Track [UI-Legend]: 凡例カテゴリ・ステータス視認性最適化** | `src/data/frameworks.ts`, `WorldMap.tsx`, `FrameworkView.tsx` | `member` (`#2563eb`)、`party` (`#4f46e5`)、`participating_state` (`#0284c7`) の配色分離と凡例からの互換エイリアス除外 |
| **Drop 20** | 2026-10-13 | **Track [Platform-UI]: トップヘッダー・フッターの表示スリム化** | `Navbar.tsx`, `src/i18n/translations.ts` | Navbar の不要バッジと重複検索欄を削除、フッター表記を `World Blocs 2026` に変更 |
| **Drop 19** | 2026-10-13 | **Track [Platform-UI]: 枠組み選択コンボボックス（検索＋選択UI）実装** | `FrameworkCombobox.tsx`, `FrameworkView.tsx`, `CompareView.tsx` | インクリメンタル検索とキーボード操作に対応したカスタムコンボボックスの実装 |
| **Drop 18** | 2026-10-12 | **Track [Treaty-Law]: 国際条約・国際法5枠組みのファクトチェック & 新スキーマ移行** | `src/data/frameworks.ts` | NPT, TPNW, ICC, UNCLOS, P5 の新日付スキーマ移行完了（全33枠組みから旧 `*Year` プロパティを排除） |
| **Drop 17** | 2026-10-12 | **Track [Trade-Econ]: 経済統合・地域協力15枠組みの再整理 & 新スキーマ移行** | `src/data/frameworks.ts` | CPTPP, RCEP, ASEAN, BRICS, SCO, APEC, アラブ連盟, OECD, USMCA, メルコスール等の新日付スキーマ移行と事実関係修正 |
| **Drop 16** | 2026-10-12 | **Track [Platform-UI]: 地図UI改善（地域組織・地図未表示国の左上集約）** | `WorldMap.tsx` | 地図下部にあった小島嶼国リストを左上の地域組織バナー下に統合し、リスト形式へ整理 |
| **Drop 15** | 2026-10-12 | **Track [Platform-UI]: リスト表示UI改善（動的ステータスフィルタ & 件数上部配置）** | `TableView.tsx`, `CountryListView.tsx` | 当該枠組みに存在するステータスのみを選択肢に表示し、表示件数バーをテーブル上部に配置 |
| **Drop 14** | 2026-10-12 | **Track [New-Blocs]: 新興協力枠組み（Pax Silica & WAICO）のデータ是正** | `src/data/frameworks.ts` | Pax Silica への `EUR` 追加、オランダ・台湾のステータス整理、WAICO の非条約 `ratified` 排除 |
| **Drop 13** | 2026-10-12 | **パリ協定（気候変動）の国連公式記録（UNTC）同期** | `src/data/frameworks.ts` | 国連条約局記録に基づき全198参加者（194締約当事者、未批准3、脱退1）の日付・ステータスを整備 |
| **Drop 12** | 2026-10-12 | **国際規格 ISO 3166-1 alpha-3 統一 & 地図脱落防止UI** | `src/data/countries.ts`, `WorldMap.tsx` | 非公式コード（C630等）を正式ISOコード（PRI等）に統一、地域統合体・微小国のフローティング表示実装 |
| **Drop 11** | 2026-10-12 | **安全保障・首脳外交 10枠組みの公式記録に基づく再整理** | `src/data/frameworks.ts` | NATO, OSCE, CSTO, ワルシャワ条約機構, EU, G7, G20, AUKUS, Quad, Five Eyes の寄託記録同期、G20 への `EUR`・`AFU` 追加 |
| **Drop 10** | 2026-10-12 | **プロジェクト共通修正ルールの策定 & `Agent.md` への反映** | `Agent.md` | 一次資料基準、締約国と適用領域の区別、脱退通告と発効の分離、推測日付排除等のデータ編集ルールを定義 |
| **Drop 9** | 2026-10-12 | **加盟国日付スキーマの Year サフィックス撤廃 & String型化** | `src/types/index.ts`, `src/utils/date.ts` | 数値型 `*Year` を廃止し `yyyy`/`yyyymm`/`yyyymmdd` 文字列型の日付フィールドと日付パース関数を新設 |
| **Drop 8** | 2026-10-11 | **先端枠組み比較（WAICO × Pax Silica）& ユニークURLルーティング実装** | `App.tsx`, `CompareView.tsx` | `/compare/:frameworkA/:frameworkB` のURL同期および比較プリセットの追加 |
| **Drop 7** | 2026-10-11 | **セキュリティ強化 & SPA ルーティング・ベースパス修正** | `index.html`, `TableView.tsx`, `vite.config.ts` | CSV Formula Injection 対策サニタイズ、CSPメタタグ設定、GitHub Pages 用 `base: '/world-blocs/'` 設定 |
| **Drop 6** | 2026-10-05 | **UI 日英バイリンガルローカライズ & 言語切替機能実装** | `LanguageContext.tsx`, `src/i18n/translations.ts` | 全UIコンポーネントの日英二言語切替機能実装（デフォルト言語：日本語） |
| **Drop 5** | 2026-10-05 | **タイムライン表示・ステータス優先順位の適正化** | `FrameworkView.tsx`, `TimelineSlider.tsx` | 候補国・オブザーバーが申請年以前に表示される不具合を修正し、ステータス優先順位を定義 |
| **Drop 4** | 2026-10-04 | **経済協力・地域貿易枠組み拡充 & 比較プリセット整備** | `src/data/frameworks.ts`, `CompareView.tsx` | OECD, USMCA, メルコスール, 太平洋同盟, AFTA, EEA, GAFTA の追加と比較プリセット整備 |
| **Drop 3** | 2026-10-04 | **国際枠組み拡充 & 直接URLルーティング（404 Redirect）実装** | `src/data/frameworks.ts`, `public/404.html` | ICC, APEC, アラブ連盟, UNCLOS, P5 の追加、GitHub Pages SPA 用 404 リダイレクト実装 |
| **Drop 2** | 2026-10-03 | **GitHub Pages 公開設定 & ローカル実行環境整備** | `vite.config.ts`, `start.bat`, `stop.bat` | `outDir: 'docs'` ビルド設定、起動・停止用バッチファイル整備 |
| **Drop 1** | 2026-10-03 | **プロジェクト初期化 & 国際関係データベース構築** | `src/` 全般 | Vite + React 19 + TypeScript + Tailwind CSS による SPA 構築、初期8枠組みの実装 |

---

## 4. アーカイブ：実装済み一覧（詳細）

| Track ID | 構想テーマ | 技術仕様・変更詳細 | 到達成果 | 対応 Drop |
|:---:|:---|:---|:---|:---:|
| **Track [CodeQuality-Refinement]** | **Schema 2.0 連携バグ修正・静的解析警告解消・UI/バンドル最適化** | - **バグ修正**: `TableView.tsx` の地域抽出・フィルタ・ソート、および `CompareView.tsx` の主体取得に `getEntity(code)` を適用し、歴史的主体（SUN, DDR, CSK）の欠落を是正。<br>- **集計適正化**: `CompareView.tsx` の比較対象および `CountryListView.tsx` の参加枠組み数集計を `member`, `party`, `participating_state` のみに厳格化（`Agent.md` 第9項準拠）。<br>- **UI改善**: `FrameworkView.tsx` のタイムライン計算に `negotiationsApproved` を反映しヘッダーに `frameworkType` バッジを表示。`CountryProfileModal.tsx` に背景クリックおよび `Escape` キー閉鎖を追加。<br>- **静的解析・バンドル最適化**: `package.json` を `"lint": "oxlint src"` に変更しルーティング関数を `routing.ts` に分離（警告 1,132件 ➔ 0件）。`vite.config.ts` で `vendor` (218kB) / `d3` (21kB) / `app` (393kB) に分割（500kB警告解消）。 | コンポーネント間データ整合性確保、静的解析警告ゼロ化、初期ロード効率化 | **Drop 37** |
| **Track [UI-CategoryRedesign]** | **カテゴリ体系の再編・スリム化 & 所属枠組みの適正化** | - `src/data/frameworks.ts` の `CATEGORY_LABELS` を簡潔な5分類（安全保障 / 経済・通商 / 地域統合 / 首脳・戦略対話 / 国際法・条約）へ更新。<br>- `quad`, `pax_silica`, `waico` のカテゴリを `security` から `summit`（首脳・戦略対話）へ再配置。<br>- `src/types/index.ts` の `FrameworkCategory` コメント注記を同期。 | カテゴリフィルターボタンの視認性向上、各カテゴリの枠組み数適正化（8, 10, 4, 7, 5） | **Drop 36** |
| **Track [IR-RigorousDataModel]** | **国際法・条約実務・国家継承基準のデータモデル刷新 (Schema 2.0)** | - **Phase 1 (Drop 32)**: `EntityType`（主権国家、超国家機関、地域機関、特別実体、歴史的国家）、`HistoricalEntity`（ソ連 `SUN`, 東独 `DDR`, チェコ `CSK`, ユーゴ `YUG`）、`StateSuccession`、`FrameworkType`、`negotiationsApproved`、`getEntity(code)` を新設。<br>- **Phase 2 (Drop 33)**: ワルシャワ条約機構の歴史的主体移行、EU候補国の多段階マイルストーン分離、G7/G20/パリ協定/Pax Silica の非国家主体種別明示。<br>- **Phase 3 (Drop 34)**: `WorldMap.tsx` での後継国ポリゴン動的フォールバック描画と歴史注記ツールチップ、`TableView.tsx` の主体種別バッジ・交渉合意日表示、`CountryProfileModal.tsx` の国家継承ボックス実装。<br>- **Phase 4 (Drop 35)**: 全34枠組みへの `frameworkType` 設定、冗長フィールド削除、全1,090レコードの自動検証（異常値 0 件）。 | 国際法・国家継承関係を構造化データとして保持・可視化する Schema 2.0 への移行完了 | **Drop 32, 33, 34, 35** |
| **Track [Perf-TopoJSON]** | **世界地図 TopoJSON データのバンドル内包 & アセット一元化** | - `public/data` および `docs/data` の重複 JSON を廃止し、`src/data/countries-110m.json` に集約。<br>- `WorldMap.tsx` の非同期 fetch を廃止し、モジュールロード時の同期 TopoJSON 変換へ変更。 | アセット重複の解消および地図初期表示時の通信待機時間ゼロ化 | **Drop 31** |
| **Track [FactCheck-All34]** | **全34枠組みの一次資料・寄託者記録に基づくファクトチェック & 公式ソース配備** | - **第1弾 Summits (Drop 26)**: G7, G20, AUKUS, Quad, Five Eyes, BRICS。<br>- **第2弾 Treaties (Drop 27)**: パリ協定, NPT, TPNW, ICC, UNCLOS, P5。<br>- **第3弾 AsiaPacific (Drop 28)**: CPTPP, RCEP, APEC, ASEAN, Pax Silica, WAICO。<br>- **第4弾 RegionalEurasia (Drop 29)**: ワルシャワ条約機構, SCO, アラブ連盟, AZEC, 平和協議会。<br>- **第5弾 EuropeAmericas (Drop 30)**: EU, EEA, OECD, USMCA, メルコスール, 太平洋同盟, AFTA, GAFTA, OSCE。 | 全34枠組みの加盟国数・除外ルールの公式記録突合完了、および全34枠組みへの一次資料リンク（`sources`）配備 | **Drop 26, 27, 28, 29, 30** |
| **Track [Security-CSTO / Alliances]** | **安全保障枠組みのデータ精緻化 & 一次資料リンク基盤実装** | - NATO の候補国日付・歴史注記補完および `sources` リンクUI実装（Drop 22）。<br>- CSTO のアルメニア活動凍結注記および議会オブザーバー（AFG, SRB）追加（Drop 25）。 | 条約寄託記録・外務省資料との整合性確保 | **Drop 22, 25** |
| **Track [Data-Integrity]** | **正式加盟・メンバー数の厳格カウントルール適用** | - `FrameworkView.tsx` のヘッダー集計から候補国・オブザーバー・脱退国等を除外し、現行の正式メンバーのみを集計。<br>- `Agent.md` にカウント基準を明文化。 | 公式発表の加盟国数との数値一致（NATO:32, EU:27, BRICS:10, パリ協定:194等） | **Drop 24** |
| **Track [Peace-Board]** | **平和協議会（Board of Peace）の新規追加** | - 平和協議会（28カ国・地域）のデータ追加、コソボ（`XKX`）国マスタ新設、国連安保理決議2803号リンク配備。 | 収録枠組み数を33から34へ拡充 | **Drop 23** |
| **Track [Platform-UI / UI-Legend]** | **UI表現・一覧・地図レンダリング・凡例視認性の改善** | - 非国家主体（EUR, AFU）および微小国のフローティング表示（Drop 12）、動的ステータスフィルタ・上部件数表示（Drop 15）、地図左上へのリスト集約（Drop 16）、検索コンボボックス実装（Drop 19）、Navbar・フッターの整理（Drop 20）、凡例カラーの分離（Drop 21）。 | 画面ノイズの削減、ステータス識別性の向上、枠組み検索の操作性改善 | **Drop 12, 15, 16, 19, 20, 21** |
| **Track [Trade-Econ / Treaty-Law / New-Blocs]** | **既存枠組みの新日付スキーマ移行 & 事実関係修正** | - Pax Silica・WAICO の参加国・ステータス是正（Drop 14）。<br>- 経済・地域協力15枠組みの新日付スキーマ移行（Drop 17）。<br>- 国際条約5枠組みの寄託記録突合・従属地域整理・新日付スキーマ移行（Drop 18）。 | 全枠組みにおける数値型 `*Year` プロパティの廃止と文字列型日付スキーマへの統一 | **Drop 14, 17, 18** |
