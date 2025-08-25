# ToDo一覧表示 コントローラ実装書

## API仕様（メイン処理）
- **URL**: `/api/todos`
- **HTTPメソッド**: `GET`
- **ヘッダー**: 
    - `Content-Type: application/json`
- **処理フロー**:
    1. クエリパラメータを取得
    2. 受け取ったデータとともに処理をサービス層（`@src/service/TodoListService.py`）に委譲
    3. 正常に終了した場合はToDo一覧をJSONで返す
    4. 異常終了した場合は適切なエラーレスポンスを返す

## リクエスト仕様

### 基本情報
- **通信方式**: HTTP/REST
- **認証**: なし
- **リクエスト形式**: クエリパラメータ
- **タイムアウト**: 30秒
- **リトライ**: なし

### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|-----|
| completed | boolean | 任意 | 完了状態フィルタ（true=完了済み、false=未完了） | ?completed=true |
| limit | integer | 任意 | 取得件数制限（1-100の範囲） | ?limit=10 |
| offset | integer | 任意 | 取得開始位置（0以上） | ?offset=20 |

### リクエスト例
```
GET /api/todos
GET /api/todos?completed=false
GET /api/todos?limit=10&offset=0
GET /api/todos?completed=true&limit=5
```

## レスポンス仕様

### 基本情報
- **レスポンス形式**: JSON

### 正常系レスポンス
```json
[
  {
    "id": 1,
    "title": "買い物リスト作成",
    "description": "スーパーで野菜と肉を購入する",
    "completed": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "title": "会議資料準備",
    "description": "",
    "completed": true,
    "created_at": "2024-01-14T15:20:00Z",
    "updated_at": "2024-01-15T09:15:00Z"
  }
]
```

### 空の場合のレスポンス
```json
[]
```

### 異常系レスポンス
```json
{
    "error_id": "E004",
    "message": "クエリパラメータが不正です"
}
```

```json
{
    "error_id": "E003",
    "message": "サーバーエラーが発生しました"
}
```

### レスポンスステータス
- **正常系**: 200 OK
- **エラー系**: 
    - 400 Bad Request (E004): クエリパラメータが不正
    - 500 Internal Server Error (E003): DB取得失敗

## エラーハンドリング
| エラーID | HTTPステータス | メッセージ | 発生条件 |
|---------|---------------|-----------|----------|
| E003 | 500 | サーバーエラーが発生しました | DB取得失敗 |
| E004 | 400 | クエリパラメータが不正です | パラメータバリデーション失敗 |