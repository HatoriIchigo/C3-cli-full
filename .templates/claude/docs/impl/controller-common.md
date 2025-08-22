# コントローラ共通仕様
このドキュメントでは、各コントローラで共通して使用される仕様を定義します。

## 共通ヘッダ
1. x-api-key
    - **説明**: API認証キー
    - **必須**: 任意
    - **形式**: string

## 共通リクエスト

## 共通レスポンス

### 共通エラーレスポンス
1. ErrorResponse
- **説明**: 全エラーレスポンスの基底となるクラス
- **ソース**: `@src/main/controller/dto/common/ErrorResponse.py`

#### レスポンス形式
```json
{
    "status": integer,      // HTTPステータスコード
    "message": "string",    // エラーメッセージ
}
```

#### エラーコード一覧
| コード | HTTPステータス | 説明 |
| -- | -- | -- |
| INVALID_ARGUMENT | 400 | 不正な引数 |
| PERMISSION_DENIED | 403 | 権限が無い |

## レスポンス・リクエスト共通
### BaseSessionInfo
```json
{
    "device": "string"
}
```