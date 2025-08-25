# ToDoアプリケーション　アプリケーション要件定義書

## アプリケーションの概要
日常のタスク管理を効率化するためのToDoアプリケーションを構築します。個人利用・学習目的に特化したシンプルで理解しやすいWebアプリケーションです。

### 主な機能
- ToDoアイテムの作成、編集、削除
- 完了・未完了状態の管理
- 郵便番号から住所を自動取得する外部API連携機能

### システム構成
Web技術を基盤とした軽量な3層構成アプリケーション（フロントエンド、バックエンド、データベース）

## OS/使用するソフトウェアなど

### 基盤インフラ
- **本番環境**: AWS
  - EC2インスタンス x2台（フロントエンド用、バックエンド用）
  - RDS（MySQL）
  - 人間による手動起動・停止運用（コスト削減のため）

### 開発・実行環境
- **OS**: ローカル環境での開発・実行を基本
- **ブラウザ**: モダンブラウザ対応（Chrome、Firefox、Safari、Edge）
- **データベース**: MySQL（開発時はローカル、本番時はRDS）

### 依存するソフトウェア
- **外部API**: 郵便番号検索サービス（住所自動取得用）
  - 用途: ToDoアイテムに関連付ける住所情報の取得
  - 外部システム連携の実装経験習得

## アプリケーション要件

### プログラミング言語
- **フロントエンド**: JavaScript（ES6+）、TypeScript
- **バックエンド**: Python（3.8以上推奨）

### ビルドツール
- **フロントエンド**: 
  - Node.js（18.x以上）
  - npm または yarn
  - Webpack（React内蔵）
- **バックエンド**: 
  - pip（パッケージ管理）
  - uvicorn（ASGI サーバー）

### フレームワーク
- **フロントエンド**: React（18.x以上）
  - React Hooks を活用した関数コンポーネント
  - React Router（SPA対応）
- **バックエンド**: FastAPI
  - 高速なPython Web API フレームワーク
  - 自動API ドキュメント生成
  - 型ヒント活用

### その他ライブラリ

#### フロントエンド
- **UI**: CSS-in-JS または CSS Modules
- **HTTP クライアント**: axios または fetch API
- **状態管理**: React内蔵（useState、useContext）
- **バリデーション**: react-hook-form（必要に応じて）

#### バックエンド
- **ORM**: SQLAlchemy（データベースアクセス）
- **バリデーション**: Pydantic（FastAPI内蔵）
- **データベース接続**: pymysql または aiomysql
- **HTTP クライアント**: httpx（外部API連携用）
- **環境変数管理**: python-dotenv

#### データベース
- **MySQL**: 8.0以上
- **接続プール**: SQLAlchemyの接続プール機能

### テストで使用するライブラリ

#### フロントエンド
- **テストランナー**: Jest（React内蔵）
- **React テスト**: React Testing Library
- **E2E テスト**: Playwright または Cypress（必要に応じて）

#### バックエンド
- **テストフレームワーク**: pytest
- **テストクライアント**: FastAPI TestClient
- **モック**: pytest-mock
- **データベーステスト**: pytest-asyncio

## コーディング規約

### 全般
- **言語**: コメント・ドキュメントは日本語
- **文字エンコーディング**: UTF-8
- **改行コード**: LF
- **インデント**: スペース（タブ文字禁止）

### フロントエンド（React/JavaScript/TypeScript）
- **インデント**: 2スペース
- **命名規則**:
  - 変数・関数: camelCase
  - コンポーネント: PascalCase
  - 定数: UPPER_SNAKE_CASE
- **ファイル命名**:
  - コンポーネント: PascalCase.tsx
  - 一般的なファイル: camelCase.ts
- **ESLint**: Airbnb設定ベース
- **Prettier**: コード整形自動化
- **型定義**: TypeScript積極活用

### バックエンド（Python/FastAPI）
- **インデント**: 4スペース
- **命名規則**:
  - 変数・関数: snake_case
  - クラス: PascalCase
  - 定数: UPPER_SNAKE_CASE
  - プライベート: _prefixed
- **ファイル命名**: snake_case.py
- **PEP 8**: Pythonコーディング規約準拠
- **型ヒント**: 積極的に活用
- **Docstring**: Google形式

### データベース
- **テーブル名**: snake_case（複数形）
- **カラム名**: snake_case
- **制約命名**: 規則的な命名（pk_、fk_、idx_等）

### Git
- **コミットメッセージ**: 日本語、簡潔な説明
- **ブランチ命名**: feature/機能名、fix/修正内容
- **プルリクエスト**: 詳細な説明とレビュー必須

### セキュリティ
- **機密情報**: 環境変数での管理（.envファイル、リポジトリにコミット禁止）
- **入力値検証**: 必須実装
- **SQLインジェクション**: ORMの適切な使用で対策
- **XSS**: React標準のエスケープ機能活用