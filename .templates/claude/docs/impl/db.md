# User　（ユーザ管理テーブル）　実装書

## Entity
DBに設定されている、User テーブルに対応する1レコードが設定されています。

### ソース
- `@src/main/db/item/user/UserItem.py`
    - **基底クラス**: BaseItem (`@src/main/db/item/common/BaseItem.py`)

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


## Repository
DBに関するCRUD操作を定義されている。

### ソース
- `@src/main/db/crud/UserCrud.py`
    - **基底クラス**: BaseRepository (`@src/db/main/crud/common/BaseRepository.py`)

### 主要なCRUD操作
#### userRegister
- **概要**: ユーザを登録する
- **CRUD Type**: Create
- **引数**
    1. username: string
    2. password: string
- **戻り値**: なし
- **エラーハンドリング**
    - `ConnectionError`: DB接続エラー

