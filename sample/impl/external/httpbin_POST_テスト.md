# httpbin POST リクエストテスト実装書

## 基本情報
- **接続先**: `httpbin.org/post`
- **メソッド**: POST
- **プロトコル**: HTTPS
- **クエリパラメータ**:
    - 任意のパラメータ（テスト用）
- **メッセージボディ**:
    - `application/x-www-form-urlencoded`形式
    - 任意のキー・バリューペア
- **リクエスト**:
    - **ソース**: `@src/schema/external/HttpbinPostRequest.py`
    - **ドキュメント**: `docs/impl/external/schema/httpbin_POST_リクエスト.md`
- **レスポンス**:
    - **ソース**: `@src/schema/external/HttpbinPostResponse.py`
    - **ドキュメント**: `docs/impl/external/schema/httpbin_POST_レスポンス.md`

## 実装時のメソッド
- **メソッド名**: `testHttpbinPost`
- **引数**:
    - form_data (dict, 必須): フォームデータ
    - params (dict, 任意): クエリパラメータ（デフォルト：{}）
- **戻り値**: dict (APIレスポンス全体)

## 処理フロー
1. バリデーション処理
    - フォームデータバリデーション: `validation.validateDict`
        - `form_data=form_data`、`required=True`
    - パラメータバリデーション: `validation.validateDict`
        - `params=params`、`required=False`
    - 参照
        - ソース: `@src/validation.py`
        - ドキュメント: `@docs/impl/validation.md`
2. リクエストスキーマに代入
3. URL構築
    - ベースURL: `https://httpbin.org/post`
    - クエリパラメータがあれば追加
4. HTTPリクエスト（POST）
    - Content-Type: `application/x-www-form-urlencoded`
    - ボディ: フォームデータ
5. レスポンススキーマにマッピング
6. APIレスポンス全体をreturnする