# Kaisha Compass

**会社運営を、点ではなく流れで学ぶ。**

Kaisha Compassは、一社の仮想会社を設立から決算まで追いながら、会社運営に必要な法務・税務・労務・会計・財務を、信頼できる外部教材で学ぶナビゲーションサイトです。

## 方針

専門領域を自前で薄く解説することは主目的にしません。

- 会社で何が起きたか
- その場面で何を知る必要があるか
- どの一次情報・教材を読めばよいか

を整理することに価値を置きます。

## MVP

- 固定ケース会社「株式会社コンパスワークス」
- 設立から初決算まで10イベント
- イベントから教材への絞り込み
- テーマ別ナビゲーション
- 一次情報 / 実務解説の区別
- 教材キーワード検索
- JSONベースの教材DB

## Run locally

ビルド不要です。JSONをfetchするため、ファイルを直接開かずローカルWebサーバーを使ってください。

```bash
python -m http.server 8080
```

その後、`http://localhost:8080` を開きます。

## Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── data/
│   ├── company.json
│   ├── events.json
│   └── resources.json
└── docs/
    ├── CONTENT_MODEL.md
    └── EDITORIAL_POLICY.md
```

## Deployment

完全な静的サイトです。GitHub Pages、Cloudflare Pages、Netlify等でそのまま配信できます。ビルドコマンドは不要です。

## Editing resources

教材の追加は `data/resources.json` に追記します。詳しい編集方針は `docs/EDITORIAL_POLICY.md` を参照してください。
