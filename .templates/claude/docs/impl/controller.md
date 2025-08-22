# ユーザ登録
共通仕様については　共通.md　を参照してください。

## API仕様（メイン処理）
- **ソース**: `@src/main/controller/User/UserRegisterController.py`
- **URL**: `/user/register`
- **HTTPメソッド**: `POST`
- **ヘッダー**:
    - **共通部**: 共通.md　を参照
- **基底クラス**:
    - BaseController (`@src/main/controller/common/BaseController.py`)
- **処理フロー**:
    1. 受け取ったデータとともに処理を `UserRegisterService.py` に委譲
    2. 正常に終了した場合はセッショントークンを返す


## リクエスト仕様
### 基本情報
- **ソース**: `@src/main/controller/dto/request/UserRegisterControllerRequest.py`
- **基底クラス**:
    - `BaseRequest` (`@src/main/controller/dto/common/BaseRequest.py`)
- **インタフェース**:
    - `BaseRequestInterface` (`@src/main/controller/dto/request/interface/BaseRequestInterface.py`)
- **通信方式**: HTTP/REST
- **認証**: JWT
- **リクエスト形式**: json
- **タイムアウト**: 30-60秒
- **リトライ**: 10秒待機後最大3回まで

### リクエスト内容
```json
{  
    // BaseSessionInfo 共通フィールド・詳細は共通.mdを参照
    "device": { /* 詳細は共通.mdを参照 */},
    "username": "Alice",        // ユーザ名・string
    "password": "Passw0rd"      // パスワード・string
}
```


## レスポレスポンス仕様
### 基本情報
- **ソース**: `@src/main/controller/dto/response/UserRegisterControllerResponse.py`
- **基底クラス**:
    - `BaseResponse` (`@src/main/controller/dto/common/BaseResponse.py`)
- **レスポンス形式**: json

### 正常系レスポンス
```json
{
    // BaseSessionInfo 共通フィールド・詳細は共通.mdを参照
    "device": { /* 詳細は共通.mdを参照 */},
    "session_token": "token"    // セッショントークン・string
}
```

### 異常系レスポンス
共通.mdを参照。

### レスポンスステータス
- 正常系: 201
- エラー系: 各エラーコードに対応するHTTPステータス

