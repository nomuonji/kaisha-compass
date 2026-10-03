# Content model

Kaisha Compassは「記事の量」ではなく、会社イベントと信頼できる教材の関係をデータとして持つ。

## Core entities

### Company
固定されたケース会社。ゲームではなく、教材に文脈を与えるための共通ケース。

### Event
会社で起きる出来事。

例:
- 設立
- 初受注
- 高額資産の購入
- 採用
- 給与支払
- 融資
- 役員変更
- 決算

### Resource
外部教材へのリンク。

必須フィールド:
- id
- title
- provider
- url
- sourceType: official | practical
- difficulty
- time
- why
- topics[]
- eventIds[]
- tags[]
- lastCheckedAt: 最終リンク・内容確認日（YYYY-MM-DD）
- validAsOf: 年度・法令時点に依存する場合の任意メモ

## Design rule

分類は「税務」「労務」のような教科だけに閉じない。
ユーザーはまず会社イベントから入り、必要に応じて複数の専門領域へ横断する。

## Maintenance rules

- 制度・年度依存の教材は `lastCheckedAt` と `validAsOf` を持つ。
- 公式一次情報がある場合は official を優先し、practical は理解補助として併置する。
- 同じテーマに「概要」「手続」「法令原文」がある場合、難易度を分けて併存させてよい。
- URLが生きていても制度年度が古い場合は更新対象とする。

## Future extensions

- sourceType: course / video / book / tool
- lastCheckedAt
- validAsOf
- lawRevisionTags
- resource relationship / prerequisite
- separate topic landing pages for SEO
- dead-link checker
