# バリデーション実装書

## 共通仕様
- バリデーションエラー時は`ValidationException`を発生させる

## 郵便番号関連のバリデーション
### validateZipCode
- **概要**: 郵便番号のバリデーション
- **引数**:
    - zipcode: string
    - required: bool （trueの場合引数は必須）
- **戻り値**
    - bool: （trueの場合は値が設定されている）
- **バリデーション条件**:
    - 7桁の数字、またはハイフン付き8桁（XXX-XXXX形式）
    - 空文字、null、undefined は不可（required=true時）
- **処理フロー**
    1. `required == false`かつ`zipcode == ""` なら false で返却
    2. `zipcode`のバリデーション処理
        - バリデーション失敗時は`ValidationException`
    3. true を返却

## ToDo関連のバリデーション
### validateBooleanOptional
- **概要**: boolean型の任意パラメータのバリデーション
- **引数**:
    - value: bool/None
    - required: bool （trueの場合引数は必須）
- **戻り値**
    - bool: （trueの場合は値が設定されている）
- **バリデーション条件**:
    - None または boolean型であること
    - 空文字、文字列は不可
- **処理フロー**
    1. `required == false`かつ`value == None` なら false で返却
    2. `value`がboolean型でない場合は`ValidationException`
    3. true を返却

### validateLimit
- **概要**: 取得件数制限のバリデーション
- **引数**:
    - limit: int/None
    - required: bool （trueの場合引数は必須）
- **戻り値**
    - bool: （trueの場合は値が設定されている）
- **バリデーション条件**:
    - None または 1以上100以下の整数
    - 0以下、100超過は不可
- **処理フロー**
    1. `required == false`かつ`limit == None` なら false で返却
    2. `limit`が1未満または100超過の場合は`ValidationException`
    3. true を返却

### validateOffset
- **概要**: 取得開始位置のバリデーション
- **引数**:
    - offset: int/None
    - required: bool （trueの場合引数は必須）
- **戻り値**
    - bool: （trueの場合は値が設定されている）
- **バリデーション条件**:
    - None または 0以上の整数
    - 負の値は不可
- **処理フロー**
    1. `required == false`かつ`offset == None` なら false で返却
    2. `offset`が0未満の場合は`ValidationException`
    3. true を返却