"""Router FastAPI para POST /api/upload."""

import os
import uuid
from pathlib import Path
import anyio

from fastapi import APIRouter, Depends, File, UploadFile

from backend.core.config import settings
from backend.interfaces.dependencies import get_current_admin

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/app/uploads"))

# Configurar Cloudinary se as credenciais estiverem preenchidas
use_cloudinary = bool(
    settings.cloudinary_cloud_name
    and settings.cloudinary_api_key
    and settings.cloudinary_api_secret
)

if use_cloudinary:
    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


@router.post("", status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_admin),
) -> dict:
    if use_cloudinary:
        contents = await file.read()
        # Executa chamada síncrona I/O de rede em thread worker para não bloquear o loop de eventos
        upload_result = await anyio.to_thread.run_sync(
            cloudinary.uploader.upload,
            contents
        )
        return {"url": upload_result["secure_url"]}
    else:
        # Fallback local para desenvolvimento/testes onde Cloudinary não está configurado
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        extension = Path(file.filename or "file").suffix
        filename = f"{uuid.uuid4()}{extension}"
        dest = UPLOAD_DIR / filename

        contents = await file.read()
        dest.write_bytes(contents)

        return {"url": f"/uploads/{filename}"}
