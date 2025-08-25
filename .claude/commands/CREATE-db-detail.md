各使用書からDBの使用を抽出・提案

## 以下を最後に表示してください
- 全ての処理が正常に成功した場合: `result: success`
- 何らかのエラーで失敗した場合： `result: failed: <失敗原因>`

## インプット
- docs/note/note.md（メモ、必須）　を読み込み
- docs/base/base-doc.md（基本設計書、必須）を読み込み
- docs/note/external.md（DB詳細設計書メモ、任意）

## 概要
メモ及び基本設計書からDB仕様書を作成する。
DB詳細設計が必要ない場合はそのまま正常終了とする。

## DB仕様フォーマット
### DB実行環境
DBの実行環境を出力してください。
出力フォーマットは以下です。

```markdown
## DB実行環境
- DBMS: MySQL
- Version: 8.x

## 接続方法
### 開発環境
- **DB構築環境**: ローカル(Docker)
- **ホスト**: `localhost`(ハードコーディング)
- **ユーザ名**: `testuser`(ハードコーディング)
- **パスワード**: `Passw0rd`(ハードコーディング)
- **DB名**: `testdb`(ハードコーディング)
- **管理方法**: 設定ファイル(`application.env`)

### 商用環境
- **DB構築環境**: AWS Aurora on MySQL
- **ホスト**:
    - AWS SystemManager ParameterStore
    - キー名: `prd-db-host`
- **ユーザ名**:
    - AWS SecretsManager
    - **arn**: `arn:aws:secretsmanager:ap-northeast-1:111111111111:secret:test01-eyNhMR`
- **パスワード**:
    - AWS SecretsManager
    - **arn**: `arn:aws:secretsmanager:ap-northeast-1:111111111111:secret:test01-eyNhMR`
- **DB名**:
    - AWS SystemManager ParameterStore
    - キー名: `prd-db-dbname`
```


### テーブル仕様書
テーブルの仕様について出力してください。
以下を書いてください。

- テーブルの物理名
- テーブルの論理名
- テーブルの概要
- テーブルの詳細
    - No
    - カラム名
    - データ型
    - PK
    - FK
    - UNIQUE
    - NOT NULL
    - 概要
    - 備考

出力フォーマットは以下です。
```markdown
## account(アカウント管理テーブル)
アカウントの管理を行うテーブルです。
| No | カラム名 | データ型 | PK | FK | UNIQUE | NOT NULL | 概要 | 備考 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 1. | email | varchara | 〇 | 〇 | | 〇 | 〇 | ユーザのメールアドレス | |
| 2. | password | varchara | | | | 〇 | 〇 | パスワード | sha256で暗号化して格納 |
```

## 出力
出力結果を docs/detail/db.md に保存してください。

