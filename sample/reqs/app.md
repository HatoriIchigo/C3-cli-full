# アプリケーション要件定義書

## アプリケーションの概要

### システム概要
個人のタスク処理を円滑にするための階層型ToDoアプリケーション。
親子構造を持つタスク管理機能を提供し、ユーザ認証により個人の作業を効率的に管理できるWebアプリケーションです。

### 主要機能
- ユーザ認証機能（ユーザ名・パスワード）
- 階層型タスク管理（親タスク・子タスク）
- タスクの作成・編集・削除・完了状態管理
- Webブラウザ対応（PC・スマートフォン）

## OS/使用するソフトウェアなど

### OS環境
- **フロントエンドサーバ**: Amazon Linux 2023
- **バックエンドサーバ**: Amazon Linux 2023
- **データベース**: RDS（Amazon Linux 2ベース）

### 依存するアプリケーション・サービス
- **PM2**: Node.jsプロセス管理
  - 用途: アプリケーションのプロセス管理とメモリ監視
- **nginx**: リバースプロキシ
  - 用途: フロントエンドの静的ファイル配信とAPIプロキシ
- **RDS MySQL**: データベースサービス
  - 用途: ユーザ情報・タスクデータの永続化

## アプリケーション要件

### プログラミング言語
- **フロントエンド**: JavaScript（ES2020+）
- **バックエンド**: Node.js v18以上

### ビルドツール
- **フロントエンド**: Vite
  - 高速な開発サーバとビルド機能
- **バックエンド**: npm scripts
  - シンプルなビルドとデプロイメント

### フレームワーク
- **フロントエンド**: React 18+
  - 関数コンポーネント + Hooks構成
  - React Router for SPA routing
- **バックエンド**: Express.js 4.x
  - RESTful API設計
  - ミドルウェアベースのアーキテクチャ

### その他ライブラリ

#### フロントエンド
- **axios**: HTTP クライアント
- **react-query/tanstack-query**: サーバ状態管理
- **styled-components** または **CSS Modules**: スタイリング
- **react-hook-form**: フォーム管理

#### バックエンド
- **mysql2**: MySQL ドライバー
- **bcrypt**: パスワードハッシュ化
- **jsonwebtoken**: JWT認証
- **express-validator**: バリデーション
- **cors**: CORS対応
- **helmet**: セキュリティヘッダー設定
- **morgan**: HTTPログ
- **dotenv**: 環境変数管理

### テストで使用するライブラリ

#### フロントエンド
- **Jest**: テストランナー
- **React Testing Library**: コンポーネントテスト
- **MSW (Mock Service Worker)**: API モック

#### バックエンド
- **Jest**: テストランナー
- **Supertest**: HTTP テスト
- **mysql2/promise**: データベースのテスト用接続

## コーディング規約

### 全体共通
- **文字コード**: UTF-8
- **改行コード**: LF
- **インデント**: スペース2個
- **末尾セミコロン**: 必須

### JavaScript/Node.js規約
- **ESLint**: Airbnb JavaScript Style Guide準拠
- **Prettier**: コードフォーマット
- **命名規則**:
  - 変数・関数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - クラス: PascalCase
  - ファイル名: kebab-case

### React規約
- **関数コンポーネント**: 必須（クラスコンポーネント禁止）
- **Hooks**: 公式のRules of Hooksに準拠
- **コンポーネント名**: PascalCase
- **Props**: 型安全性のためのPropTypes使用を推奨

### データベース規約
- **テーブル名**: snake_case（複数形）
- **カラム名**: snake_case
- **インデックス**: パフォーマンス要件に応じて適切に設定

### API設計規約
- **RESTful**: HTTP メソッドとリソースベース設計
- **エラーハンドリング**: 適切なHTTPステータスコード
- **レスポンス形式**: JSON（統一フォーマット）

### セキュリティ規約
- **パスワード**: bcryptでハッシュ化（salt rounds: 12）
- **JWT**: 有効期限設定（1時間）
- **SQL インジェクション**: パラメータ化クエリ必須
- **XSS対策**: 入力値のサニタイズ

### ログ・監視規約
- **ログレベル**: ERROR, WARN, INFO, DEBUG
- **ログ形式**: JSON形式で出力
- **機密情報**: パスワード等のログ出力禁止