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

app = FastAPI(
    title="Scalioni Engenharia API",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
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
from backend.interfaces.routers.download import router_download
app.include_router(router_download)


@app.get("/health", tags=["healthcheck"])
async def healthcheck() -> dict:
    return {"status": "ok"}
