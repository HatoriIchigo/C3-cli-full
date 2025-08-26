from pydantic import BaseModel
from .ExternalRequestBase import ExternalRequestBase


class HttpbinPostRequest(ExternalRequestBase):
    """httpbin POST リクエストテスト用スキーマ"""
    key1: str
    key2: str