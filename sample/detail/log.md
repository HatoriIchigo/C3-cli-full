# ToDoアプリケーション ログ詳細設計書

## 1. 概要
本書は、ToDoアプリケーションにおけるログ設計の詳細仕様を定義します。個人開発・学習目的に特化したコスト重視の軽量なログ設計とし、効率的な開発支援と最低限の運用監視を目的とします。

## 2. ログ設計方針

### 2.1 基本方針
- **構造化ログ**: JSON形式でのログ出力により、検索・集計・分析を容易にする
- **レベル管理**: 適切なログレベルにより、開発・本番環境での適切な情報量を確保
- **セキュリティ配慮**: 機密情報のログ出力を禁止し、個人情報の適切な管理を実施
- **運用効率**: 個人開発に適したシンプルな運用を重視し、過度な複雑さを避ける
- **コスト最適化**: 学習目的のため、AWS利用料金を最小限に抑制

### 2.2 ログレベル定義
| レベル | 用途 | 出力基準 |
|--------|------|----------|
| ERROR | エラー | システム障害、業務処理エラー、予期しない例外 |
| WARN | 警告 | 回復可能なエラー、外部API呼び出し失敗、リトライ処理 |
| INFO | 情報 | API呼び出し開始・終了、ToDo CRUD操作、外部API連携 |
| DEBUG | デバッグ | 開発・テスト環境での詳細情報、変数値、処理フロー |

### 2.3 ログ出力先
- **開発環境**: コンソール出力（標準出力）
- **本番環境**: 標準出力（コスト最適化のため、ファイル出力は最小限）

## 3. ログフォーマット仕様

### 3.1 共通フォーマット（JSON）
```json
{
  "timestamp": "2024-01-01T10:30:45.123Z",
  "level": "INFO",
  "component": "backend-api",
  "category": "business",
  "message": "処理内容の説明",
  "request_id": "req_1234567890",
  "user_id": null,
  "extra": {}
}
```

### 3.2 フィールド定義
| フィールド名 | 必須 | 型 | 説明 |
|-------------|------|----|----- |
| timestamp | ○ | string | ISO8601形式のタイムスタンプ（UTC） |
| level | ○ | string | ログレベル（ERROR/WARN/INFO/DEBUG） |
| component | ○ | string | コンポーネント識別子（backend-api/frontend） |
| category | ○ | string | ログカテゴリ（business/system/security/performance） |
| message | ○ | string | ログメッセージ（日本語） |
| request_id | - | string | リクエスト識別子（API呼び出し時） |
| user_id | - | string | ユーザ識別子（ユーザ管理なしのためnull） |
| extra | - | object | 追加情報（任意） |

### 3.3 コンポーネント別フォーマット

#### バックエンドAPI
```json
{
  "timestamp": "2024-01-01T10:30:45.123Z",
  "level": "INFO",
  "component": "backend-api",
  "category": "business",
  "message": "ToDoアイテム作成完了",
  "request_id": "req_1234567890",
  "user_id": null,
  "extra": {
    "method": "POST",
    "endpoint": "/api/todos",
    "todo_id": 123,
    "processing_time_ms": 45
  }
}
```

#### 外部API連携
```json
{
  "timestamp": "2024-01-01T10:30:45.123Z",
  "level": "INFO",
  "component": "backend-api",
  "category": "system",
  "message": "郵便番号検索API呼び出し完了",
  "request_id": "req_1234567890",
  "user_id": null,
  "extra": {
    "external_api": "zipcloud",
    "zipcode": "123-4567",
    "response_time_ms": 200,
    "status_code": 200
  }
}
```

#### エラーログ
```json
{
  "timestamp": "2024-01-01T10:30:45.123Z",
  "level": "ERROR",
  "component": "backend-api",
  "category": "system",
  "message": "データベース接続エラー",
  "request_id": "req_1234567890",
  "user_id": null,
  "extra": {
    "error_type": "DatabaseConnectionError",
    "error_message": "Connection timeout",
    "stack_trace": "...",
    "retry_count": 3
  }
}
```

## 4. ログカテゴリ定義

### 4.1 カテゴリ分類
| カテゴリ | 説明 | 出力例 |
|----------|------|--------|
| business | 業務処理関連 | ToDo作成、更新、削除、完了状態変更 |
| system | システム関連 | DB接続、外部API呼び出し、アプリケーション起動・停止 |
| security | セキュリティ関連 | 不正リクエスト、入力値検証エラー |
| performance | パフォーマンス関連 | 処理時間、レスポンス時間 |

## 5. セキュリティ考慮事項

### 5.1 ログ出力禁止情報
以下の情報は、ログに出力してはならない：
- データベース接続情報（パスワード、接続文字列）
- AWS認証情報（アクセスキー、シークレットキー）
- API実行に関わる機密情報（Parameter Store値の詳細）
- 個人を特定可能な情報（具体的な住所、氏名相当の情報）

### 5.2 個人情報の取り扱い
- **ToDo内容**: タイトル・説明文は業務上必要な範囲でログ出力可能
- **住所情報**: 郵便番号は出力可能、詳細住所は必要最小限に留める
- **IPアドレス**: セキュリティ監査のため出力許可（個人開発のため実質的な影響は軽微）

### 5.3 ログアクセス制御
- **開発環境**: 制限なし（個人開発のため）
- **本番環境**: EC2インスタンスへのSSHアクセス権限者のみ

## 6. ログローテーション・保持ポリシー

### 6.1 開発環境
- **ローテーション**: 実装しない（コンソール出力のため）
- **保持期間**: なし（標準出力のため）

### 6.2 本番環境
- **基本方針**: コスト最適化のため最小限の設定
- **ローテーション**: システムデフォルト（journald）を利用
- **保持期間**: 7日間（コスト考慮）

### 6.3 ログ容量管理
- **監視**: 手動確認（個人運用のため）
- **容量制限**: 特に設定しない（t3.microの制約範囲内での運用）

## 7. 実装方針

### 7.1 ログライブラリ
- **Python（FastAPI）**: 標準ライブラリ `logging` + `structlog`（構造化ログ対応）
- **JavaScript（React）**: `console.*` + カスタムフォーマット

### 7.2 ログ設定例（Python）
```python
import structlog
import logging

# 構造化ログ設定
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.PrintLoggerFactory(),
    context_class=dict,
    cache_logger_on_first_use=True,
)

# 使用例
logger = structlog.get_logger("backend-api")
logger.info("ToDoアイテム作成開始", 
           category="business",
           request_id="req_123", 
           extra={"title": "買い物"})
```

## 8. 監視・アラート設計

### 8.1 基本方針
- **軽量監視**: 個人開発・学習目的のため最小限
- **手動確認**: アラートは実装しない（コスト・複雑性考慮）
- **開発支援**: デバッグ効率向上を重視

### 8.2 監視対象
- **アプリケーション起動・停止**: 手動確認
- **エラー発生状況**: ログファイル手動確認
- **外部API呼び出し状況**: ログ出力による確認

## 9. 運用手順

### 9.1 開発時のログ確認
1. **リアルタイム確認**: コンソール出力をターミナルで確認
2. **フィルタリング**: `grep` コマンドでレベル・カテゴリ別に抽出
3. **JSON解析**: `jq` コマンドでJSONログを整形表示

### 9.2 本番環境でのログ確認
1. **SSH接続**: EC2インスタンスにSSH接続
2. **ログ確認**: `journalctl` コマンドでサービスログを確認
3. **エラー調査**: `grep "ERROR"` でエラーログを抽出

### 9.3 障害対応時のログ活用
1. **エラー発生時刻の特定**: timestampフィールドで時系列確認
2. **リクエスト追跡**: request_idでリクエスト単位の処理を追跡
3. **外部API問題の切り分け**: external_api関連ログで状況確認

### 9.4 コスト管理
- **ログ出力量**: 開発時にINFOレベルで適切な出力量を調整
- **本番運用**: ERRORとWARNを中心とした運用でコスト削減
- **定期見直し**: 月次でログ出力量とコストを確認

## 10. 学習目的での考慮事項

### 10.1 学習効果の最大化
- **構造化ログの実践**: JSON形式での出力スキルを習得
- **ログレベルの使い分け**: 適切なレベル設定の経験積み
- **デバッグ効率**: ログを活用した効率的な問題解決手法の習得

### 10.2 将来拡張への配慮
- **フォーマット拡張**: 新しいフィールド追加時の互換性確保
- **監視システム連携**: CloudWatch Logs等への移行を想定した設計
- **スケールアップ**: 将来的なアクセス増加時の対応余地

## 11. 付録

### 11.1 ログ出力コマンド例
```bash
# エラーログのみ抽出
journalctl -u todo-app | grep "\"level\": \"ERROR\""

# 特定時間のログ抽出
journalctl -u todo-app --since "2024-01-01 10:00:00" --until "2024-01-01 11:00:00"

# JSON整形表示
journalctl -u todo-app | tail -10 | jq .
```

### 11.2 環境別設定差異
| 項目 | 開発環境 | 本番環境 |
|------|----------|----------|
| 出力先 | コンソール | 標準出力 |
| ログレベル | DEBUG | INFO |
| 保持期間 | なし | 7日 |
| フォーマット | JSON | JSON |