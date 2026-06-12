from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from backend.core.config import settings
from backend.core.security import limiter
from backend.interfaces.routers import (
    admin,
    contato,
    pedidos,
    plantas,
    projetos,
    upload,
    webhook,
)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    import sys
    import os
    if "pytest" not in sys.modules or os.getenv("FORCE_STARTUP_VALIDATION") == "true":
        if not settings.mp_access_token:
            raise RuntimeError("MP_ACCESS_TOKEN is required")
        if not settings.mp_webhook_secret:
            raise RuntimeError("MP_WEBHOOK_SECRET is required")
        if not settings.frontend_url:
            raise RuntimeError("FRONTEND_URL is required")
            
        has_smtp = bool(settings.smtp_host and settings.smtp_user and settings.smtp_password)
        has_sendgrid = bool(os.getenv("SENDGRID_API_KEY"))
        if not (has_smtp or has_sendgrid):
            raise RuntimeError("Either SMTP configuration or SENDGRID_API_KEY is required")
    yield

app = FastAPI(
    title="Scalioni Engenharia API",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Prometheus metrics — expõe /metrics
Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projetos.router)
app.include_router(plantas.router)
app.include_router(pedidos.router)
app.include_router(contato.router)
app.include_router(admin.router)
app.include_router(upload.router)
app.include_router(webhook.router)
from fastapi.staticfiles import StaticFiles
from backend.interfaces.routers.download import router_download

app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")
app.include_router(router_download)


@app.get("/health", tags=["healthcheck"])
async def healthcheck() -> dict:
    return {"status": "ok"}
