# httpbin GET リクエストテストレスポンススキーマ

- **コード**: `@src/schema/external/HttpbinGetResponse.py`

## サンプル
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

## スキーマ定義

| キー | 型 | 値の例 | 説明 |
| -- | -- | -- | -- |
| args | object | {} | クエリパラメータ |
| headers | object | {"Accept": "*/*"} | リクエストヘッダ |
| origin | string | 114.148.80.191 | 送信元IPアドレス |
| url | string | https://httpbin.org/get | リクエストURL |

## 備考
- ステータスコード 200で正常レスポンス
- JSON形式で返却される