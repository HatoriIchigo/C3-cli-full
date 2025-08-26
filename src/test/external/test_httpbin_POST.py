import pytest
from unittest.mock import Mock, patch
import requests
from requests import HTTPError

from main.external.httpbin_POST import HttpbinPostTest
from main.schema.external.HttpbinPostResponse import HttpbinPostResponse
from main.schema.external.ExternalErrorBase import ExternalErrorBase
from main.validation import ValidationException


class TestHttpbinPostTestInit:
    """HttpbinPostTest 初期化のテストクラス"""
    
    def test_init(self):
        """HttpbinPostTest の初期化テスト"""
        api = HttpbinPostTest()
        
        # 基本設定の確認
        assert api.request_url == "https://httpbin.org/post"
        assert api.method == "POST"
        assert api.req_model.__name__ == "HttpbinPostRequest"
        assert api.res_model.__name__ == "HttpbinPostResponse"
        assert api.err_model.__name__ == "ExternalErrorBase"
        
        # ヘッダーの確認
        assert "Content-Type" in api.headers
        assert api.headers["Content-Type"] == "application/x-www-form-urlencoded"


class TestHttpbinPostTestRequest:
    """HttpbinPostTest request メソッドのテストクラス"""
    
    def test_request_with_form_data_and_params_success(self):
        """フォームデータとパラメータ付きでのリクエスト成功テスト"""
        api = HttpbinPostTest()
        
        # モックレスポンスの作成
        mock_response = HttpbinPostResponse(
            args={"param1": "value1"},
            data="",
            files={},
            form={"key1": "value1", "key2": "value2"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            json=None,
            origin="127.0.0.1",
            url="https://httpbin.org/post?param1=value1"
        )
        
        with patch.object(api, 'sendRequest', return_value=mock_response):
            result = api.request(
                form_data={"key1": "value1", "key2": "value2"},
                params={"param1": "value1"}
            )
            
            assert isinstance(result, HttpbinPostResponse)
            assert result.form == {"key1": "value1", "key2": "value2"}
            assert result.args == {"param1": "value1"}
    
    def test_request_with_form_data_only_success(self):
        """フォームデータのみでのリクエスト成功テスト"""
        api = HttpbinPostTest()
        
        mock_response = HttpbinPostResponse(
            args={},
            data="",
            files={},
            form={"key1": "value1", "key2": "value2"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            json=None,
            origin="127.0.0.1",
            url="https://httpbin.org/post"
        )
        
        with patch.object(api, 'sendRequest', return_value=mock_response):
            result = api.request(form_data={"key1": "value1", "key2": "value2"})
            
            assert isinstance(result, HttpbinPostResponse)
            assert result.form == {"key1": "value1", "key2": "value2"}
            assert result.args == {}
    
    def test_request_with_none_params(self):
        """params=None でのリクエストテスト"""
        api = HttpbinPostTest()
        
        mock_response = HttpbinPostResponse(
            args={},
            data="",
            files={},
            form={"key1": "value1", "key2": "value2"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            json=None,
            origin="127.0.0.1",
            url="https://httpbin.org/post"
        )
        
        with patch.object(api, 'sendRequest', return_value=mock_response):
            result = api.request(form_data={"key1": "value1", "key2": "value2"}, params=None)
            
            assert isinstance(result, HttpbinPostResponse)
            assert result.form == {"key1": "value1", "key2": "value2"}
    
    def test_request_with_empty_params(self):
        """空のパラメータでのリクエストテスト"""
        api = HttpbinPostTest()
        
        mock_response = HttpbinPostResponse(
            args={},
            data="",
            files={},
            form={"key1": "value1", "key2": "value2"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            json=None,
            origin="127.0.0.1",
            url="https://httpbin.org/post"
        )
        
        with patch.object(api, 'sendRequest', return_value=mock_response):
            result = api.request(form_data={"key1": "value1", "key2": "value2"}, params={})
            
            assert isinstance(result, HttpbinPostResponse)
            assert result.form == {"key1": "value1", "key2": "value2"}


class TestHttpbinPostTestValidationErrors:
    """HttpbinPostTest バリデーションエラーのテストクラス"""
    
    def test_request_form_data_validation_error_none(self):
        """フォームデータがNoneの場合のバリデーションエラーテスト"""
        api = HttpbinPostTest()
        
        with pytest.raises(ValidationException):
            api.request(form_data=None)
    
    def test_request_form_data_validation_error_not_dict(self):
        """フォームデータが辞書でない場合のバリデーションエラーテスト"""
        api = HttpbinPostTest()
        
        with pytest.raises(ValidationException):
            api.request(form_data="not_a_dict")
    
    def test_request_form_data_validation_error_missing_required_fields(self):
        """必須フィールドが不足している場合のバリデーションエラーテスト"""
        api = HttpbinPostTest()
        
        # key1, key2が必須なので空辞書ではエラーになる
        with pytest.raises(Exception):  # Pydantic ValidationError
            api.request(form_data={})
    
    def test_request_params_validation_error_not_dict(self):
        """パラメータが辞書でない場合のバリデーションエラーテスト"""
        api = HttpbinPostTest()
        
        with pytest.raises(ValidationException):
            api.request(form_data={"key1": "value1", "key2": "value2"}, params="not_a_dict")


class TestHttpbinPostTestSendRequestErrors:
    """HttpbinPostTest sendRequestエラーのテストクラス"""
    
    def test_request_send_request_runtime_error(self):
        """sendRequestでRuntimeErrorが発生した場合のテスト"""
        api = HttpbinPostTest()
        
        with patch.object(api, 'sendRequest', side_effect=RuntimeError("API Error")):
            with pytest.raises(RuntimeError, match="API Error"):
                api.request(form_data={"key1": "value1", "key2": "value2"})
    
    def test_request_send_request_requests_exception(self):
        """sendRequestでRequestsExceptionが発生した場合のテスト"""
        api = HttpbinPostTest()
        
        with patch.object(api, 'sendRequest', side_effect=requests.RequestException("Network Error")):
            with pytest.raises(requests.RequestException, match="Network Error"):
                api.request(form_data={"key1": "value1", "key2": "value2"})


class TestHttpbinPostTest500Error:
    """HttpbinPostTest 500エラーのテストクラス"""
    
    @patch('requests.request')
    def test_request_500_error_response(self, mock_request):
        """500エラーレスポンスのテスト"""
        # 500エラーのモックレスポンスを設定
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.json.return_value = {
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Internal server error occurred"
        }
        mock_response.text = '{"code": "INTERNAL_SERVER_ERROR", "message": "Internal server error occurred"}'
        mock_request.return_value = mock_response
        
        api = HttpbinPostTest()
        
        with pytest.raises(RuntimeError, match="API Error : "):
            api.request(form_data={"key1": "value1", "key2": "value2"})
    
    @patch('requests.request')
    def test_request_400_error_response(self, mock_request):
        """400エラーレスポンスのテスト"""
        # 400エラーのモックレスポンスを設定
        mock_response = Mock()
        mock_response.status_code = 400
        mock_response.json.return_value = {
            "code": "BAD_REQUEST",
            "message": "Bad request parameters"
        }
        mock_response.text = '{"code": "BAD_REQUEST", "message": "Bad request parameters"}'
        mock_request.return_value = mock_response
        
        api = HttpbinPostTest()
        
        with pytest.raises(RuntimeError, match="API Error : "):
            api.request(form_data={"key1": "value1", "key2": "value2"})
    
    @patch('requests.request')
    def test_request_unexpected_error_response(self, mock_request):
        """予期しないエラーレスポンスのテスト"""
        # 予期しない形式のエラーレスポンスを設定
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_response.text = "Internal Server Error"
        mock_request.return_value = mock_response
        
        api = HttpbinPostTest()
        
        with pytest.raises(RuntimeError, match="Unexpected error response: Internal Server Error"):
            api.request(form_data={"key1": "value1", "key2": "value2"})


class TestHttpbinPostTestIntegration:
    """HttpbinPostTest 統合テストクラス（実際のリクエストなし）"""
    
    def test_main_execution(self):
        """__main__ブロックの実行可能テスト"""
        # main実行時のインスタンス作成をテスト
        api = HttpbinPostTest()
        assert api is not None
        assert api.request_url == "https://httpbin.org/post"
        assert api.method == "POST"
    
    def test_headers_initialization_detail(self):
        """ヘッダー初期化の詳細テスト"""
        api = HttpbinPostTest()
        
        # Content-Typeヘッダーの詳細確認
        assert api.headers["Content-Type"] == "application/x-www-form-urlencoded"
        
        # 他のデフォルトヘッダーも確認（ExternalBaseから継承）
        # ユーザーエージェントなどの基本ヘッダーが設定されているか
        assert isinstance(api.headers, dict)


class TestHttpbinPostTestEdgeCases:
    """HttpbinPostTest エッジケースのテストクラス"""
    
    def test_request_with_complex_form_data(self):
        """複雑なフォームデータでのテスト"""
        api = HttpbinPostTest()
        
        # HttpbinPostRequestで必須のkey1, key2を含める
        complex_form_data = {
            "key1": "test@example.com",
            "key2": "テスト値"
        }
        
        mock_response = HttpbinPostResponse(
            args={},
            data="",
            files={},
            form=complex_form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            json=None,
            origin="127.0.0.1",
            url="https://httpbin.org/post"
        )
        
        with patch.object(api, 'sendRequest', return_value=mock_response):
            result = api.request(form_data=complex_form_data)
            
            assert isinstance(result, HttpbinPostResponse)
            assert result.form == complex_form_data
    
    def test_request_with_complex_params(self):
        """複雑なパラメータでのテスト"""
        api = HttpbinPostTest()
        
        complex_params = {
            "filter": "active",
            "sort": "created_at",
            "limit": "10",
            "page": "1"
        }
        
        mock_response = HttpbinPostResponse(
            args=complex_params,
            data="",
            files={},
            form={"key1": "value1", "key2": "value2"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            json=None,
            origin="127.0.0.1",
            url="https://httpbin.org/post"
        )
        
        with patch.object(api, 'sendRequest', return_value=mock_response):
            result = api.request(
                form_data={"key1": "value1", "key2": "value2"},
                params=complex_params
            )
            
            assert isinstance(result, HttpbinPostResponse)
            assert result.args == complex_params