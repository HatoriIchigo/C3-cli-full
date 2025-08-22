DB実装書を元にDB接続共通部、CRUDSを生成

## インプット
- docs/impl/db/$ARGUMENT.md （DB実装書）を読み込み
- src/config.py（設定値）を読み込み

## 共通部の定義
全DBスキーマで共通となるコードの作成。（無ければ）
`src/database.py`に保存。

【サンプル】
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 設定値情報を読み込み
from .config import settings

# 設定値を元にDBのURLを構築
SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.user}:{settings.password}@{settings.host}/{settings.dbname}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

## Itemの定義
各DBへのスキーマを定義する。
1テーブル、1ファイルとする。
`src/models/<テーブル名>.py`に生成。

【生成条件】
- クラス名はテーブル名をパスカルケース(`PascalCase`)で記述
- クラスはdbBase
- `__tablename__`としてテーブル名を記述
- SQL型からsqlalchemy型は以下で相互変換

| SQL | sqlalchemy |
| -- | -- |
| INT | Integer |
| varchara | String |

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

