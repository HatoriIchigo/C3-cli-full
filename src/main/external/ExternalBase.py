#
# ExternalBase
#   @description: 外部連携の基底クラス
#   @author: Hatori Ichigo
#
from abc import ABC
from typing import Generic, TypeVar, Type, Dict, Any, Optional
import requests
import time

from ..schema.external.ExternalRequestBase import ExternalRequestBase
from ..schema.external.ExternalResponseBase import ExternalResponseBase
from ..schema.external.ExternalErrorBase import ExternalErrorBase

# 型変数の定義
Req = TypeVar("Req", bound=ExternalRequestBase)
Res = TypeVar("Res", bound=ExternalResponseBase)
Err = TypeVar("Err", bound=ExternalErrorBase)


class ExternalBase(ABC, Generic[Req, Res, Err]):

    def __init__(self, base_url: str, req_model: Optional[Type[Req]], res_model: Type[Res], err_model: Type[Err]):
        self.base_url = base_url
        self.request_url: str = base_url
        self.method: str = "GET"
        self.numRetry: int = 5
        self.delRetry: int = 10

        # request用変数
        self.headers: Dict[str, str] = {}
        self.params: Dict[str, Any] = {}
        self.data: Optional[Req] = None

        # 型情報
        self.req_model = req_model
        self.res_model = res_model
        self.err_model = err_model

    # ヘッダをセット
    def setHeader(self, **param):
        self.headers.update(param)

    # GET パラメータを設定
    def setParameter(self, **param):
        self.params.update(param)

    def setRequest(self, **param):
        """
        Pydanticモデル(Req)を生成して保持する
        GET の場合 (req_model=None) は呼ばなくてもOK
        """
        if self.req_model is None:
            raise RuntimeError("This API does not accept a request body")
        self.data = self.req_model(**param)

    def setMethod(self, method: str):
        self.method = method.upper()

    def setNumRetry(self, retry: int):
        self.numRetry = retry

    def setDelRetry(self, delay: int):
        self.delRetry = delay

    def sendRequest(self) -> Res:
        last_exception = None

        for attempt in range(self.numRetry):
            try:
                # Pydanticモデルの場合はdict()メソッドでJSONに変換
                json_data = None
                if self.data is not None:
                    if hasattr(self.data, 'dict'):  # Pydanticモデルの場合
                        json_data = self.data.dict()
                    else:  # 通常の辞書の場合
                        json_data = self.data
                
                response = requests.request(
                    self.method,
                    self.request_url,
                    headers=self.headers,
                    params=self.params,
                    json=json_data,
                )

                if response.status_code >= 400:
                    try:
                        err = self.err_model.parse_obj(response.json())
                    except Exception:
                        raise RuntimeError(f"Unexpected error response: {response.text}")
                    raise RuntimeError(f"API Error {getattr(err, 'code', '')}: {getattr(err, 'message', '')}")

                return self.res_model.parse_obj(response.json())

            except requests.RequestException as e:
                last_exception = e
                time.sleep(self.delRetry)

        raise RuntimeError(f"Request failed after {self.numRetry} retries: {last_exception}")
