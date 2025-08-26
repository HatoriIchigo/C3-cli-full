from pydantic import BaseModel
from typing import Dict, Any, Optional

# 絶対importでスキーマとモジュールを読み込み
from main.external.ExternalBase import ExternalBase
from main.schema.external.HttpbinGetResponse import HttpbinGetResponse
from main.schema.external.ExternalErrorBase import ExternalErrorBase
import main.validation as validation


class HttpbinGetTest(ExternalBase[None, HttpbinGetResponse, ExternalErrorBase]):
    """httpbin GET リクエストテスト用接続クラス"""
    
    def __init__(self):
        # url、リクエスト、レスポンス、エラーレスポンス型を渡す
        # GETでリクエストボディがないためNone
        super().__init__(
            "https://httpbin.org/get",
            None,
            HttpbinGetResponse,
            ExternalErrorBase
        )
        
        # Methodを渡す(GET)
        self.setMethod("GET")
    
    def request(self, params: Optional[dict] = None) -> dict:
        """
        httpbin GET リクエストテスト実行
        
        Args:
            params (dict, optional): クエリパラメータ（デフォルト：{}）
            
        Returns:
            dict: APIレスポンス全体
        """
        try:
            # バリデーション処理
            if params is None:
                params = {}
            validation.validateDict(params, required=False)
            
            # GETパラメータとして渡すパラメータのセット
            if params:
                self.setParameter(**params)
            
            # リクエスト実行
            response = self.sendRequest()
            
            return response
            
        except Exception as e:
            raise e


if __name__ == "__main__":
    api = HttpbinGetTest()
    res = api.request(params={"test_param": "test_value"})
    
    print(res)
    print("URL:", res.url)
    print("Args:", res.args)