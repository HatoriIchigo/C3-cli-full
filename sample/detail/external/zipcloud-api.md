# 郵便番号検索API 詳細設計書

## 共通
- **ベースURL**: `https://zipcloud.ibsnet.co.jp/api/search`
    - 固定URL（外部サービスのため）
    - 開発環境・本番環境共通
- **接続方式**: `HTTPS`
- **API概要**:
    - 郵便番号から住所情報を取得
    - 無料で利用可能なパブリックAPI
- **ヘッダ**:
    - `Content-Type: application/json` (レスポンス)
    - 認証ヘッダ不要（パブリックAPI）

## 接続先別

### 住所検索

#### 基本情報
- **概要**: 郵便番号から住所情報を取得
- **メソッド**: GET
- **URL**: `/api/search`
- **入力**:
    - `zipcode (string)`: 郵便番号（7桁、ハイフン付きも可）
    - `callback (string)`: コールバック関数名（JSONP用、任意）
    - `limit (number)`: 最大件数（デフォルト：20、任意）
- **出力**:
    - `status (number)`: ステータスコード
    - `message (string)`: メッセージ（エラー時のみ）
    - `results (array)`: 住所情報の配列
        - `zipcode (string)`: 郵便番号（7桁、ハイフンなし）
        - `prefcode (string)`: 都道府県コード（JIS X 0401）
        - `address1 (string)`: 都道府県名
        - `address2 (string)`: 市区町村名
        - `address3 (string)`: 町域名
        - `kana1 (string)`: 都道府県名カナ
        - `kana2 (string)`: 市区町村名カナ
        - `kana3 (string)`: 町域名カナ

#### リクエスト形式
**URL例**:
```
GET https://zipcloud.ibsnet.co.jp/api/search?zipcode=7830060
GET https://zipcloud.ibsnet.co.jp/api/search?zipcode=783-0060
GET https://zipcloud.ibsnet.co.jp/api/search?zipcode=7830060&limit=5
```

**クエリパラメータ**:
```
zipcode=7830060        # 必須
limit=20              # 任意（デフォルト：20）
callback=myCallback   # 任意（JSONP用）
```

#### レスポンス

**正常時**:
```json
{
    "message": null,
    "results": [
        {
            "address1": "高知県",
            "address2": "南国市",
            "address3": "蛍が丘",
            "kana1": "ｺｳﾁｹﾝ",
            "kana2": "ﾅﾝｺｸｼ",
            "kana3": "ﾎﾀﾙｶﾞｵｶ",
            "prefcode": "39",
            "zipcode": "7830060"
        }
    ],
    "status": 200
}
```

**複数件該当時**:
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

**エラー時**:
```json
{
    "message": "必須パラメータが指定されていません。",
    "results": null,
    "status": 400
}
```

#### 成功時及び失敗時の挙動

**成功時**:
- ステータスコード: `200`
- `status`フィールド: `200`
- `results`フィールド: 住所情報の配列
- `message`フィールド: `null`

**失敗時**:
- ステータスコード: `200` (HTTPレベルでは正常)
- `status`フィールド: エラーコード（400 または 500）
- `results`フィールド: `null`
- `message`フィールド: エラーメッセージ

## エラーコード一覧

| エラーコード | 説明 | 対処方法 |
|------------|------|----------|
| 400 | 入力パラメータエラー | 郵便番号の形式を確認 |
| 500 | API内部エラー | 時間をおいてリトライ |

## 実装上の注意事項

### リクエスト制限
- 明確な制限値は不明だが、過度なリクエストは避ける
- アプリケーション側で適切な間隔を設ける（推奨：1秒間隔以上）

### タイムアウト設定
- 推奨タイムアウト: 5秒
- リトライ回数: 最大3回（指数バックオフ）

### データ形式の注意
- 郵便番号: ハイフンありでも受け付けるが、レスポンスは7桁数字のみ
- カナ文字: 半角カタカナ
- 都道府県コード: 文字列形式（数値ではない）

### セキュリティ考慮事項
- HTTPS通信のため暗号化済み
- パブリックAPIのためAPI認証不要
- レート制限の考慮が必要