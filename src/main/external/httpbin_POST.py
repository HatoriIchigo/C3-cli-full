from pydantic import BaseModel
from typing import Dict, Any, Optional

# 絶対importでスキーマとモジュールを読み込み
from main.external.ExternalBase import ExternalBase
from main.schema.external.HttpbinPostRequest import HttpbinPostRequest
from main.schema.external.HttpbinPostResponse import HttpbinPostResponse
from main.schema.external.ExternalErrorBase import ExternalErrorBase
import main.validation as validation


class HttpbinPostTest(ExternalBase[HttpbinPostRequest, HttpbinPostResponse, ExternalErrorBase]):
    """httpbin POST リクエストテスト用接続クラス"""
    
    def __init__(self):
        # url、リクエスト、レスポンス、エラーレスポンス型を渡す
        # そもそも使用しなければ（GETでリクエストボディがいらないなど）NoneでもOK
        super().__init__(
            "https://httpbin.org/post",
            HttpbinPostRequest,
            HttpbinPostResponse,
            ExternalErrorBase
        )
        
        # Methodを渡す(POST)
        self.setMethod("POST")
        
        # Content-Typeをapplication/x-www-form-urlencodedに設定
        self.setHeader(**{"Content-Type": "application/x-www-form-urlencoded"})
    
    def request(self, form_data: dict, params: Optional[dict] = None) -> dict:
        """
        httpbin POST リクエストテスト実行
        
        Args:
            form_data (dict): フォームデータ（必須）
            params (dict, optional): クエリパラメータ（デフォルト：{}）
            
        Returns:
            dict: APIレスポンス全体
        """
        try:
            # バリデーション処理
            validation.validateDict(form_data, required=True)
            if params is None:
                params = {}
            validation.validateDict(params, required=False)
            
            # GETパラメータとして渡すパラメータのセット
            if params:
                self.setParameter(**params)
            
            # Bodyとして渡すデータのセット
            self.setRequest(**form_data)
            
            # リクエスト実行
            response = self.sendRequest()
            
            return response
            
        except Exception as e:
            raise e
        
if __name__ == "__main__":
    api = HttpbinPostTest()
    res = api.request(form_data={"key1": "value1", "key2": "value2"})

    print(res)
    print("URL:", res.url)
    print("Echo JSON:", res.json)