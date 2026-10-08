# Kaisha Compass 編集運用

Kaisha Compassは仮想会社の一年を読む学習サイトです。公開資料の原典、説明文、場面間の学習導線を継続改善します。

編集は既存の `AGENTS.md`、`docs/EDITORIAL_POLICY.md`、`docs/UX_DECISIONS.md` に従い、既存の概要→場面→領域→資料要約→外部原典の階層を維持します。一次資料の内容・適用時点を実際に確認し、未確認の法律・税務事項を断定しません。

My Portal Agent HQの `kaisha-compass-manager` が対象を選び、Workerがリポジトリの具体的なファイルを編集します。既存のUX検証・Astroビルド・GitHub CIで形式と整合性を確認し、変更履歴を残します。機械的な検証は法的な正しさを保証しません。

サイトの品質改善と、別システムによるSEO・インデックス運用は区別します。作業ログやWork Item IDは公開コンテンツに載せません。必要な改善がない回は、変更せず終了します。
