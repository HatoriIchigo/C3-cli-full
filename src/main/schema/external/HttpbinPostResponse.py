from pydantic import BaseModel
from typing import Dict, Any, Optional, List, Union
from .ExternalResponseBase import ExternalResponseBase

class HttpbinPostResponse(ExternalResponseBase):
    args: Dict[str, Any]
    data: str
    files: Dict[str, Any]
    form: Dict[str, Union[str, List[str]]]
    headers: Dict[str, str]
    json: Optional[Any]
    origin: str
    url: str