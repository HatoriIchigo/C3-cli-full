外部連携接続用の接続部を作成

## インプット
docs/impl/external/$ARGUMENT.md（スキーマ実装書、実装書）

## 概要
インプットを元に外部連携接続用の接続部を作成

1. スキーマの読み込み
    - ドキュメントに記載しているスキーマを読み込む
    ```python
    from ..schema.external.PostRequest import PostRequest
    from ..schema.external.HttpBinResponse import HttpBinResponse
    from ..schema.external.ErrorResponse import ErrorResponse
    ```
    - なお、記載がない場合は`Base`で代用
    ```python
    from ..schema.external.ExternalRequestBase import ExternalRequestBase
    from ..schema.external.ExternalResponseBase import ExternalResponseBase
    from ..schema.external.ExternalErrorBase import ExternalErrorBase
    ```
2. 実行時はメソッド名: requestで固定
    - **元ドキュメントで別なメソッド名でもrequestで固定**

【サンプル】
```python
from pydantic import BaseModel
from typing import Dict
from .ExternalBase import ExternalBase

# ドキュメントに記載してあるスキーマを読み込み
from ..schema.external.ExternalRequestBase import PostRequest
from ..schema.external.ExternalResponseBase import HttpBinResponse
from ..schema.external.ExternalErrorBase import ErrorResponse

# リクエスト、レスポンス、エラーレスポンスで定義
class HttpBinPostAPI(ExternalBase[PostRequest, HttpBinResponse, ErrorResponse]):
    def __init__(self):
        # url, リクエスト、レスポンス、エラーレスポンス型を渡す
        super().__init__("https://httpbin.org/post",　PostRequest, HttpBinResponse, ErrorResponse)

        # Methodを渡す(GET、POST、PUT、DELETE)
        self.setMethod("POST")

        # Headerの指定
        self.setHeader(name=name, email=email)
        
    # 実行時はメソッド名: requestで固定
    # **メソッド名、引数などは変えない**
    def request(self, form_data: dict, params: dict):
        try:
            # GETとして渡すパラメータのセット
            # Ex. https://httpbin.org/get?key=value のような場合
            self.setParameter(**params)

            # Bodyとして渡すデータのセット
            self.setRequest(**form_data)

            # リクエスト実行
            response = self.sendRequest()

        except Exception as e:
            raise e
        return response
```

保存先：`@src/main/external/<外部連携接続名>.py`（ファイル名はすべて英語で）
