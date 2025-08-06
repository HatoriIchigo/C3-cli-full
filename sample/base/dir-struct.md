# ToDoアプリケーション ディレクトリ構成概要

## ディレクトリ構成

```markdown
- .claude: Claudeで使用するファイルが格納されたディレクトリ
    - commands: Claudeで使用するカスタムコマンド
- docs: 実装を行う上で必要になるドキュメント類
    - reqs: 要求定義書、アプリケーション仕様書
    - base: 基本設計書、機能一覧
    - note: メモ・アイデア
- db: DBで必要になるスクリプトファイル
    - migrations: データベースマイグレーションファイル
    - seeds: テストデータ・初期データ
    - schemas: テーブル定義・ER図
- src: アプリケーションソースコード格納場所
    - frontend: Reactフロントエンドアプリケーション
        - src: Reactソースコード
            - components: 再利用可能なUIコンポーネント
            - pages: 画面別コンポーネント
            - hooks: カスタムReact Hooks
            - utils: ユーティリティ関数
            - api: API通信関連
        - public: 静的ファイル
        - tests: フロントエンドテストコード
    - backend: Node.js + Expressバックエンドアプリケーション
        - src: バックエンドソースコード
            - controllers: APIエンドポイント制御
            - models: データベースモデル（Sequelize）
            - routes: ルーティング定義
            - middleware: 認証・バリデーション等のミドルウェア
            - services: ビジネスロジック
            - utils: ユーティリティ関数
            - config: 設定ファイル
        - tests: バックエンドテストコード
- deployment: デプロイメント関連ファイル
    - scripts: デプロイ・運用スクリプト
    - configs: サーバ設定ファイル（nginx、pm2等）
- .env.example: 環境変数テンプレート
- docker-compose.yml: 開発環境用Docker設定（任意）
- README.md: プロジェクト概要・セットアップ手順
```

## 構成の特徴

### 分離された構成
- **フロントエンド（React）** と **バックエンド（Node.js + Express）** を明確に分離
- 各々が独立したアプリケーションとして EC2 インスタンスにデプロイ可能

### スケーラビリティ考慮
- 機能別にディレクトリを分割（components、controllers、models等）
- テストコードを本体コードと並行配置で保守性向上

### 個人開発向け最適化
- 複雑な CI/CD パイプラインは避け、シンプルなデプロイスクリプト配置
- コスト重視の設計に合わせた必要最小限の構成

### データベース管理
- マイグレーション、シード、スキーマファイルを `db/` 配下で一元管理
- MySQL を使用した階層タスク構造（親タスク・子タスク）に対応

### 開発・運用支援
- 設定ファイル、スクリプト類を適切に分類
- ドキュメント類を `docs/` 配下で体系的に管理