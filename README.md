# C3-CLI-full

CLIアプリケーション及びwebのバックエンド開発に対応した**Claudeカスタムスラッシュコマンド**集です。

## 📖 概要

このプロジェクトは、ソフトウェア開発の各フェーズで使用できる30+のClaudeカスタムコマンドを提供します。要件定義からテスト実装まで、開発プロセス全体をサポートします。

## 🚀 主要コマンド

### 📊 ワークフロー・進行管理系
- `/CREATE-workflow` - 開発ワークフローの作成
- `CHECK-next-command` - 次に実行すべきコマンドの確認

### 📋 ドキュメント作成系（CREATE-XXX）
- `CREATE-app-req` - アプリケーション要求仕様書作成
- `CREATE-app-detail` - 詳細設計書作成
- `CREATE-db-detail` - データベース設計書作成
- `CREATE-doc-base` - 基本ドキュメント作成
- その他多数

### 🔧 実装系（IMPL-XXX）
- `IMPL-tdd-*` - TDD（Test-Driven Development）サポート
- `IMPL-infra-code` - インフラコード実装
- `IMPL-local-devenv` - ローカル開発環境構築

### 🔄 リバースエンジニアリング系（REV-XXX）
- `REV-app-*` - 既存コードからドキュメント生成
- `REV-db-detail` - DBスキーマからドキュメント生成

### 🛠️ 修正・保守系（FIX-XXX, REVFIX-XXX）
- `FIX-app-detail` - 詳細設計の修正
- `REVFIX-docs-from-env` - 環境からドキュメント再生成

## 📚 ドキュメント

- **[開発の流れ](documentation/dev-flow.md)** - 開発プロセスの詳細
- **[コマンド詳細](documentation/commands.md)** - 各コマンドの使用方法

## ⚙️ 環境設定

### 前提条件

- **Claude Code CLI** が導入済みであること
- プロジェクトルートで Claude Code CLI が利用可能であること

### セットアップ手順

#### 1. プロジェクトのクローン・ダウンロード

```bash
# GitHubからクローンする場合
git clone <repository-url> C3-cli-full
cd C3-cli-full

# またはZIPダウンロード後に解凍
cd C3-cli-full
```

#### 2. .claudeディレクトリの確認

プロジェクトルートに `.claude/commands/` ディレクトリが存在することを確認してください：

```
.claude/
└── commands/
    ├── CREATE-app-detail.md
    ├── CREATE-app-funclist.md
    ├── CREATE-app-req.md
    └── ... (全28個のコマンドファイル)
```

#### 3. Claude Code CLIでの利用開始

プロジェクトディレクトリで Claude Code CLI を起動すると、自動的に`.claude/commands/`内のスラッシュコマンドが読み込まれます：

```bash
# Claude Code CLI起動
claude code

# スラッシュコマンドの確認
/help
```

#### 4. 作業ディレクトリ構成の準備

コマンドによっては特定のディレクトリ構成を前提としています：

```
your-project/
├── docs/
│   ├── note/              # 初期メモ・要件メモ
│   ├── reqs/              # 要件定義書
│   ├── base/              # 基本設計書
│   ├── detail/            # 詳細設計書
│   │   └── func/          # 個別機能詳細設計
│   ├── unit-test/         # テストケース
│   │   └── func/          
│   ├── tmp/               # 一時ファイル
│   └── fix-spec/          # 改修仕様書
└── result/                # チェック結果格納
```

### 利用方法

#### スラッシュコマンドの実行

Claude Code CLI内で `/` から始まるコマンドを入力：

```bash
# 例：要件定義書作成
/CREATE-doc-req

# 例：機能一覧作成  
/CREATE-app-funclist

# 例：TDD Red フェーズ
/IMPL-tdd-red
```

#### コマンド一覧の確認

```bash
# 利用可能なカスタムコマンドを確認
/help

# または
/commands
```

### 注意事項

- 各コマンドは **docs/** ディレクトリ構造を前提として設計されています
- 初回利用時は `docs/note/` にプロジェクトの要件メモを配置することから開始してください
- コマンドによってはユーザーの承認を求める場合があります
- 生成されたファイルは適宜レビュー・編集してください

## 📁 プロジェクト構成

```
├── .claude/commands/     # メインのスラッシュコマンド（30+）
├── documentation/        # 詳細ドキュメント
└── sample/              # 生成ドキュメントのサンプル例
    ├── base/           # 基本設計書類
    ├── detail/         # 詳細設計書類
    ├── reqs/           # 要求仕様書類
    └── unit-test/      # テスト関連
```

## 💡 命名規則

| プレフィックス | 用途 |
|---|---|
| **CREATE-XXX** | 新規作成 |
| **FIX-XXX** | 改修仕様書を元に修正 |
| **IMPL-XXX** | 実装関連 |
| **REV-XXX** | ソースコードを元にドキュメント類を逆生成 |
| **REVFIX-XXX** | 実装を元にドキュメントを再修正 |
| **CHECK-XXX** | 品質チェック関連 |
