# ディレクトリ構成

## プロジェクト全体構成

```
todo-app/
├── .claude/                    # Claude用設定・コマンドファイル
│   ├── commands/              # Claudeカスタムコマンド
│   └── config/                # Claude設定ファイル
├── docs/                       # プロジェクトドキュメント
│   ├── reqs/                  # 要件定義書類
│   ├── base/                  # 基本設計書類
│   ├── detail/                # 詳細設計書類
│   ├── note/                  # メモ・議事録
│   └── tmp/                   # 一時ファイル・コンテキスト
├── db/                         # データベース関連ファイル
│   ├── migrations/            # データベースマイグレーションファイル
│   ├── seeds/                 # 初期データ投入用スクリプト
│   └── schemas/               # データベーススキーマ定義
├── frontend/                   # フロントエンド（React）
│   ├── src/                   # アプリケーションソースコード
│   │   ├── components/        # Reactコンポーネント
│   │   ├── pages/             # 画面コンポーネント
│   │   ├── hooks/             # カスタムフック
│   │   ├── services/          # API通信・外部サービス
│   │   ├── utils/             # ユーティリティ関数
│   │   └── styles/            # スタイルファイル
│   ├── public/                # 静的ファイル
│   ├── tests/                 # テストコード
│   │   ├── components/        # コンポーネントテスト
│   │   ├── pages/             # 画面テスト
│   │   └── utils/             # ユーティリティテスト
│   └── build/                 # ビルド成果物
├── backend/                    # バックエンド（Node.js + Express）
│   ├── src/                   # アプリケーションソースコード
│   │   ├── controllers/       # APIコントローラー
│   │   ├── models/            # データモデル
│   │   ├── routes/            # ルーティング定義
│   │   ├── middleware/        # ミドルウェア
│   │   ├── services/          # ビジネスロジック
│   │   ├── utils/             # ユーティリティ関数
│   │   └── config/            # 設定ファイル
│   ├── tests/                 # テストコード
│   │   ├── controllers/       # コントローラーテスト
│   │   ├── models/            # モデルテスト
│   │   ├── routes/            # ルーティングテスト
│   │   └── services/          # サービステスト
│   └── logs/                  # アプリケーションログ
├── infra/                      # インフラ関連設定
│   ├── aws/                   # AWS設定ファイル
│   ├── docker/                # Docker設定（開発環境用）
│   └── scripts/               # デプロイ・運用スクリプト
├── .github/                    # GitHub Actions設定
│   └── workflows/             # CI/CDワークフロー
└── README.md                   # プロジェクト概要
```

## 主要ディレクトリの説明

- **.claude**: Claude用の設定ファイルやカスタムコマンドを格納
    - **commands**: Claude用のカスタムコマンド定義
- **docs**: プロジェクトの各種ドキュメントを管理
    - **reqs**: 要件定義書、仕様書類
    - **base**: 基本設計書類
    - **detail**: 詳細設計書類
- **db**: データベース関連のスクリプトとスキーマ定義
    - **migrations**: データベースのマイグレーションファイル
    - **seeds**: 初期データ投入用スクリプト
- **frontend**: React アプリケーション
    - **src**: フロントエンドのメインソースコード
    - **tests**: フロントエンド用テストコード
- **backend**: Node.js + Express API サーバ
    - **src**: バックエンドのメインソースコード
    - **tests**: バックエンド用テストコード
- **infra**: インフラ構築・運用関連ファイル
    - **aws**: AWS設定とIaCファイル
    - **scripts**: デプロイメント・運用自動化スクリプト
- **.github**: CI/CD設定（GitHub Actions）

## 技術構成との対応

### フロントエンド (React)
- `frontend/src/` にReactアプリケーションを配置
- コンポーネント、ページ、フック等を機能別に分離
- テストコードは `frontend/tests/` に配置

### バックエンド (Node.js + Express)
- `backend/src/` にAPIサーバコードを配置
- MVC構成でコントローラー、モデル、ルートを分離
- テストコードは `backend/tests/` に配置

### データベース (MySQL)
- `db/` にマイグレーション、シード、スキーマ定義を配置
- 親子階層のタスクデータ構造に対応

### インフラ (AWS)
- `infra/aws/` にAWS設定ファイルを配置
- EC2、RDS等のリソース定義と管理スクリプト