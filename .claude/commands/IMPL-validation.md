バリデーション部の実装

## インプット
- docs/base/base-doc.md（基本設計書、必須）を読み込み
- docs/impl/validation.md（バリデーション実装書、必須）を読み込み

## 概要
バリデーション実装書を元にバリデーションを実装。
`src/main/validation.py`に保存。
メソッドとして定義。クラスの中に入れないこと。

【サンプル】
```python
def validateUsername(self, username: str, required: bool) -> bool:
    """
    ユーザ名のバリデーション
    Args:
        username (str): ユーザ名
        required (bool): 必須かどうか
    Returns:
        bool: 値が設定されているかどうか
    Raises:
        ValidationException: バリデーション失敗時
    """
    if not required and username == "":
        return False
    
    # バリデーション条件チェック
    if not username or len(username) < 3 or len(username) > 30:
        raise ValidationException("ユーザ名は3-30文字で入力してください")
    
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9_]*$', username):
        raise ValidationException("ユーザ名は英字で始まり、英数字とアンダースコアのみ使用可能です")
    
    return True
```