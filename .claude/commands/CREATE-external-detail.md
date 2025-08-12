外部接続連携の詳細設計書を作成

## インプット
- docs/note/ 配下（メモ）　を読み込み
    - 無ければエラー終了

## 概要
メモから外部連携の必要があるかを確認し、外部連携の必要がある場合は外部連携の仕様を抽出する

## フォーマット
外部連携の通信方法について記述してください。
記述例は以下になります。

```markdown
1. 接続先
    - `http://api.foo.bar.co.jp`
2. 接続方式
    - `HTTP`
3. リクエスト
    - json形式
    \`\`\`json
    {"username": "Alice", "password": "Passw0rd"}
    \`\`\`
        - username: ユーザ名
        - password: パスワード（ハッシュ）
4. レスポンス形式
    - json形式
    \`\`\`json
    {"status": "OK", "message": "FOO"}
    \`\`\`
        - status: リクエスト結果
        - message: メッセージ
5. 成功時　及び　失敗時の挙動
    - 成功時
        - ステータスコード 204
    - 失敗時
        - ステータスコード 400番台
```

## アウトプット
docs/detail/external.md に保存してください。


## コンテキスト修正
docs/tmp/context.mdで、**ドキュメント・外部接続詳細設計書**を「生成済み」に変更する。
`.claude/commands/CHECK-next-command.md`を確認し、次に行うべき処理を提案する。
