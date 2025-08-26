# httpbin POST リクエストテストレスポンススキーマ

- **コード**: `@src/schema/external/HttpbinPostResponse.py`

## サンプル
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

## スキーマ定義

| キー | 型 | 値の例 | 説明 |
| -- | -- | -- | -- |
| args | object | {} | クエリパラメータ |
| data | string | "" | 生のリクエストボディ |
| files | object | {} | アップロードファイル |
| form | object | {"key1": ["value1"]} | フォームデータ |
| headers | object | {"Accept": "*/*"} | リクエストヘッダ |
| json | object or null | null | JSONデータ |
| origin | string | 114.148.80.191 | 送信元IPアドレス |
| url | string | https://httpbin.org/post | リクエストURL |

## 備考
- ステータスコード 200で正常レスポンス
- JSON形式で返却される