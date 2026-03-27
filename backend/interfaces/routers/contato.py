"""Router FastAPI para POST /api/contato."""

import logging

from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.application import email_service
from backend.core.security import limiter
from backend.infrastructure.database.models import MensagemContato
from backend.infrastructure.database.session import get_db

router = APIRouter(prefix="/api/contato", tags=["contato"])
logger = logging.getLogger(__name__)


class ContatoCreate(BaseModel):
    nome: str = Field(..., min_length=1)
    email: EmailStr
    telefone: str | None = None
    mensagem: str = Field(..., min_length=1, max_length=2000)


@router.post("", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def create_contato(
    request: Request,
    data: ContatoCreate,
    db: AsyncSession = Depends(get_db),
):
    mensagem = MensagemContato(
        nome=data.nome,
        email=data.email,
        telefone=data.telefone,
        mensagem=data.mensagem,
    )
    db.add(mensagem)
    await db.flush()

    # Tenta enviar e-mails; falha silenciosa (banco já salvo)
    try:
        await email_service.send_contact_confirmation(to_email=data.email, nome=data.nome)
    except Exception as exc:
        logger.error("Falha ao enviar e-mail de confirmação: %s", exc)

    try:
        await email_service.send_contact_admin_notification(
            nome=data.nome, email=data.email, mensagem=data.mensagem
        )
    except Exception as exc:
        logger.error("Falha ao enviar notificação admin: %s", exc)

    return {"id": str(mensagem.id), "status": "recebido"}
