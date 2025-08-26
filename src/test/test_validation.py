import pytest
import sys
import os

# src/mainをパスに追加
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'main'))

from validation import (
    ValidationException,
    validateBooleanOptional,
    validateLimit,
    validateOffset,
    validateDict
)


class TestValidationException:
    """ValidationException のテストクラス"""
    
    def test_validation_exception_is_exception_subclass(self):
        """ValidationException が Exception のサブクラスであることを確認"""
        assert issubclass(ValidationException, Exception)
    
    def test_validation_exception_can_be_raised(self):
        """ValidationException が正常に発生することを確認"""
        with pytest.raises(ValidationException):
            raise ValidationException("テストエラー")


class TestValidateBooleanOptional:
    """validateBooleanOptional 関数のテストクラス"""
    
    def test_not_required_with_none_returns_false(self):
        """必須でない場合にNoneを渡すとFalseが返される"""
        result = validateBooleanOptional(None, required=False)
        assert result is False
    
    def test_not_required_with_true_returns_true(self):
        """必須でない場合にTrueを渡すとTrueが返される"""
        result = validateBooleanOptional(True, required=False)
        assert result is True
    
    def test_not_required_with_false_returns_true(self):
        """必須でない場合にFalseを渡すとTrueが返される"""
        result = validateBooleanOptional(False, required=False)
        assert result is True
    
    def test_required_with_none_raises_exception(self):
        """必須の場合にNoneを渡すと例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateBooleanOptional(None, required=True)
        assert "必須パラメータが設定されていません" in str(exc_info.value)
    
    def test_required_with_true_returns_true(self):
        """必須の場合にTrueを渡すとTrueが返される"""
        result = validateBooleanOptional(True, required=True)
        assert result is True
    
    def test_required_with_false_returns_true(self):
        """必須の場合にFalseを渡すとTrueが返される"""
        result = validateBooleanOptional(False, required=True)
        assert result is True
    
    def test_invalid_type_raises_exception(self):
        """boolean型以外の値を渡すと例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateBooleanOptional("invalid", required=False)
        assert "boolean型の値を指定してください" in str(exc_info.value)
    
    @pytest.mark.parametrize("invalid_value", [1, 0, "true", "false", [], {}])
    def test_various_invalid_types_raise_exception(self, invalid_value):
        """様々な不正な型の値でテスト"""
        with pytest.raises(ValidationException):
            validateBooleanOptional(invalid_value, required=False)


class TestValidateLimit:
    """validateLimit 関数のテストクラス"""
    
    def test_not_required_with_none_returns_false(self):
        """必須でない場合にNoneを渡すとFalseが返される"""
        result = validateLimit(None, required=False)
        assert result is False
    
    def test_required_with_none_raises_exception(self):
        """必須の場合にNoneを渡すと例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateLimit(None, required=True)
        assert "取得件数は必須です" in str(exc_info.value)
    
    def test_valid_limit_returns_true(self):
        """有効な取得件数でTrueが返される"""
        for limit in [1, 50, 100]:
            result = validateLimit(limit, required=False)
            assert result is True
    
    def test_limit_below_min_raises_exception(self):
        """1未満の値で例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateLimit(0, required=False)
        assert "取得件数は1以上100以下で指定してください" in str(exc_info.value)
    
    def test_limit_above_max_raises_exception(self):
        """100超過の値で例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateLimit(101, required=False)
        assert "取得件数は1以上100以下で指定してください" in str(exc_info.value)
    
    def test_non_integer_type_raises_exception(self):
        """整数以外の型で例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateLimit("10", required=False)
        assert "取得件数は整数で指定してください" in str(exc_info.value)
    
    @pytest.mark.parametrize("invalid_value", ["10", 10.5, [], {}])
    def test_various_invalid_types_raise_exception(self, invalid_value):
        """様々な不正な型の値でテスト"""
        with pytest.raises(ValidationException):
            validateLimit(invalid_value, required=False)


class TestValidateOffset:
    """validateOffset 関数のテストクラス"""
    
    def test_not_required_with_none_returns_false(self):
        """必須でない場合にNoneを渡すとFalseが返される"""
        result = validateOffset(None, required=False)
        assert result is False
    
    def test_required_with_none_raises_exception(self):
        """必須の場合にNoneを渡すと例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateOffset(None, required=True)
        assert "取得開始位置は必須です" in str(exc_info.value)
    
    def test_valid_offset_returns_true(self):
        """有効な取得開始位置でTrueが返される"""
        for offset in [0, 1, 100, 1000]:
            result = validateOffset(offset, required=False)
            assert result is True
    
    def test_negative_offset_raises_exception(self):
        """負の値で例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateOffset(-1, required=False)
        assert "取得開始位置は0以上で指定してください" in str(exc_info.value)
    
    def test_non_integer_type_raises_exception(self):
        """整数以外の型で例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateOffset("0", required=False)
        assert "取得開始位置は整数で指定してください" in str(exc_info.value)
    
    @pytest.mark.parametrize("invalid_value", ["0", 0.5, [], {}])
    def test_various_invalid_types_raise_exception(self, invalid_value):
        """様々な不正な型の値でテスト"""
        with pytest.raises(ValidationException):
            validateOffset(invalid_value, required=False)


class TestValidateDict:
    """validateDict 関数のテストクラス"""
    
    def test_not_required_with_none_returns_false(self):
        """必須でない場合にNoneを渡すとFalseが返される"""
        result = validateDict(None, required=False)
        assert result is False
    
    def test_required_with_none_raises_exception(self):
        """必須の場合にNoneを渡すと例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateDict(None, required=True)
        assert "必須パラメータが設定されていません" in str(exc_info.value)
    
    def test_valid_dict_returns_true(self):
        """有効な辞書でTrueが返される"""
        test_dicts = [
            {},
            {"key": "value"},
            {"num": 1, "bool": True, "list": [1, 2, 3]}
        ]
        for test_dict in test_dicts:
            result = validateDict(test_dict, required=False)
            assert result is True
    
    def test_non_dict_type_raises_exception(self):
        """辞書以外の型で例外が発生"""
        with pytest.raises(ValidationException) as exc_info:
            validateDict("not_dict", required=False)
        assert "辞書型のデータを指定してください" in str(exc_info.value)
    
    @pytest.mark.parametrize("invalid_value", ["string", 123, True, [], set()])
    def test_various_invalid_types_raise_exception(self, invalid_value):
        """様々な不正な型の値でテスト"""
        with pytest.raises(ValidationException):
            validateDict(invalid_value, required=False)