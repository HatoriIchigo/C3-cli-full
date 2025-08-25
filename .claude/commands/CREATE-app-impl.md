アプリケーション詳細設計書をコントローラ実装書、ビジネスロジック実装書、バリデーション実装書に分割

## 以下を最後に表示してください
- 全ての処理が正常に成功した場合: `result: success`
- 何らかのエラーで失敗した場合： `result: failed: <失敗原因>`

## インプット
- docs/detail/func/$ARGUMENT.md（アプリケーション詳細設計書）
- docs/impl/validation.md （バリデーション実装書、任意）
- docs/note/func/小機能.md（機能一覧、任意）

## 概要
アプリケーション詳細設計書をコントローラ実装書、ビジネスロジック実装書、バリデーション実装書に分割

### ビジネスロジック実装書
より具体的なロジックへと落としていく。
関数名などはこの段階で決定。
ビジネスロジックの責務は、必要最低限の引数を受け取り、処理を行うこと。

#### ビジネスロジック実装概要
メインサービスは`serviceメソッド`で固定。
`serviceメソッド`は必要なデータのみ受け取り、intで返す（処理固定）。
ビジネスロジックでの正常・異常はcontroller層で受け取り、レスポンスを返すとする。

【サンプル】
```markdown
## service
### 概要
- ユーザ登録のメイン処理
### 引数
- username (string): ユーザ名
- email (string): メールアドレス
- password (string): パスワード
- password_check (string): 確認用パスワード
### 戻り値
- int: 0-正常、それ以外は異常
### 処理フロー
1. バリデーション処理（`@src/validation.py`参照）
    - ユーザ名バリデーション: `validation.validateUserName`
        - `username=username`、`required=True`
    - パスワードバリデーション: `validation.validatePassword`
        - `password=password`、`required=True`
    - 参照
        - ソース: `@src/validation.py`
        - ドキュメント: `@docs/impl/validation.md`
2. パスワード照合
    - `password`と`password_check`が正しいか照合
    - 異なる場合は`403エラー`
3. パスワードハッシュ化
    - `hash_password`関数に処理を委譲
        - `password=password`
        - 戻り値としてハッシュ化されたパスワード、stringで受け取る
4. DB登録
    - 対象テーブル: `User`
    - model: `@src/model/users.py参照`
5. Sakura連携システムへデータ登録
    - `/register`
    - リクエストjson形式
        \`\`\`
        {"username": "username", "password": "ハッシュ化されたパスワード"}
        \`\`\`
    - レスポンス
        - 正常終了：`status_code = 200`
        - それ以外は異常として503を返す
5. 正常系レスポンスを戻す

## hash_password
### 概要
- パスワードをハッシュ化する
### 引数
- password (string): パスワード
### 戻り値
- string: ハッシュ化したパスワード
### 処理フロー
1. パスワードをハッシュ化する
```

必要な場合にのみ、実装書(docs/impl/)配下やソース(src/)配下への閲覧を許可します。
ただし、読み込む場合は一度ファイル名のみから推測し、必要なもののみ読み込むこと。


### コントローラ実装書
コントローラに関する実装書を作成。

#### API仕様（メイン処理）
【サンプル】
```markdown
- **URL**: `/user/register`
- **HTTPメソッド**: `POST`
- **ヘッダー**:
- **処理フロー**:
    1. 受け取ったデータとともに処理を サービス層（`@src/service/UserRegisterService.py`） に委譲
    2. 正常に終了した場合はセッショントークンを返す
```

#### リクエスト仕様
```markdown
### 基本情報
- **通信方式**: HTTP/REST
- **認証**: JWT
- **リクエスト形式**: json
- **タイムアウト**: 30-60秒
- **リトライ**: 10秒待機後最大3回まで

### リクエスト内容
\`\`\`json
{  
    "username": "Alice",        // ユーザ名・string
    "password": "Passw0rd"      // パスワード・string
}
\`\`\`
```

#### レスポレスポンス仕様
【サンプル】
```markdown
### 基本情報
- **レスポンス形式**: json

### 正常系レスポンス
\`\`\`json
{
    "session_token": "token"    // セッショントークン・string
}
\`\`\`

### 異常系レスポンス
\`\`\`json
{
    "status_code": 400
}
\`\`\`

### レスポンスステータス
- 正常系: 201
- エラー系: 各エラーコードに対応するHTTPステータス
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

## アウトプット
1. **コントローラ実装書**: docs/impl/controller/$ARGUMENT.md
2. **ビジネスロジック実装書**: docs/impl/service/$ARGUMENT.md
3. **バリデーション実装書**: docs/impl/validation.md