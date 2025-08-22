DB の実装コードを作成

## インプット
- docs/detail/db.md（DB仕様書）　を読み込み
    - 無ければエラー終了
- docs/base/dir-struct.md（ディレクトリ構成）　を読み込み
    - 無ければエラー終了

## 概要
DB初期化時に必要となるスクリプトを記述してください。

作成してほしいファイルは以下2つです。
- 初期化時に必要なスクリプト（initialize.sql）
    - `CREATE TABLE`など、DBMSの初期化を行うスクリプト
- サンプルデータを投入するスクリプト（sample.sql）

## アウトプット
ディレクトリ構成からDB関連のフォルダに追加してください。


## コンテキスト修正
docs/tmp/context.mdで、***実装・DB**を「生成済み」に変更する。
`.claude/commands/CHECK-next-command.md`を確認し、次に行うべき処理を提案する。
