API IFを詳細に設計していく

## インプット
- docs/base/func/$ARGUMENT.md をインプットとする

## 概要
該当のAPI IFを詳細に詰めていく。
現在の情報に以下情報を足していく。
1. エンドポイント.Method： GET/POST/DELETE/PUT など
2. 認証方式
3. クエリパラメータ（任意）
4. リクエストパラメータ 及び バリデーション条件
5. 成功時レスポンス 及び エラー時レスポンス
    - `status`と`message`は共通で入れること

## サンプル
```markdown
## 1. 親タスク作成機能

### 概要
親タスクを作成。
インプットされたデータをDBに登録する。

### エンドポイント
- **URL**: `/api/tasks/parent/create`
- **Method**: POST
- **認証**: JWT Bearer Token必須

### クエリパラメータ
- `page`: ページ番号（デフォルト1）
- `limit`: 1ページあたりの件数（デフォルト10、最大100）
- `status`: フィルタ条件（pending/in_progress/completed）
- `sort`: ソート条件（created_at/due_date/priority）
- `order`: ソート順（asc/desc、デフォルトdesc）

### リクエスト
\`\`\`json
{
  "title": "文字列（必須、1-200文字）",
  "description": "文字列（任意、0-1000文字）",
  "due_date": "YYYY-MM-DD形式（任意）",
  "priority": "数値（任意、1-5、デフォルト3）"
}
\`\`\`

### レスポンス
**成功時（201 Created）**
\`\`\`json
{
  "status": "success",
  "message": "success",
  "data": {
    "task_id": "UUID形式",
    "title": "タスクタイトル",
    "description": "タスク説明",
    "due_date": "2024-12-31",
    "priority": 3,
    "status": "pending",
    "created_at": "ISO8601形式",
    "updated_at": "ISO8601形式"
  }
}
\`\`\`

**エラー時（400 Bad Request）**
\`\`\`json
{
  "status": "error",
  "message": "バリデーションエラーメッセージ",
  "errors": {
    "title": ["タイトルは必須です", "タイトルは200文字以内で入力してください"]
  }
}
\`\`\`
```

## アウトプット
上書き保存とする。
