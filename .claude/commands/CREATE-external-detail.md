外部接続連携の詳細設計書を作成

## 以下を最後に表示してください
- 全ての処理が正常に成功した場合: `result: success`
- 何らかのエラーで失敗した場合： `result: failed: <失敗原因>`

## インプット
- docs/note/note.md（メモ、必須）　を読み込み
- docs/note/external.md（外部連携仕様書メモ、任意）
- docs/note/external/*（外部連携仕様書メモ、任意）

## 概要
メモから外部連携の必要があるかを確認し、外部連携の必要がある場合は外部連携の仕様を抽出する。
なお、そもそも外部連携の必要がない場合は正常終了とする。
外部連携先別（ベースURL別）に保存。

## フォーマット
外部連携の通信方法について記述してください。
記述例は以下になります。

```markdown
## 共通
- **ベースURL**: `http://api.weather.co.jp`
    - AWS SystemManager ParameterStoreを用いて取得
    - キー名は`weather-api-host`
    - 開発環境は`stub-01`ハードコーディングで向ける
- **接続方式**: `HTTP`
- **API概要**:
    - 天気の取得
    - 地震情報の取得
- **ヘッダ**:
    - `x-api-key (string)`: APIキー

## 接続先別
### ID照会

#### 基本情報
- **概要**: 契約IDを取得
- **メソッド**: GET
- **入力**:
    - `username (string)`: ユーザ名
    - `password (string)`: パスワード、ハッシュ
- **出力**:
    - `id (string)`: 契約ID
    - `message (string)`: メッセージ

#### リクエスト形式
\`\`\`json
{"username": "Alice", "password": "Passw0rd"}
\`\`\`

#### レスポンス
\`\`\`json
{"id": "A0001", "message": "FOO"}
\`\`\`
#### 成功時及び失敗時の挙動
- 成功時
    - ステータスコード 204
- 失敗時
    - ステータスコード 400番台
```

## アウトプット
docs/detail/external/外部連携先名.md に保存してください。


