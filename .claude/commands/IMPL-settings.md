設定値ファイルの実装コード作成

## インプット
docs/impl/設定値.md（設定値設計書、必須） を読み込み

## ローカル設定値の作成
設定値設計書からローカル設定値ファイルを作成。

ファイルは`application.env`とする。
ただし、SSMやSecret Managerなど別サービス経由で取得する設定値　及び　アプリケーション設定値は記載しない。

【サンプル】
```
DB_HOST=localhost
DB_USER=db_user
```

## 商用環境設定値の作成
設定値設計書からローカル設定値ファイルを作成。

ファイルは`application.production.env`とする。
ただし、SSMやSecret Managerなど別サービス経由で取得する設定値　及び　アプリケーション設定値は記載しない。

【サンプル】
```
DB_HOST=localhost
DB_USER=db_user
```

## 設定値読み込み部の実装
設定値を読み込むコードの実装を行う。
保存先は`src/config.py`とする。
以下のように作成する。
なお、ソースコードのコメント（説明）は適宜修正してください。

```python
import boto3
from pydantic_settings import BaseSettings

# SSMから値を取得
# AWS SSMを使用する場合は下記メソッドを追加
def get_ssm_parameter(name: str, with_decryption: bool = True) -> str:
    ssm = boto3.client("ssm")
    response = ssm.get_parameter(Name=name, WithDecryption=with_decryption)
    return response["Parameter"]["Value"]

# 設定値読み込みの基底クラス
class Settings(BaseSettings):
    # 開発環境・商用環境で共通のパラメータ
    # 初期化時は開発環境のパラメータ
    db_host: str = "localhost"
    db_name: str = "todo_db"
    debug: bool = True

    # アプリケーション設定値はここに書く
    port: int = 3306

# Dev環境のクラス
class DevConfig(BaseConfig):
    class Config:
        env_file = "application.env"   # 開発用の.env

# 商用環境のクラス
class ProdConfig(BaseConfig):
    debug: bool = False

    # SSM指定時
    db_host = get_ssm_parameter("/todoapp/prd/db_host")

    class Config:
        env_file = "application.production.env"  # 本番用の.env

# 現在の環境が開発or商用は環境変数で切り替え
def get_settings():
    env = os.getenv("ENV", "dev")  # ENV=prod なら本番
    if env == "prod":
        return ProdConfig()
    return DevConfig()

settings = get_settings()
```