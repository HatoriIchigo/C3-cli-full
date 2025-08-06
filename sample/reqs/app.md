# ToDoアプリケーション アプリケーション要件書

## アプリケーションの概要

階層構造を持つタスク管理機能を提供するWebベースのToDoアプリケーションです。ユーザ認証機能により個人専用のタスク管理環境を提供し、親タスク・子タスクの2階層構造でプロジェクト管理から具体的な作業項目まで効率的に管理できます。

### 主要機能
- ユーザ認証（ユーザ名・パスワード認証）
- 階層タスク管理（親タスク・子タスクの2階層）
- タスクのCRUD操作
- ユーザ専用タスク表示
- タスクの完了状況管理

## OS/使用するソフトウェアなど

### OS・インフラ
- **OS**: Amazon Linux 2 または Ubuntu Server LTS（EC2インスタンス）
- **クラウドプラットフォーム**: AWS
- **コンピューティング**: EC2インスタンス × 2台（フロントエンド・バックエンド）
- **データベース**: Amazon RDS for MySQL 8.0

### システム依存ソフトウェア
- **Webサーバ**: Nginx（リバースプロキシ・静的ファイル配信）
  - 用途: フロントエンドの静的ファイル配信、バックエンドAPIへのプロキシ
- **プロセス管理**: PM2
  - 用途: Node.jsアプリケーションのプロセス管理・自動再起動
- **SSL/TLS**: Let's Encrypt（Certbot）
  - 用途: HTTPS通信の実現
- **ログ管理**: rsyslog
  - 用途: システムログとアプリケーションログの管理

### セキュリティ・ネットワーク
- **ファイアウォール**: AWS Security Groups
- **アクセス制御**: AWS IAM
- **ネットワーク**: AWS VPC、サブネット

## アプリケーション要件

### フロントエンド要件

#### プログラミング言語・フレームワーク
- **言語**: JavaScript (ES2022+)
- **フレームワーク**: React 18.x
- **状態管理**: React Context API + useReducer
- **ルーティング**: React Router v6

#### ビルドツール・開発環境
- **ビルドツール**: Vite 4.x
- **パッケージマネージャ**: npm
- **トランスパイラ**: Babel（Vite組み込み）
- **モジュールバンドラ**: Rollup（Vite組み込み）

#### UI・スタイリング
- **UIライブラリ**: Material-UI (MUI) v5
- **スタイリング**: CSS-in-JS（emotion - MUI依存）
- **レスポンシブ対応**: MUIのBreakpointシステム
- **アイコン**: Material Icons

#### その他ライブラリ
- **HTTP通信**: Axios
- **フォームバリデーション**: React Hook Form
- **日付処理**: date-fns
- **通知**: react-toastify

#### テストライブラリ（フロントエンド）
- **テストフレームワーク**: Vitest
- **テストライブラリ**: React Testing Library
- **E2Eテスト**: Playwright
- **モック**: MSW（Mock Service Worker）

### バックエンド要件

#### プログラミング言語・フレームワーク
- **言語**: JavaScript (Node.js 18.x LTS)
- **フレームワーク**: Express.js 4.x
- **型チェック**: TypeScript 5.x（段階的導入）

#### データベース・ORM
- **データベース**: MySQL 8.0（Amazon RDS）
- **ORM**: Sequelize 6.x
- **マイグレーション**: Sequelize CLI
- **接続プール**: Sequelize組み込み機能

#### 認証・セキュリティ
- **認証**: JWT（JSON Web Token）
- **パスワードハッシュ化**: bcrypt
- **セッション管理**: express-session
- **CORS**: cors middleware
- **セキュリティヘッダ**: helmet
- **レート制限**: express-rate-limit
- **入力検証**: joi

#### その他ライブラリ
- **ログ出力**: winston
- **環境変数管理**: dotenv
- **API文書化**: swagger-jsdoc + swagger-ui-express
- **HTTP通信**: axios（外部API呼び出し用）

#### テストライブラリ（バックエンド）
- **テストフレームワーク**: Jest
- **APIテスト**: Supertest
- **データベーステスト**: jest-sequelize
- **モック**: jest.mock

### 開発・運用ツール

#### 開発ツール
- **エディタ設定**: EditorConfig
- **コード品質**: ESLint + Prettier
- **Git Hook**: husky + lint-staged
- **環境管理**: Docker（開発環境）

#### CI/CD（将来対応）
- **CI/CD**: GitHub Actions
- **デプロイ**: AWS CLI + スクリプト

## コーディング規約

### 共通規約

#### ファイル・ディレクトリ命名
- **ファイル名**: kebab-case（例: `user-service.js`、`task-list.jsx`）
- **ディレクトリ名**: kebab-case（例: `components/`、`api-routes/`）
- **定数ファイル**: UPPER_SNAKE_CASE（例: `API_ENDPOINTS.js`）

#### コード品質
- **文字エンコーディング**: UTF-8
- **改行コード**: LF（Unix形式）
- **インデント**: スペース2個
- **行末スペース**: 禁止
- **最終行**: 空行で終了

### JavaScript/TypeScript規約

#### 基本ルール
- **セミコロン**: 必須
- **クォート**: シングルクォート優先、JSX内はダブルクォート
- **変数宣言**: `const` > `let` > `var`禁止
- **関数**: アロー関数優先、ただしメソッド定義は通常関数も可

#### 命名規約
- **変数・関数**: camelCase（例: `getUserData`、`taskList`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`、`MAX_RETRY_COUNT`）
- **クラス・コンポーネント**: PascalCase（例: `TaskItem`、`UserService`）
- **プライベート変数**: アンダースコア接頭辞（例: `_privateMethod`）

#### React規約
- **コンポーネントファイル**: PascalCase.jsx（例: `TaskList.jsx`）
- **Hooks**: `use`接頭辞（例: `useTaskData`、`useAuth`）
- **Props**: camelCase、boolean型は`is`/`has`接頭辞
- **State**: オブジェクトで管理、updateは`set`接頭辞

#### 関数・コメント
- **関数**: 単一責任の原則、20行以内推奨
- **JSDoc**: パブリック関数には必須
- **インラインコメント**: 複雑なロジックのみ
- **TODO/FIXME**: 必要に応じて使用、issueリンク推奨

### データベース規約

#### テーブル・カラム命名
- **テーブル名**: snake_case、複数形（例: `users`、`parent_tasks`）
- **カラム名**: snake_case（例: `user_id`、`created_at`）
- **主キー**: `id`（AUTO_INCREMENT）
- **外部キー**: `{テーブル名単数}_id`（例: `user_id`、`parent_task_id`）

#### 制約・インデックス
- **NOT NULL**: 必須項目は明示的に指定
- **DEFAULT**: 適切なデフォルト値を設定
- **INDEX**: 検索対象カラムには適切なインデックス
- **UNIQUE**: 一意制約が必要な項目は明示

### API設計規約

#### RESTful API
- **エンドポイント**: kebab-case（例: `/api/v1/parent-tasks`）
- **HTTPメソッド**: GET（取得）、POST（作成）、PUT（更新）、DELETE（削除）
- **ステータスコード**: 適切なHTTPステータスコードを使用
- **レスポンス形式**: JSON、統一されたエラーレスポンス

#### セキュリティ
- **認証**: JWTトークンをAuthorizationヘッダーで送信
- **バリデーション**: 入力値の検証を必須
- **CORS**: 適切なオリジン制限
- **レート制限**: API呼び出し頻度の制限

### エラーハンドリング

#### フロントエンド
- **エラー境界**: React Error Boundaryの実装
- **ユーザー通知**: 分かりやすいエラーメッセージ
- **ログ出力**: console.error使用、本番環境では外部サービス連携

#### バックエンド
- **エラーレスポンス**: 統一されたJSON形式
- **ログ出力**: winstonを使用した構造化ログ
- **例外処理**: try-catch文の適切な使用

### バージョン管理

#### Git規約
- **ブランチ命名**: `feature/task-name`、`fix/bug-name`
- **コミットメッセージ**: `type: description`形式（例: `feat: add task creation feature`）
- **コミット単位**: 論理的な変更単位でコミット
- **プルリクエスト**: レビュー必須、適切な説明文

#### リリース管理
- **バージョニング**: Semantic Versioning（x.y.z）
- **タグ**: リリース時にGitタグを作成
- **CHANGELOG**: 変更履歴の管理