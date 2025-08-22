# DB共通実装書

## DB環境
### 商用環境
- **ソース**: `@src/settings.json`（設定ファイル）
- **DBエンジン**: MySQL
- **接続先ホスト**:
    - AWS SystemManager ParameterStorで管理
    - Key: `prd-db-host`
- **ユーザ名**:
    - AWS SystemManager ParameterStorで管理
    - Key: `prd-db-user`
- **パスワード**:
    - AWS SystemManager ParameterStorで管理
    - Key: `prd-db-password`
- **DB名**: `todo_db` （ハードコード）

### 開発環境
- **ソース**: `@src/settings.json`
- **DBエンジン**: MySQL
- **接続先ホスト**: `localhost`（環境変数）
- **ユーザ名**: `todouser`（環境変数）
- **パスワード**: `todopass`（環境変数）
- **DB名**: `todo_db` （ハードコード）

## DB接続初期設定
- **ソース**: `@src/main/db/common/connection.py`

### 接続時フロー
1. 設定ファイルを読み込み
2. 設定ファイル内`env.type`が`dev`の場合は開発環境、`prd`は商用環境とする
3. 環境変数 or AWSからパラメータを取得
4. 接続時初期設定を行う

## Item/Repository共通クラス
### BaseItem
- **ソース**: `@src/main/db/common/BaseItem.py`
- **概要**: 各テーブルのItemのベースとなるクラス。

### BaseRepository
- **ソース**: `@src/main/db/common/BaseRepository.py`
- **概要**: 各テーブルのRepositoryのベースとなるクラス。

#### メソッド一覧
1. getId
- **概要**: IDを取得する
- **引数**: なし
- **戻り値**: int

## 依存ライブラリ
- `sqlalchemy`
