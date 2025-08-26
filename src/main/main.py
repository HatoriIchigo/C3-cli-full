"""
FastAPI メインアプリケーション
外部連携APIをREST APIとして公開
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging

# 外部連携クラスは動的にインポート

# FastAPIアプリケーション作成
app = FastAPI(
    title="External Integration API",
    description="外部連携APIサービス",
    version="1.0.0"
)

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# レスポンスモデル
class ApiResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

# リクエストモデル
class HttpbinGetRequest(BaseModel):
    params: Optional[Dict[str, str]] = {}

class HttpbinPostRequest(BaseModel):
    form_data: Dict[str, Any]
    params: Optional[Dict[str, str]] = {}

@app.get("/")
async def root():
    """ヘルスチェック"""
    return {"message": "External Integration API is running"}

@app.get("/health")
async def health_check():
    """ヘルスチェック"""
    return {"status": "healthy", "service": "External Integration API"}

@app.post("/api/httpbin/get", response_model=ApiResponse)
async def httpbin_get_test(request: HttpbinGetRequest):
    """
    HttpBin GET リクエストテスト
    """
    try:
        # HttpbinGetTestを動的にインポート
        from main.external.httpbin_GET_test import HttpbinGetTest
        
        # HttpbinGetTestインスタンス作成
        api = HttpbinGetTest()
        
        # リクエスト実行
        result = api.request(params=request.params)
        
        return ApiResponse(
            success=True,
            data=result.model_dump() if hasattr(result, 'model_dump') else result,
            message="HttpBin GET request successful"
        )
        
    except Exception as e:
        logger.error(f"HttpBin GET error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"HttpBin GET request failed: {str(e)}"
        )

@app.post("/api/httpbin/post", response_model=ApiResponse)
async def httpbin_post_test(request: HttpbinPostRequest):
    """
    HttpBin POST リクエストテスト
    """
    try:
        # HttpbinPostTestを動的にインポート
        from main.external.httpbin_POST import HttpbinPostTest
        
        # HttpbinPostTestインスタンス作成
        api = HttpbinPostTest()
        
        # リクエスト実行
        result = api.request(
            form_data=request.form_data,
            params=request.params
        )
        
        return ApiResponse(
            success=True,
            data=result.model_dump() if hasattr(result, 'model_dump') else result,
            message="HttpBin POST request successful"
        )
        
    except Exception as e:
        logger.error(f"HttpBin POST error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"HttpBin POST request failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main.main:app",   # ← mainパッケージのmainモジュール内のapp
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )