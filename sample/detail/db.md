# ToDoアプリケーション DB仕様書

## DB実行環境
- DBMS: MySQL
- Version: 8.0
- 実行環境: Amazon RDS for MySQL
    - シングルAZ構成（個人開発・コスト優先）
    - 自動バックアップ: 有効（7日保持）
    - 手動スナップショット: 必要時に実施
    - メンテナンスウィンドウ: 日曜日 深夜2:00-3:00（JST）

## テーブル仕様書

### users（ユーザ管理テーブル）
ユーザアカウントの管理を行うテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | id | INT | ○ |  |  | ○ | ユーザID（主キー） | AUTO_INCREMENT |
| 2. | username | VARCHAR(50) |  |  | ○ | ○ | ユーザ名 | ログイン時に使用 |
| 3. | password | VARCHAR(255) |  |  |  | ○ | パスワード | bcryptでハッシュ化（salt rounds = 12） |
| 4. | created_at | TIMESTAMP |  |  |  | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 5. | updated_at | TIMESTAMP |  |  |  | ○ | 更新日時 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### parent_tasks（親タスク管理テーブル）
親タスクの管理を行うテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | id | INT | ○ |  |  | ○ | 親タスクID（主キー） | AUTO_INCREMENT |
| 2. | user_id | INT |  | ○ |  | ○ | ユーザID（外部キー） | users.idを参照 |
| 3. | title | VARCHAR(255) |  |  |  | ○ | タスクタイトル | 親タスクの名前 |
| 4. | description | TEXT |  |  |  |  | タスク説明 | 任意項目 |
| 5. | created_at | TIMESTAMP |  |  |  | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 6. | updated_at | TIMESTAMP |  |  |  | ○ | 更新日時 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### child_tasks（子タスク管理テーブル）
子タスクの管理を行うテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | id | INT | ○ |  |  | ○ | 子タスクID（主キー） | AUTO_INCREMENT |
| 2. | parent_task_id | INT |  | ○ |  | ○ | 親タスクID（外部キー） | parent_tasks.idを参照 |
| 3. | title | VARCHAR(255) |  |  |  | ○ | タスクタイトル | 子タスクの名前 |
| 4. | is_completed | BOOLEAN |  |  |  | ○ | 完了状態 | DEFAULT FALSE |
| 5. | created_at | TIMESTAMP |  |  |  | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 6. | updated_at | TIMESTAMP |  |  |  | ○ | 更新日時 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## インデックス設計

### プライマリインデックス
- **users.id**: PRIMARY KEY (AUTO_INCREMENT)
- **parent_tasks.id**: PRIMARY KEY (AUTO_INCREMENT)  
- **child_tasks.id**: PRIMARY KEY (AUTO_INCREMENT)

### セカンダリインデックス
- **users.username**: UNIQUE INDEX（ユーザ名重複防止・ログイン検索高速化）
- **parent_tasks.user_id**: INDEX（ユーザ別親タスク検索用）
- **child_tasks.parent_task_id**: INDEX（親タスク別子タスク検索用）

## 外部キー制約

### 制約設定
- **parent_tasks.user_id** → **users.id**
  - ON DELETE CASCADE: ユーザ削除時に関連する親タスクも削除
  - ON UPDATE CASCADE: ユーザID変更時に関連レコードも更新
  
- **child_tasks.parent_task_id** → **parent_tasks.id**
  - ON DELETE CASCADE: 親タスク削除時に関連する子タスクも削除
  - ON UPDATE CASCADE: 親タスクID変更時に関連レコードも更新

## データ関係図

```
users (1) ----< parent_tasks (1) ----< child_tasks (*)
  |                |                      |
  |- id            |- id                  |- id
  |- username      |- user_id (FK)        |- parent_task_id (FK)
  |- password      |- title               |- title
  |- created_at    |- description         |- is_completed
  |- updated_at    |- created_at          |- created_at
                   |- updated_at          |- updated_at
```

## テーブル設計の考慮事項

### 正規化
- 第3正規形まで正規化済み
- 冗長性を排除し、データ整合性を保証

### パフォーマンス
- 頻繁にアクセスされるカラム（user_id、parent_task_id）にインデックス設定
- ユーザ名検索用のUNIQUEインデックス

### セキュリティ
- パスワードはbcryptでハッシュ化（salt rounds = 12）
- 外部キー制約によるデータ整合性保証

### 拡張性
- TIMESTAMPカラムで作成・更新履歴を管理
- 親タスクの説明フィールド（description）は任意項目として柔軟性確保