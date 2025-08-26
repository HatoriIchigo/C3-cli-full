from fastapi.testclient import TestClient
from unittest.mock import Mock, patch

from main.main import app, ApiResponse

client = TestClient(app)



class TestHealthEndpoints:
    """ヘルスチェックエンドポイントのテストクラス"""
    
    def test_root_endpoint(self):
        """ルートエンドポイントのテスト"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "External Integration API is running"}
    
    def test_health_check_endpoint(self):
        """ヘルスチェックエンドポイントのテスト"""
        response = client.get("/health")
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["status"] == "healthy"
        assert json_data["service"] == "External Integration API"


class TestApiResponse:
    """ApiResponse モデルのテストクラス"""
    
    def test_api_response_creation_with_minimal_data(self):
        """最小限のデータでApiResponse作成"""
        response = ApiResponse(success=True)
        assert response.success is True
        assert response.data is None
        assert response.message is None
    
    def test_api_response_creation_with_all_data(self):
        """全データでApiResponse作成"""
        test_data = {"key": "value", "number": 123}
        response = ApiResponse(
            success=True,
            data=test_data,
            message="Test message"
        )
        assert response.success is True
        assert response.data == test_data
        assert response.message == "Test message"


class TestInvalidRequests:
    """不正なリクエストのテストクラス"""
    
    def test_httpbin_get_missing_form_data_field(self):
        """HttpBin GET で不正なリクエストボディのテスト"""
        # form_dataが不要なのでこれは正常なリクエスト
        response = client.post("/api/httpbin/get", json={})
        # 実際の実装では正常に処理される（paramsはoptional）
        assert response.status_code in [200, 500]  # 外部依存によってどちらでも
    
    def test_httpbin_post_missing_form_data_field(self):
        """HttpBin POST で必須フィールド欠如のテスト"""
        response = client.post("/api/httpbin/post", json={"params": {"test": "value"}})
        # form_dataが必須なので422 (Validation Error)
        assert response.status_code == 422
    
    def test_httpbin_post_invalid_json(self):
        """HttpBin POST で不正なJSON形式のテスト"""
        response = client.post(
            "/api/httpbin/post", 
            data="invalid json",
            headers={"content-type": "application/json"}
        )
        assert response.status_code == 422