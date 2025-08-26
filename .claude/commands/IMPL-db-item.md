DB実装書を元にDB接続共通部、CRUDSを生成

## インプット
- docs/impl/db/$ARGUMENT.md （DB実装書）を読み込み

## Itemの定義
各DBへのスキーマを定義する。
1テーブル、1ファイルとする。
`src/main/models/<テーブル名>.py`に生成。

【生成条件】
- クラス名はテーブル名をパスカルケース(`PascalCase`)で記述
- クラスはdbBase
- `__tablename__`としてテーブル名を記述
- SQL型からsqlalchemy型は以下で相互変換

| SQL | sqlalchemy |
| -- | -- |
| INT | Integer |
| varchara | String |
| Date | date |
| Float | float |
| Time | time |

【サンプル】
```python
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

# Userテーブルのモデル
class User(Base):  # Baseを継承
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

    # 1対1対応になる場合
    items = relationship("Item", back_populates="owner")
```

