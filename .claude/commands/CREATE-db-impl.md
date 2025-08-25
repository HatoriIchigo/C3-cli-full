DB詳細設計書からDB実装書を生成する

## 以下を最後に表示してください
- 全ての処理が正常に成功した場合: `result: success`
- 何らかのエラーで失敗した場合： `result: failed: <失敗原因>`

## インプット
- docs/base/base-doc.md（基本設計書、必須）を読み込み
- docs/detail/db/db.md（DB設計書、必須）を読み込み

## 概要
DB設計書からDB実装書を作成。

### 環境設定値の洗い出し
環境設定値を洗い出し、種類ごとに分けて docs/impl/設定値.md に保存。
すでに作成されている場合は追記とする。

以下を設定値として記載。

- 環境設定値/アプリケーション設定値
    - 環境設定値はアプリケーションの外側で設定する値
    - アプリケーション設定値はアプリケーション内部で固定の設定値
- ローカル環境/商用環境
- 値の設定値
- 設定方法

【サンプル】
```markdown
## 環境設定値
### ローカル環境設定値
- `database_url`
    - **概要**: DBホスト名
    - **設定値**: `localhost`
    - **設定方法**: ハードコーディング

### 商用環境設定値
- `database_url`
    - **概要**: DBホスト名
    - **設定方法**: AWS SSM
    - **キー名**: `/todoapp/prd/db-url`

## アプリケーション設定値
1. `db_name`
    - **概要**: DB名
    - **設定値**: `todapp_db`
```

### DB実装書の作成
DBのEntityの実装書を作成する。
各テーブルごとに1つずつ作成。

- ソース は `@src/main/db/item/`配下に配置

なお、DB情報は上記で設定した設定キー（値ではなくキーのほう）を使用する。

【サンプル】
```markdown
## DB情報
- **Engine**: MySQL
- **ホスト**: `db_host`

## ソース
- `@src/main/db/item/user/UserItem.py`

1. user_id
- **概要**: ユーザIDを格納する
- **Type**: Integer
- **Not Null**
- **UNIQUE**

2. update_at
- **概要**: 更新日時を格納する
- **Type**: datetime
- **Not Null**
- **UNIQUE**
- **default**: 現在日時
```


環境設定値を洗い出し、種類ごとに分けて docs/impl/db/テーブル名.md に保存。
