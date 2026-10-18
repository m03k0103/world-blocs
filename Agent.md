# World Blocs プロジェクト固有開発ルール (Agent.md)

本ドキュメントは、World Blocs リポジトリ固有のデータスキーマおよびドメインルールを定義します。
コミュニケーション規範、文字コード原則、Implementation Plan の事前承認、コマンドの自律実行、Git ブランチ運用・即時 push、`Drops.md` の標準4大構成・最新化、不具合修正時の2大責務（再発防止ガード＋横展開確認）等の共通ルールは、すべて [`GLOBAL_RULES.md`](file:///C:/Users/m03k0/.gemini/antigravity/rules/GLOBAL_RULES.md) に準拠します。

---

## 1. 国際枠組みデータ編集・品質管理ルール (Schema 2.0)

1. **枠組みの法的・制度的性質（`FrameworkType`）の明示**:
   すべての枠組みに以下のいずれかの法的性質を設定し、性質に応じたステータスと日付フィールドを使用する。
   - `treaty`: 法的拘束力を持つ国際条約（締約国は `status: 'party'` または `'member'`）
   - `international_org`: 常設国際機関（加盟国は `status: 'member'`）
   - `regional_integration`: 超国家的・包括的地域統合体（加盟国は `status: 'member'`）
   - `summit_forum`: 首脳会議・協議枠組み（参加国は `status: 'member'`）
   - `political_dialogue`: 政治・安全保障対話フォーラム（参加国は `status: 'participating_state'` または `'member'`）

2. **法的・制度的イベントと日付フィールドの厳密対応（非互換原則）**:
   以下の日付フィールドは相互に互換ではない。一次資料で確認できる実際のイベントに合致するフィールドのみを設定する。
   - 条約関連：`signed`（署名）、`ratified`（批准・受諾・承認）、`accession`（署名を経ない加入）、`inForce`（当該国に対する発効）
   - 機関・フォーラム関連：`joined`（機関・枠組みへの加盟・参加）、`firstParticipated`（初参加）、`declarationSigned`（共同宣言・創設宣言への署名）
   - 加盟プロセス関連：`applied`（加盟申請）、`candidate`（公式な候補国認定）、`negotiationsApproved`（加盟交渉開始の決定・合意）、`negotiationsStarted`（実質的交渉・政府間会合の開始）
   - 資格変動関連：`suspended`（参加資格停止）、`withdrawalNotified`（脱退通告）、`withdrawn`（脱退の法的発効）

3. **非条約型フォーラムの制約**:
   `summit_forum` および `political_dialogue` には `ratified` や `accession` を設定しない。参加・加盟には `joined`、初参加には `firstParticipated`、共同宣言署名には `declarationSigned` を使用する。

4. **多段階プロセス（候補国・脱退）の分離**:
   - **加盟プロセス**: 加盟申請（`applied`）、候補国認定（`candidate`）、交渉開始合意（`negotiationsApproved`）、実質交渉開始（`negotiationsStarted`）を区別して記録する。
   - **脱退プロセス**: 脱退通告（`withdrawalNotified`）と脱退発効（`withdrawn`）を分離する。発効前は脱退済み（`status: 'withdrawn'`）として扱わない。署名撤回（`status: 'unsigned'`）は締約国の脱退と区別する。

5. **参加主体の種別（`EntityType`）と国家・国際機関の区別**:
   主権国家（`sovereign_state`）と、超国家機関（`supranational`: 欧州連合 `EUR`）、地域国際機関（`regional_org`: アフリカ連合 `AFU`）、特別実体（`special_entity`: コソボ `XKX` 等）を `entityType` で明確に区別する。主権国家には ISO 3166-1 alpha-3 の正式コードを使用する。

6. **歴史上の国家（`HistoricalEntity`）と国家継承（`StateSuccession`）の明示**:
   ソ連（`SUN`）、東ドイツ（`DDR`）、チェコスロバキア（`CSK`）、ユーゴスラビア（`YUG`）等の歴史的参加主体は、現在の国コードに直接置き換えず、`historicalEntities.ts` の定義および国家継承関係（`continuation` / `unification` / `dissolution` / `secession`）を用いて記録する。

7. **締約国と適用領域の区別**:
   条約の締約国（主権国家）と、当該条約が領域適用される海外領土・自治領を区別する。非独立地域を個別に登録する場合は、寄託者記録における法的根拠を確認する。

8. **一次資料・寄託者記録の基準と日付フォーマット**:
   - 日付とステータスは、条約本文、寄託者（depositary）の公式記録、各機構の公式発表を根拠とする。
   - 日付は `yyyy`、`yyyymm`、`yyyymmdd` のいずれかで格納する。公式資料で月日が特定できない場合は年のみ（または省略）とし、推測で月日を補完しない。

9. **正式加盟・メンバー数の厳格カウント基準**:
   枠組み詳細ヘッダーの「参加国・地域」数や比較集計においては、候補国（`candidate`）、未批准署名国（`signatory`）、オブザーバー（`observer`）、パートナー（`partner` / `dialogue`）、非当事国（`non_party`）、脱退国（`withdrawn`）、署名撤回国（`unsigned`）を除外し、**現行の正式構成員（`member`, `party`, `participating_state`）のみ**を集計する。

---

## 2. ビルドおよび品質検証コマンド (CI/ローカル共通)

1. **Linter 実行**:
   ```bash
   npm run lint
   ```

2. **TypeScript 型検査および本番ビルド**:
   ```bash
   npm run build
   ```
   - `tsc -b && vite build` が実行され、静的成果物は GitHub Pages 公開用ディレクトリである `docs/` に出力される。
   - ソースコードやデータの修正後は、成果報告（Walkthrough）前に上記コマンドでエラー 0 件を確認すること。
