from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Banking API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False
    frontend_origin: str = "http://localhost:5173"

    mysql_user: str = "root"
    mysql_password: str = "password"
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_db: str = "banking"

    access_token_expires_minutes: int = 30
    refresh_token_expires_minutes: int = 60 * 24 * 7
    jwt_secret_key: str = "change-me"
    jwt_refresh_secret_key: str = "change-me-too"
    jwt_algorithm: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def sqlalchemy_database_uri(self) -> str:
        return (
            f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
