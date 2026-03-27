"""Router FastAPI para POST /api/upload."""

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile

from backend.interfaces.dependencies import get_current_admin

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/app/uploads"))


@router.post("", status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_admin),
) -> dict:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    extension = Path(file.filename or "file").suffix
    filename = f"{uuid.uuid4()}{extension}"
    dest = UPLOAD_DIR / filename

    contents = await file.read()
    dest.write_bytes(contents)

    return {"path": f"/uploads/{filename}"}
