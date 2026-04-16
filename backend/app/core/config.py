"""Configurações da aplicação via pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "dev"
    APP_DEBUG: bool = True
    APP_VERSION: str = "0.1.0"
    APP_SECRET_KEY: str = "change-me-in-production"

    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/pef_dev"
    REDIS_URL: str | None = None

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    LOG_LEVEL: str = "INFO"
    RATE_LIMIT_DEFAULT: str = "100/minute"
    IDEMPOTENCY_TTL_SECONDS: int = 86400
    STORAGE_BUCKET: str = "local"


settings = Settings()
