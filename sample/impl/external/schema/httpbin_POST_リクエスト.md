# httpbin POST リクエストテストリクエストスキーマ

- **コード**: `@src/schema/external/HttpbinPostRequest.py`

## サンプル
```json
{
    "key1": "value1",
    "key2": "value2"
}
```

## スキーマ定義

| キー | 型 | 値の例 | 説明 |
| -- | -- | -- | -- |
| key1 | string | value1 | テスト用パラメータ1 |
| key2 | string | value2 | テスト用パラメータ2 |

## 備考
- フォームデータとして送信される
- Content-Type: `application/x-www-form-urlencoded`
- 任意のキー・バリューペアを設定可能