アプリ詳細設計書をさらに落とし込む

## 概要
アプリ詳細設計書をさらに落とし込む。
DBやバリデーション機能をメインから分離する。

## バリデーション関連
出力先：`docs/detail/機能名/validation.md`
```markdown
## アウトプット
- ソースコード出力先
    - src/機能名/validation.py

## バリデーション内容
1. **関数名**：usernameValidation
    - **概要**：ユーザ名のバリデーション
    - **引数**：username
    - **戻り値**：true(OK)/false(NG)
    - **バリデーション内容**:
        - 文字列：5文字以上30文字以内
        - 文字種別：「a-z/A-Z/_」が使用可能

## エラー時の挙動
- 「`ValidationException`」をスロー
```

## DB関連
出力先：`docs/detail/機能名/db.md`
```markdown
## アウトプット
- ソースコード出力先
    - src/機能名/db.py

## バリデーション内容
1. **関数名**：createUser
    - **概要**：ユーザアカウントの作成
    - **引数**：username, password
    - **戻り値**：true(OK)/false(NG)


## エラー時の挙動
- 「`RegisterException`」をスロー
```

## メイン処理
出力先：`docs/detail/機能名/detail-2.md`
```markdown
## アウトプット
- ソースコード出力先
    - src/機能名/main.py

## バリデーション内容
1. **関数名**：main
    - **概要**：ユーザアカウントの作成
    - **引数**：username, password
    - **戻り値**：200 or 404
    - **実装内容**：
        1. `validation.usernameValidation`でバリデーション
        2. `db.createUser`で登録

## エラー時の挙動
- 「`Exception`」をスロー
```



