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

## Design rule

分類は「税務」「労務」のような教科だけに閉じない。
ユーザーはまず会社イベントから入り、必要に応じて複数の専門領域へ横断する。

## Future extensions

- sourceType: course / video / book / tool
- lastCheckedAt
- validAsOf
- lawRevisionTags
- resource relationship / prerequisite
- separate topic landing pages for SEO
- dead-link checker
