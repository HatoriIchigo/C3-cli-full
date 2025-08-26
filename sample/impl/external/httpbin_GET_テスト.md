# httpbin GET リクエストテスト実装書

## 基本情報
- **接続先**: `httpbin.org/get`
- **メソッド**: GET
- **プロトコル**: HTTPS
- **クエリパラメータ**:
    - 任意のパラメータ（テスト用）
- **リクエスト**:
    - **ソース**: なし（リクエストボディなし）
    - **ドキュメント**: なし
- **レスポンス**:
    - **ソース**: `@src/schema/external/HttpbinGetResponse.py`
    - **ドキュメント**: `docs/impl/external/schema/httpbin_GET_レスポンス.md`

## 実装時のメソッド
- **メソッド名**: `request`
- **引数**:
    - params (dict, 任意): クエリパラメータ（デフォルト：{}）
- **戻り値**: dict (APIレスポンス全体)

## 処理フロー
1. バリデーション処理
    - パラメータバリデーション: `validation.validateDict`
        - `params=params`、`required=False`
    - 参照
        - ソース: `@src/validation.py`
        - ドキュメント: `@docs/impl/validation.md`
2. URL構築
    - ベースURL: `https://httpbin.org/get`
    - クエリパラメータがあれば追加
3. HTTPリクエスト（GET）
4. レスポンススキーマにマッピング
5. APIレスポンス全体をreturnする