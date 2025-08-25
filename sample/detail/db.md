# ToDoアプリケーション DB詳細設計書

## DB実行環境
- DBMS: MySQL
- Version: 8.0

## 接続方法

### 開発環境
- **DB構築環境**: ローカル(Docker)
- **ホスト**: `localhost`(ハードコーディング)
- **ユーザ名**: `todoapp`(ハードコーディング)
- **パスワード**: `tododev123`(ハードコーディング)
- **DB名**: `todoapp_dev`(ハードコーディング)
- **ポート**: `3306`(ハードコーディング)

### 商用環境
- **DB構築環境**: AWS RDS MySQL
- **ホスト**:
    - AWS Systems Manager Parameter Store
    - キー名: `todo-db-host`
- **ユーザ名**:
    - AWS Secrets Manager
    - **arn**: `arn:aws:secretsmanager:ap-northeast-1:000000000000:secret:todo-db-credentials-XXXXXX`
- **パスワード**:
    - AWS Secrets Manager
    - **arn**: `arn:aws:secretsmanager:ap-northeast-1:000000000000:secret:todo-db-credentials-XXXXXX`
- **DB名**:
    - AWS Systems Manager Parameter Store
    - キー名: `todo-db-name`
- **ポート**:
    - AWS Systems Manager Parameter Store
    - キー名: `todo-db-port`

## テーブル仕様

### todos（ToDoアイテム管理テーブル）
ToDoアイテムの管理を行うメインテーブルです。

| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | id | BIGINT | ○ | - | ○ | ○ | ToDoアイテムID | AUTO_INCREMENT、プライマリキー |
| 2. | title | VARCHAR(200) | - | - | - | ○ | タイトル | ToDoの見出し（必須） |
| 3. | description | TEXT | - | - | - | - | 詳細説明 | ToDoの詳細内容（任意、最大1000文字程度想定） |
| 4. | completed | BOOLEAN | - | - | - | ○ | 完了状態 | FALSE=未完了, TRUE=完了 |
| 5. | created_at | TIMESTAMP | - | - | - | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 6. | updated_at | TIMESTAMP | - | - | - | ○ | 更新日時 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### インデックス設計

#### todos テーブル
- **主キー**: `PRIMARY KEY (id)`
- **複合インデックス**: `INDEX idx_completed_created (completed, created_at DESC)` 
  - 完了状態による絞り込みと作成日時での並び替えの最適化
- **単項インデックス**: `INDEX idx_created_at (created_at DESC)`
  - 作成日時での並び替えの最適化

### 制約・ルール

#### todos テーブル制約
- `title` は空文字列不可（アプリケーション側でバリデーション）
- `completed` のデフォルト値は `FALSE`
- `created_at`, `updated_at` は自動設定

#### データ型選択理由
- **id**: BIGINT - 将来的な大量データを想定
- **title**: VARCHAR(200) - 要件定義の最大文字数制限
- **description**: TEXT - 長文対応、NULLable
- **completed**: BOOLEAN - 2値状態の明確な表現
- **TIMESTAMP**: タイムゾーン考慮、自動更新機能活用

### データ保持期間・運用ルール
- **データ保持**: 無制限（個人利用のため削除ポリシーなし）
- **論理削除**: 実装しない（物理削除のみ）
- **バックアップ**: RDS自動バックアップ（7日間保持）
- **マイグレーション**: SQLAlchemy Alembicを使用