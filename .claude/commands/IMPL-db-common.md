DB実装書を元にDB接続共通部、を生成

## インプット
- src/config.py（設定値）を読み込み

## 共通部の定義
全DBスキーマで共通となるコードの作成。（無ければ）
`src/main/database.py`に保存。

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