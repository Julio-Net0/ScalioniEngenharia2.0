"""Router FastAPI para /api/admin — login, mensagens, pedidos, etc."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import create_access_token, limiter, verify_password
from backend.infrastructure.database.models import (
    AdminUser,
    MensagemContato,
    Pedido,
    PedidoStatus,
)
from backend.infrastructure.database.session import get_db
from backend.interfaces.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])
logger = logging.getLogger(__name__)


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


@router.post("/login")
@limiter.limit("5/minute")
async def admin_login(
    request: Request,
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(AdminUser).where(AdminUser.email == data.email, AdminUser.ativo == True)  # noqa
    result = await db.execute(stmt)
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(data.senha, admin.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token({"sub": str(admin.id), "email": admin.email})
    return {"access_token": token, "token_type": "bearer"}


# ── Mensagens ─────────────────────────────────────────────────────────────────

@router.get("/mensagens")
async def list_mensagens(
    lida: bool | None = None,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    stmt = select(MensagemContato).order_by(MensagemContato.criada_em.desc())
    if lida is not None:
        stmt = stmt.where(MensagemContato.lida == lida)
    result = await db.execute(stmt)
    mensagens = result.scalars().all()
    nao_lidas = sum(1 for m in mensagens if not m.lida)
    return {"mensagens": mensagens, "nao_lidas": nao_lidas}


@router.patch("/mensagens/{mensagem_id}/lida", status_code=200)
async def marcar_lida(
    mensagem_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    import uuid as uuid_mod
    stmt = select(MensagemContato).where(MensagemContato.id == uuid_mod.UUID(mensagem_id))
    result = await db.execute(stmt)
    mensagem = result.scalar_one_or_none()
    if not mensagem:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    mensagem.lida = True
    await db.flush()
    return {"status": "ok"}


# ── Pedidos ───────────────────────────────────────────────────────────────────

@router.get("/pedidos")
async def list_pedidos(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    stmt = select(Pedido).order_by(Pedido.criado_em.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/pedidos/{pedido_id}")
async def get_pedido(
    pedido_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    import uuid as uuid_mod
    stmt = select(Pedido).where(Pedido.id == uuid_mod.UUID(pedido_id))
    result = await db.execute(stmt)
    pedido = result.scalar_one_or_none()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido


@router.post("/pedidos/{pedido_id}/reenviar-email", status_code=200)
async def reenviar_email_download(
    pedido_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    import uuid as uuid_mod
    from backend.application.email_service import send_download_email

    stmt = select(Pedido).where(Pedido.id == uuid_mod.UUID(pedido_id))
    result = await db.execute(stmt)
    pedido = result.scalar_one_or_none()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    if pedido.status != PedidoStatus.pago or not pedido.download_token:
        raise HTTPException(status_code=400, detail="Pedido sem token de download")

    try:
        await send_download_email(
            to_email=pedido.email,
            nome=pedido.nome,
            download_token=str(pedido.download_token),
        )
    except Exception as exc:
        logger.error("Falha ao reenviar e-mail: %s", exc)
        raise HTTPException(status_code=500, detail="Falha ao enviar e-mail")

    return {"status": "enviado"}
