外部連携詳細設計書を元に外部連携実装書を作成

## 以下を最後に表示してください
- 全ての処理が正常に成功した場合: `result: success`
- 何らかのエラーで失敗した場合： `result: failed: <失敗原因>`

## インプット
- docs/detail/external/$ARGUMENT.md（アプリケーション詳細設計書、必須）
- docs/note/external/$ARGUMENT.md（機能一覧、任意）
- docs/note/external.md（機能一覧、必須）

## 概要
インプットを元に外部連携実装書を作成。
実装するにあたり必要な情報を記載。
接続先ごとに分割してファイル出力。

## リクエストスキーマ
BODYを送信する場合のリクエストで送る際のスキーマを定義。
（リクエストスキーマが存在しなければなし）

接続先（URLごと）に別々にファイル出力。
例えば、天気APIの天気取得を利用するなら、docs/impl/schema/external/schema/天気_地震情報取得_リクエスト.mdのように保存。

【サンプル】
```markdown
## 天気API 地震情報取得リクエストスキーマ
- **コード**: `@src/schema/external/WeatherEarthQuakeRequest.py`
【サンプル】
\`\`\`json
{
    "place": {
        "prefecture": "Ibaraki",
        "city": "Mito"
    },
    "type": 2
}
\`\`\`

| キー | 型 | 値の例 |
| -- | -- | -- |
| place.prefecture | string | Ibaraki |
| place.city | string | Mito |
| type | number | 2 |
```

## レスポンススキーマ
レスポンスで受信する際のスキーマを定義。

接続先（URLごと）に別々にファイル出力。
例えば、天気APIの天気取得を利用するなら、docs/impl/schema/external/schema/天気_地震情報取得_レスポンス.mdのように保存。

【サンプル】
```markdown
## 天気API 地震情報取得リクエストスキーマ
- **コード**: `@src/schema/external/WeatherEarthQuakeResponse.py`
【サンプル】
\`\`\`json
{
    "status": "OK",
    "message": "message"
}
\`\`\`

| キー | 型 | 値の例 |
| -- | -- | -- |
| status | string | OK/NG |
| message | string | Mito |
```

## 外部連携実装書
接続先等を記載。
接続先（URLごと）に別々にファイル出力。
例えば、天気APIの天気取得を利用するなら、docs/impl/schema/external/天気_地震情報取得.mdのように保存。

リクエスト、レスポンス、バリデーションはソースやドキュメントに飛ばす。
なお、バリデーションドキュメントが存在しない場合は作成してもしくは追記。
詳細は バリデーション実装書 を参照。

```markdown
## 基本情報
- **接続先**: `zipcloud.ibsnet.co.jp/api/search`
- **メソッド**: GET
- **プロトコル**: HTTPS
- **リクエストパラメータ**:
    - `zipcode` (string, 必須): 郵便番号（7桁、ハイフン付きも可）
    - `limit` (number, 任意): 最大件数（デフォルト：20）
    - `callback` (string, 任意): JSONP用コールバック関数名
- **リクエスト**:
    - **ソース**: `@src/schema/external/WeatherEarthQuakeRequest.py`
    - **ドキュメント**: `docs/impl/schema/external/schema/天気_地震情報取得_リクエスト.md`
- **レスポンス**:
    - **ソース**: `@src/schema/external/WeatherEarthQuakeResponse.py`
    - **ドキュメント**: `docs/impl/schema/external/schema/天気_地震情報取得_レスポンス.md`

## 実装時のメソッド
- **メソッド名**: `searchZipCode`
- **引数**:
    - zipcode (string): 郵便番号
    - limit (number, 任意): 最大件数（デフォルト：20）
- **戻り値**: string (住所)

## 処理フロー
1. バリデーション処理
    - ユーザ名バリデーション: `validation.validateZipCode`
        - `zipCode=zipcode`、`required=True`
    - 参照
        - ソース: `@src/validation.py`
        - ドキュメント: `@docs/impl/validation.md`
2. リクエストスキーマに代入
3. URL構築
    - ベースURL + `?zipCode=zipCode&` + `limit=limit`
4. APIリクエスト
5. レスポンススキーマから`place`を取得
6. `address1` + `address2` + `address3` を文字列として結合し、returnする
```

### バリデーション実装書
ビジネスロジック実装書でのバリデーション処理の具体的な内容を記載。

#### 共通仕様
【サンプル】
```markdown
## 共通仕様
- バリデーションエラー時は`ValidationException`を発生させる
```

#### 個別仕様
バリデーション実装書に書いて無ければ追記。
バリデーションメソッドは以下要件を守ること。
- **引数要件**: 2つ（バリデーション対象引数、必要/任意）
- **戻り値要件**: bool
- **エラー要件**: バリデーションに失敗した場合は`ValidationException`

【サンプル】
```markdown
## ユーザ関連のバリデーション
### validUserName
- **概要**: ユーザ名のバリデーション
- **引数**:
    - username: string
    - required: bool （trueの場合引数は必須）
- **戻り値**
    - bool: （trueの場合は値が設定されている）
- **バリデーション条件**:
    - a-zA-Z0-9
    - 8文字～32文字
- **処理フロー**
    1. `required == false`かつ`username == ""` なら false で返却
    2. `username`のバリデーション処理
        - バリデーション失敗時は`ValidationException`
    3. true を返却
```

