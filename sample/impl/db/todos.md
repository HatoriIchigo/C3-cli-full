# todos テーブル DB実装書

## DB情報
- **Engine**: MySQL
- **Version**: 8.0
- **ホスト**: `db_host`
- **ユーザ名**: `db_user`
- **パスワード**: `db_password`
- **DB名**: `db_name_dev` (開発環境) / `db_name_prod` (本番環境)
- **ポート**: `db_port`

## ソース
- `@src/main/db/item/todos/TodosItem.py`

## テーブル定義

### 1. id
- **概要**: ToDoアイテムIDを格納する
- **Type**: BIGINT
- **Not Null**: ○
- **Primary Key**: ○
- **UNIQUE**: ○
- **AUTO_INCREMENT**: ○
- **備考**: プライマリキー

### 2. title
- **概要**: ToDoのタイトルを格納する
- **Type**: VARCHAR(200)
- **Not Null**: ○
- **備考**: ToDoの見出し（必須）

### 3. description
- **概要**: ToDoの詳細説明を格納する
- **Type**: TEXT
- **Not Null**: -
- **備考**: ToDoの詳細内容（任意、最大1000文字程度想定）

### 4. completed
- **概要**: ToDoの完了状態を格納する
- **Type**: BOOLEAN
- **Not Null**: ○
- **Default**: FALSE
- **備考**: FALSE=未完了, TRUE=完了

### 5. created_at
- **概要**: 作成日時を格納する
- **Type**: TIMESTAMP
- **Not Null**: ○
- **Default**: CURRENT_TIMESTAMP
- **備考**: レコード作成時に自動設定

### 6. updated_at
- **概要**: 更新日時を格納する
- **Type**: TIMESTAMP
- **Not Null**: ○
- **Default**: CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- **備考**: レコード更新時に自動更新

## インデックス設計

### 主キー
- **PRIMARY KEY**: `(id)`

### 複合インデックス
- **idx_completed_created**: `(completed, created_at DESC)`
- **用途**: 完了状態による絞り込みと作成日時での並び替えの最適化

### 単項インデックス
- **idx_created_at**: `(created_at DESC)`
- **用途**: 作成日時での並び替えの最適化

## 制約・ルール

### アプリケーション側バリデーション
- `title` は空文字列不可
- `completed` のデフォルト値は `FALSE`
- `created_at`, `updated_at` は自動設定

### データ型選択理由
- **id**: BIGINT - 将来的な大量データを想定
- **title**: VARCHAR(200) - 要件定義の最大文字数制限
- **description**: TEXT - 長文対応、NULLable
- **completed**: BOOLEAN - 2値状態の明確な表現
- **TIMESTAMP**: タイムゾーン考慮、自動更新機能活用

## 運用ルール
- **データ保持**: 無制限（個人利用のため削除ポリシーなし）
- **論理削除**: 実装しない（物理削除のみ）
- **バックアップ**: RDS自動バックアップ（7日間保持）
- **マイグレーション**: SQLAlchemy Alembicを使用