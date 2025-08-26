# httpbin API連携仕様書

## 共通
- **ベースURL**: `https://httpbin.org`
    - 開発環境・本番環境共に`httpbin.org`を使用
- **接続方式**: `HTTPS`
- **API概要**:
    - HTTPリクエスト・レスポンスのテスト
    - GET/POSTメソッドのテスト
    
## 接続先別
### GET リクエストテスト
#### 基本情報
- **概要**: GETリクエストのテスト実行
- **URLパス**: `get`
- **メソッド**: GET
- **ヘッダ**:
    - `Content-Type`: リクエストに応じて設定
    - `User-Agent`: アプリケーション識別用
- **クエリパラメータ**:
    - 任意のパラメータ（テスト用）
- **メッセージボディ**:
    - なし
- **出力**:
    - `args (object)`: クエリパラメータ
    - `headers (object)`: リクエストヘッダ
    - `origin (string)`: 送信元IPアドレス
    - `url (string)`: リクエストURL

#### リクエストURL例
【サンプル】
```
https://httpbin.org/get
https://httpbin.org/get?param1=value1&param2=value2
```

#### リクエスト形式
```
GET /get HTTP/1.1
Host: httpbin.org
User-Agent: curl/8.2.1
Accept: */*
```

#### レスポンス
```json
{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.2.1",
    "X-Amzn-Trace-Id": "Root=1-6594009e-4274ba494714ce5829d0a672"
  },
  "origin": "114.148.80.191",
  "url": "https://httpbin.org/get"
}
```

#### 成功時及び失敗時の挙動
- 成功時
    - ステータスコード 200
    - JSON形式でリクエスト情報を返却
- 失敗時
    - ステータスコード 400番台または500番台
    - エラー内容に応じたレスポンス

### POST リクエストテスト
#### 基本情報
- **概要**: POSTリクエストのテスト実行
- **URLパス**: `post`
- **メソッド**: POST
- **ヘッダ**:
    - `Content-Type`: リクエストに応じて設定
    - `User-Agent`: アプリケーション識別用
- **クエリパラメータ**:
    - 任意のパラメータ（テスト用）
- **メッセージボディ**:
    - `application/x-www-form-urlencoded`形式
    - 任意のキー・バリューペア
- **出力**:
    - `args (object)`: クエリパラメータ
    - `data (string)`: 生のリクエストボディ
    - `files (object)`: アップロードファイル
    - `form (object)`: フォームデータ
    - `headers (object)`: リクエストヘッダ
    - `json (object)`: JSONデータ（該当する場合）
    - `origin (string)`: 送信元IPアドレス
    - `url (string)`: リクエストURL

#### リクエストURL例
【サンプル】
```
https://httpbin.org/post
https://httpbin.org/post?query=test
```

#### リクエスト形式
```http
POST /post HTTP/1.1
Host: httpbin.org
Content-Type: application/x-www-form-urlencoded
Content-Length: 35
User-Agent: curl/8.2.1

key1=value1&key1=value2&key2=value3
```

#### レスポンス
```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {
    "key1": [
      "value1",
      "value2"
    ],
    "key2": "value3"
  },
  "headers": {
    "Accept": "*/*",
    "Content-Length": "35",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.2.1",
    "X-Amzn-Trace-Id": "Root=1-65940296-501ee17e2d728da85dbb314b"
  },
  "json": null,
  "origin": "114.148.80.191",
  "url": "https://httpbin.org/post"
}
```

#### 成功時及び失敗時の挙動
- 成功時
    - ステータスコード 200
    - JSON形式でリクエスト情報を返却
- 失敗時
    - ステータスコード 400番台または500番台
    - エラー内容に応じたレスポンス