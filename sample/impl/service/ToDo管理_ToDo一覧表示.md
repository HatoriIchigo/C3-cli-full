# ToDo一覧表示 ビジネスロジック実装書

## service
### 概要
- ToDo一覧表示のメイン処理

### 引数
- completed (bool, 任意): 完了状態フィルタ（true=完了済み、false=未完了、None=全件）
- limit (int, 任意): 取得件数制限（1-100の範囲、None=全件取得）
- offset (int, 任意): 取得開始位置（0以上、None=0）

### 戻り値
- int: 0-正常、それ以外は異常

### 処理フロー
1. バリデーション処理（`@src/validation.py`参照）
    - completedパラメータバリデーション: `validation.validateBooleanOptional`
        - `value=completed`、`required=False`
    - limitパラメータバリデーション: `validation.validateLimit`
        - `limit=limit`、`required=False`
    - offsetパラメータバリデーション: `validation.validateOffset`
        - `offset=offset`、`required=False`
    - 参照
        - ソース: `@src/validation.py`
        - ドキュメント: `@docs/impl/validation.md`
2. DB取得処理
    - 対象テーブル: `todos`
    - model: `@src/model/todos.py`参照
    - 取得条件:
        - completedが指定されている場合: `completed = completed`
        - 指定されていない場合: 条件なし
    - 並び順: `created_at DESC`
    - 取得制限: limitが指定されている場合は適用
    - 取得開始位置: offsetが指定されている場合は適用
    - 取得フィールド: `id, title, description, completed, created_at, updated_at`
3. DB取得結果確認
    - DB取得失敗時は異常終了（エラーコード返却）
4. データ整形処理
    - `formatTodoList`関数に処理を委譲
        - `todos=取得したTodoリスト`
        - 戻り値として整形されたデータをlistで受け取る
5. 正常系レスポンスを戻す

## formatTodoList
### 概要
- ToDo一覧データを整形する

### 引数
- todos (list): DB取得したTodoアイテムのリスト

### 戻り値
- list: 整形されたTodoアイテムのリスト

### 処理フロー
1. 各ToDoアイテムに対して以下の処理を実行:
    - タイムスタンプをISO 8601形式に変換（`created_at`, `updated_at`）
    - `description`がNullの場合は空文字列に変換
2. 整形されたリストを返却