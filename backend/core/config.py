from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    debug: bool = False
    secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # CORS
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Database
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/scalioni"

    @field_validator("database_url", mode="before")
    @classmethod
    def assemble_db_url(cls, v: str) -> str:
        if not v:
            return v
        if v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)

        # asyncpg não entende os parâmetros sslmode/channel_binding do libpq
        # (ex: strings de conexão do Neon) — traduz para o que o asyncpg aceita.
        parts = urlsplit(v)
        query = parse_qs(parts.query)
        if "sslmode" in query or "channel_binding" in query:
            query.pop("channel_binding", None)
            sslmode = query.pop("sslmode", None)
            if sslmode:
                query["ssl"] = sslmode
            v = urlunsplit(parts._replace(query=urlencode(query, doseq=True)))
        return v

    # Mercado Pago
    mp_access_token: str = ""
    mp_webhook_secret: str = ""

    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""

    # Frontend
    frontend_url: str = "http://localhost:3000"

    # URL pública deste backend (usada no notification_url do Mercado Pago)
    backend_url: str = "http://localhost:8000"

    # Admin e-mail for notifications
    admin_email: str = ""

    # Cloudinary Config
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""


settings = Settings()
