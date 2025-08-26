from pydantic import BaseModel
from typing import Dict, Any
from .ExternalResponseBase import ExternalResponseBase

class HttpbinGetResponse(ExternalResponseBase):
    args: Dict[str, Any]
    headers: Dict[str, str]
    origin: str
    url: str