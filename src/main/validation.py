"""
バリデーション機能実装
"""

class ValidationException(Exception):
    """バリデーション失敗時の例外クラス"""
    pass


def validateBooleanOptional(value, required: bool) -> bool:
    """
    boolean型の任意パラメータのバリデーション
    
    Args:
        value: バリデーション対象の値 (bool/None)
        required (bool): 必須かどうか
    
    Returns:
        bool: 値が設定されているかどうか
    
    Raises:
        ValidationException: バリデーション失敗時
    """
    if not required and value is None:
        return False
    
    if required and value is None:
        raise ValidationException("必須パラメータが設定されていません")
    
    if value is not None and not isinstance(value, bool):
        raise ValidationException("boolean型の値を指定してください")
    
    return True


def validateLimit(limit, required: bool) -> bool:
    """
    取得件数制限のバリデーション
    
    Args:
        limit: 取得件数 (int/None)
        required (bool): 必須かどうか
    
    Returns:
        bool: 値が設定されているかどうか
    
    Raises:
        ValidationException: バリデーション失敗時
    """
    if not required and limit is None:
        return False
    
    if required and limit is None:
        raise ValidationException("取得件数は必須です")
    
    if limit is not None:
        if not isinstance(limit, int):
            raise ValidationException("取得件数は整数で指定してください")
        
        if limit < 1 or limit > 100:
            raise ValidationException("取得件数は1以上100以下で指定してください")
    
    return True


def validateOffset(offset, required: bool) -> bool:
    """
    取得開始位置のバリデーション
    
    Args:
        offset: 取得開始位置 (int/None)
        required (bool): 必須かどうか
    
    Returns:
        bool: 値が設定されているかどうか
    
    Raises:
        ValidationException: バリデーション失敗時
    """
    if not required and offset is None:
        return False
    
    if required and offset is None:
        raise ValidationException("取得開始位置は必須です")
    
    if offset is not None:
        if not isinstance(offset, int):
            raise ValidationException("取得開始位置は整数で指定してください")
        
        if offset < 0:
            raise ValidationException("取得開始位置は0以上で指定してください")
    
    return True


def validateDict(data, required: bool) -> bool:
    """
    辞書型データのバリデーション
    
    Args:
        data: バリデーション対象のデータ (dict/None)
        required (bool): 必須かどうか
    
    Returns:
        bool: 値が設定されているかどうか
    
    Raises:
        ValidationException: バリデーション失敗時
    """
    if not required and data is None:
        return False
    
    if required and data is None:
        raise ValidationException("必須パラメータが設定されていません")
    
    if data is not None and not isinstance(data, dict):
        raise ValidationException("辞書型のデータを指定してください")
    
    return True