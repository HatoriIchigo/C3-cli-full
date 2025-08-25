郵便番号　住所取得API

## 基本情報
- **ベースURL**: `https://zipcloud.ibsnet.co.jp/api/search`
- **Method**: GET

## リクエストパラメータ
| パラメータ名 | 項目名 | 必須 | 備考 |
| -- | -- | -- | -- |
| zipcode | 郵便番号 | ○ | 7桁の数字。ハイフン付きでも可。完全一致検索。 |
| callback | コールバック関数名 | - | JSONPとして出力する際のコールバック関数名。UTF-8でURLエンコードした文字列。 |
| limit | 最大件数 | - | 同一の郵便番号で複数件のデータが存在する場合に返される件数の上限値（数字）　※デフォルト：20 |

【サンプル】
（例）郵便番号「7830060」で検索する場合
`https://zipcloud.ibsnet.co.jp/api/search?zipcode=7830060`

## レスポンス
フィールド名 | 項目名 | 備考
| -- | -- | -- |
| status | ステータス | 正常時は 200、エラー発生時にはエラーコードが返される。 |
| message | メッセージ | エラー発生時に、エラーの内容が返される。 |
| results | zipcode | 郵便番号	7桁の郵便番号。ハイフンなし。 |
| results | prefcode | 都道府県コード	JIS X 0401 に定められた2桁の都道府県コード。 |
| results | address1 | 都道府県名 |
| results | address2 | 市区町村名 |
| results | address3 | 町域名 |
| results | kana1 | 都道府県名カナ |
| results | kana2 | 市区町村名カナ |
| results | kana3 | 町域名カナ |

【サンプル】
```json
{
	"message": null,
	"results": [
		{
			"address1": "北海道",
			"address2": "美唄市",
			"address3": "上美唄町協和",
			"kana1": "ﾎｯｶｲﾄﾞｳ",
			"kana2": "ﾋﾞﾊﾞｲｼ",
			"kana3": "ｶﾐﾋﾞﾊﾞｲﾁｮｳｷｮｳﾜ",
			"prefcode": "1",
			"zipcode": "0790177"
		},
		{
			"address1": "北海道",
			"address2": "美唄市",
			"address3": "上美唄町南",
			"kana1": "ﾎｯｶｲﾄﾞｳ",
			"kana2": "ﾋﾞﾊﾞｲｼ",
			"kana3": "ｶﾐﾋﾞﾊﾞｲﾁｮｳﾐﾅﾐ",
			"prefcode": "1",
			"zipcode": "0790177"
		}
	],
	"status": 200
}
```

## エラー
エラーが発生した場合には、"status"フィールドに下記のエラーコードがセットされ、エラーの内容が"message"フィールドにセットされます。

| エラーコード | 説明 |
| -- | -- |
| 400 | 入力パラメータエラー|
| 500 | API内部で発生したエラー |

【サンプル】
```json
{
	"message": "必須パラメータが指定されていません。",
	"results": null,
	"status": 400
}
```