DB詳細設計書を元にDB接続共通部、CRUDSを生成

## インプット
- docs/detail/db.md（DB詳細設計書）を読み込み


## 共通部の作成
以下を共通部分として、生成してください。
1. `src/db/common/db.py`
    - `DATABASE_URL`は詳細設計書を元に修正してください。
```python
#
# db.py
# claude codeにより生成
#
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

username = os.environ.get("DB_USER")
password = os.environ.get("DB_PASS")
host = os.environ.get("DB_HOST")
dbname = os.environ.get("DB_NAME")

DATABASE_URL = f"postgresql://{username}:{password}@{host}/{dbname}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

2. `src/db/common/deps.py`
```python
from .db import SessionLocal
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

```

## Itemの定義
各DBへのスキーマを定義する。
1テーブル、1ファイルとする。
`src/db/<テーブル名>/item.py`に生成。

【生成条件】
- [ ] クラス名はテーブル名をパスカルケース(`PascalCase`)で記述
- [ ] クラスはdbBase
- [ ] `__tablename__`としてテーブル名を記述
- [ ] SQL型からsqlalchemy型は以下で相互変換
| SQL | sqlalchemy |
| -- | -- |
| INT | Integer |
| varchara | String |

### サンプル
```python
from db.common import Base
from sqlalchemy import Column, Integer, String

class User(Base):  # Baseを継承
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
```

