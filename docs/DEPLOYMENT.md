# Kaisha Compass — 本番公開の確認方法

## 公開経路の正本

- GitHub: `nomuonji/kaisha-compass` / `main`
- Cloudflare Worker: `kaisha-compass`（`wrangler.jsonc` の `name` と一致させる）
- 想定の公開ドメイン: `https://kaisha-compass.antonbase.com`（`astro.config.mjs` の `site`）
- Astro 7 + Cloudflare adapter。大半の教材は事前生成され、`/features/` だけはMy Portal CMSを読むオンデマンドSSR。

**GitHub Actions の Validate Astro はデプロイではない。** その成功だけで公開の成功と解釈しない。

## Cloudflare Workers Builds の設定

既存の Worker を使用する。新規Workerや別ホスティングを作成しない。

1. Cloudflare ダッシュボードの **Workers & Pages → kaisha-compass → Settings → Builds** で GitHub `nomuonji/kaisha-compass` が接続されていることを確認。
2. Production branch は `main`。Root directory はリポジトリ直下。
3. デプロイコマンドは `npx wrangler deploy` を基本とする。ルートの `wrangler.jsonc` にある `build.command` が `npm run build` と `node scripts/check-deploy-assets.mjs` を必ず実行するため、WranglerがAstroをビルドしてからアップロードする。
4. Cloudflare側で `npm run build` も指定している場合は二重ビルドになる。動作には問題ないが、冗長なのでクラウド側のビルドコマンドを空にするか、こちらの事前ビルドを運用ルールに合わせて統一すること。同期設定を確認するまでは変更しない。
5. Worker の Routes / Custom Domains に `kaisha-compass.antonbase.com` が正しく関連付けられていることも確認する。GitHubのcanonical URL設定はDNS/Cloudflare routeを自動作成しない。

## 404の切り分け

1. GitHub Actions の `Validate Astro` でUX・Astro build・deploy assetsの3段階が全て成功しているか。
2. `dist/practice/index.html`・`dist/company-law/index.html` と個別ページの生成が成功しているか。
3. Cloudflare Workers Buildsの production build が **最新 main commit** を対象に成功したか。古いコミットの成功を新しい教材の反映証明にしない。
4. Cloudflare Workerの最新本番デプロイが同じコミットか。失敗時はbuild logとdeploy logを確認する。
5. Workerの workers.dev URLとカスタムドメインの両方を比較する。前者だけ表示できるならドメイン/ルート設定、両者で旧ページや404なら未反映・ビルド・アセット配信を疑う。

以下は本番でHTTP 200と本文の表示を確認する対象:

- `https://kaisha-compass.antonbase.com/`
- `https://kaisha-compass.antonbase.com/practice/`
- `https://kaisha-compass.antonbase.com/practice/kk-or-gk/`
- `https://kaisha-compass.antonbase.com/company-law/`
- `https://kaisha-compass.antonbase.com/company-law/articles-of-incorporation/`
- `https://kaisha-compass.antonbase.com/features/`（My Portal CMS、SSRのため別途検証）

## 公開成功の報告基準

「mainに反映」「Astroの生成成功」「Cloudflareへデプロイ成功」「本番HTTP応答200」「ページが読める」は別の事実として扱う。公開環境を読めない場合、完了・復旧と書かない。
