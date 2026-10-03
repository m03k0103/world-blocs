# Global Blocs (国際関係データベース)
**Global Blocs: International Relations & Multilateral Frameworks Visualizer**

G7, EU, NATO, AUKUS, Quad, CPTPP, RCEP, パリ協定などの国際的な枠組みや主要条約の参加国・締結国を、世界地図とタイムライン上で直感的に可視化・比較探索できるWebプラットフォームです。

GitHub Pages で完全静的ホスティング（サーバーレス）として動作します。

---

## 主な機能

### 1. 枠組み探索ビュー（Framework Explorer）
- **世界地図可視化（D3.js TopoJSON）**:
  - ステータス別（批准/正式加盟、署名のみ、オブザーバー、対話国、加盟申請、脱退）のカラーコーディング。
  - マウスドラッグでのパン、ホイールやボタンでのズームイン/アウト。
  - ホバーで国名、ステータス、加盟年、特記事項のツールチップ表示。
- **タイムライン・年スライダー（歴史的拡大のアニメーション）**:
  - 創設年から現在（2026年）までのシークバー。
  - 「再生」ボタンで1年ごとに自動進行し、同盟や協定の拡大・変遷をリアルタイムにアニメーション表示。
  - 速度変更（0.5x, 1x, 2x）や主要マイルストーンボタン対応。
- **リスト・テーブル表示**:
  - 表形式での閲覧、地域・ステータス絞り込み、五十音順/加盟年順ソート、CSVエクスポート機能。

### 2. 複数枠組みの掛け合わせ比較（Cross-Framework Comparison）
- **2つの枠組みを選択して比較**:
  - 「EU × NATO」「CPTPP × RCEP」「AUKUS × Quad」「G7 × BRICS」など
- **ベン図風サマリー & 重ね合わせ地図**:
  - 両方に参加している重複国（紫）、Aのみ（青）、Bのみ（赤）を地図上で瞬時に塗り分け。
  - 重複国のリスト、差集合リストのタグクラウド一覧。

### 3. 国から探すプロファイル（Country Profile）
- **国別の参加枠組み一覧**:
  - 国名や地図上の国をクリックすると、その国が参加している条約・枠組みを安全保障、経済・FTA、地域統合、条約などのカテゴリ別に一覧表示。
  - 加盟年、署名年、ステータス、特記事項（例: 英国のEU離脱、米国のTPP離脱、日本のQuad主導など）が確認可能。

---

## 収録枠組み（第1弾）

| カテゴリ | 枠組み・条約 |
| :--- | :--- |
| **安全保障・同盟** | NATO, AUKUS, Quad, Five Eyes |
| **地域統合・地域機構** | EU, ASEAN, SCO（上海協力機構） |
| **首脳サミット・多国間** | G7, G20, BRICS |
| **経済連携・メガFTA** | CPTPP, RCEP |
| **国際条約・環境・軍縮** | パリ協定, NPT（核不拡散条約）, TPNW（核兵器禁止条約） |

---

## 開発環境 & 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite
- **地図描画**: D3.js (`d3-geo`, `topojson-client`) + Natural Earth TopoJSON (110m)
- **UIスタイリング**: Tailwind CSS v4 + Lucide Icons
- **CI/CD**: GitHub Actions (GitHub Pages 自動デプロイ)

---

## ローカル起動方法

### 簡単起動（ワンクリック）
プロジェクト直下の **[`start.bat`](file:///d:/dev/World/start.bat)** をダブルクリックするだけで、ポートの解放、Viteサーバーの起動、待機、ブラウザの自動オープンまで全自動で行われます。
サーバーを終了したい場合は **[`stop.bat`](file:///d:/dev/World/stop.bat)** を実行してください。

### コマンドラインでの起動
```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド（dist/ に出力）
npm run build

# ビルド成果物のプレビュー
npm run preview
```

---

## GitHub Pages での公開手順

GitHub Pages の公開用ファイルは **`docs/`** フォルダ配下に生成・配置されます。

### 1. GitHub へのプッシュ
GitHub上で `global-blocs` という名前で新しいリポジトリを作成後、以下を実行してプッシュします：

```bash
git remote add origin https://github.com/<あなたのユーザー名>/global-blocs.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages の有効化
1. リポジトリの **Settings** > **Pages** を開きます。
2. **Build and deployment** の設定：
   - **Source**: `Deploy from a branch` を選択
   - **Branch**: `main` ブランチ、フォルダを **`/docs`** に選択
3. **Save** をクリックすると、数分で `https://<あなたのユーザー名>.github.io/global-blocs/` にて公開されます！

---

## データの追加・拡張方法

- **新しい枠組みを追加**: `src/data/frameworks.ts` の `FRAMEWORKS` 配列にオブジェクトを追加するだけで、自動的に地図・比較・検索・国プロファイルに反映されます。
- **国データの確認**: `src/data/countries.ts` に約180カ国のISOコード・日本語名・地域情報が定義されています。
