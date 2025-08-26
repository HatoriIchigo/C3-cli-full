外部連携接続用のリクエスト・レスポンススキーマを作成

## インプット
docs/impl/external/schema/$ARGUMENT.md（スキーマ実装書、実装書）

## 概要
インプットを元に外部連携接続用のリクエスト・レスポンススキーマを作成

【サンプル】
```python
from pydantic import BaseModel

# リクエストスキーマ作成時
from ExternalRequestBase import ExternalRequestBase
# レスポンススキーマ作成時
from ExternalResponseBase import ExternalResponseBase
# エラーレスポンススキーマ作成時
from ExternalErrorBase import ExternalErrorBase

class PostRequest(ExternalRequestBase):
    name: str
    email: str
```

保存先：`@src/main/schema/external/<スキーマ名>.py`
