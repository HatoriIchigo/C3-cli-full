# データベース詳細設計書

## DB実行環境
- DBMS: MySQL  
- Version: 8.0
- 実行環境: AWS RDS MySQL
    - シングルAZ構成（個人開発・コスト重視のため）
    - 自動バックアップ有効、保持期間7日間
    - インスタンスクラス: db.t3.micro（無料利用枠）
    - ストレージ: 20GB（gp2）

## テーブル仕様書

### users（ユーザ管理テーブル）
ユーザアカウント情報の管理を行うテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | user_id | INT | ○ |  |  | ○ | ユーザID | AUTO_INCREMENT |
| 2. | username | VARCHAR(50) |  |  | ○ | ○ | ユーザ名 | ログイン時に使用 |
| 3. | password_hash | VARCHAR(255) |  |  |  | ○ | パスワードハッシュ | bcryptで暗号化して格納 |
| 4. | created_at | DATETIME |  |  |  | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 5. | updated_at | DATETIME |  |  |  | ○ | 更新日時 | ON UPDATE CURRENT_TIMESTAMP |

### parent_tasks（親タスク管理テーブル）
親タスクの情報を管理するテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | parent_task_id | INT | ○ |  |  | ○ | 親タスクID | AUTO_INCREMENT |
| 2. | user_id | INT |  | ○ |  | ○ | ユーザID | FOREIGN KEY (users.user_id) |
| 3. | title | VARCHAR(255) |  |  |  | ○ | タスクタイトル |  |
| 4. | description | TEXT |  |  |  |  | タスク詳細 |  |
| 5. | status | ENUM('pending', 'completed') |  |  |  | ○ | ステータス | DEFAULT 'pending' |
| 6. | created_at | DATETIME |  |  |  | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 7. | updated_at | DATETIME |  |  |  | ○ | 更新日時 | ON UPDATE CURRENT_TIMESTAMP |

### child_tasks（子タスク管理テーブル）
子タスクの情報を管理するテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | child_task_id | INT | ○ |  |  | ○ | 子タスクID | AUTO_INCREMENT |
| 2. | parent_task_id | INT |  | ○ |  | ○ | 親タスクID | FOREIGN KEY (parent_tasks.parent_task_id) |
| 3. | title | VARCHAR(255) |  |  |  | ○ | タスクタイトル |  |
| 4. | description | TEXT |  |  |  |  | タスク詳細 |  |
| 5. | status | ENUM('pending', 'completed') |  |  |  | ○ | ステータス | DEFAULT 'pending' |
| 6. | created_at | DATETIME |  |  |  | ○ | 作成日時 | DEFAULT CURRENT_TIMESTAMP |
| 7. | updated_at | DATETIME |  |  |  | ○ | 更新日時 | ON UPDATE CURRENT_TIMESTAMP |

## テーブル関係
- users (1) ← (N) parent_tasks: 1ユーザは複数の親タスクを持つ
- parent_tasks (1) ← (N) child_tasks: 1親タスクは複数の子タスクを持つ

## インデックス設計
- users.username: UNIQUE制約によりインデックス自動生成
- parent_tasks.user_id: 外部キー制約によりインデックス自動生成
- child_tasks.parent_task_id: 外部キー制約によりインデックス自動生成

## データ整合性制約
- CASCADE削除設定:
  - usersテーブル削除時 → 関連するparent_tasksも削除
  - parent_tasksテーブル削除時 → 関連するchild_tasksも削除
- 文字コード: utf8mb4
- 照合順序: utf8mb4_unicode_ci