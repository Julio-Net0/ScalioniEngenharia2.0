"""Router FastAPI para /api/admin — login, mensagens, pedidos, etc."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import create_access_token, limiter, verify_password
from backend.infrastructure.database.models import PedidoStatus
from backend.infrastructure.database.session import get_db
from backend.interfaces.dependencies import get_current_admin
from backend.infrastructure.repositories.admin_user_repository import AdminUserRepository
from backend.infrastructure.repositories.mensagem_contato_repository import MensagemContatoRepository
from backend.infrastructure.repositories.pedido_repository import PedidoRepository
from backend.infrastructure.repositories.planta_repository import PlantaRepository

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
    admin_repo = AdminUserRepository(db)
    admin = await admin_repo.get_by_email(data.email, only_active=True)

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
    msg_repo = MensagemContatoRepository(db)
    all_msgs = await msg_repo.list_all()
    nao_lidas = sum(1 for m in all_msgs if not m.lida)
    
    if lida is not None:
        mensagens = [m for m in all_msgs if m.lida == lida]
    else:
        mensagens = all_msgs
        
    return {"mensagens": mensagens, "nao_lidas": nao_lidas}


@router.patch("/mensagens/{mensagem_id}/lida", status_code=200)
async def marcar_lida(
    mensagem_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    import uuid as uuid_mod
    msg_repo = MensagemContatoRepository(db)
    mensagem = await msg_repo.get_by_id(uuid_mod.UUID(mensagem_id))
    if not mensagem:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    mensagem.lida = True
    await msg_repo.update(mensagem)
    return {"status": "ok"}


# ── Pedidos ───────────────────────────────────────────────────────────────────

@router.get("/pedidos")
async def list_pedidos(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    pedido_repo = PedidoRepository(db)
    planta_repo = PlantaRepository(db)
    pedidos = await pedido_repo.list_all()

    plantas_by_id = {}
    for pedido in pedidos:
        if pedido.planta_id not in plantas_by_id:
            plantas_by_id[pedido.planta_id] = await planta_repo.get_by_id(pedido.planta_id)

    result = []
    for pedido in pedidos:
        planta = plantas_by_id.get(pedido.planta_id)
        item = {c.name: getattr(pedido, c.name) for c in pedido.__table__.columns}
        item["planta"] = {"titulo": planta.titulo} if planta else None
        result.append(item)
    return result


@router.get("/pedidos/{pedido_id}")
async def get_pedido(
    pedido_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    import uuid as uuid_mod
    pedido_repo = PedidoRepository(db)
    pedido = await pedido_repo.get_by_id(uuid_mod.UUID(pedido_id))
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
    from backend.infrastructure.repositories.planta_repository import PlantaRepository

    pedido_repo = PedidoRepository(db)
    pedido = await pedido_repo.get_by_id(uuid_mod.UUID(pedido_id))
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    if pedido.status != PedidoStatus.pago or not pedido.download_token:
        raise HTTPException(status_code=400, detail="Pedido sem token de download")

    planta_repo = PlantaRepository(db)
    planta = await planta_repo.get_by_id(pedido.planta_id)
    planta_titulo = planta.titulo if planta else "Planta"

    try:
        await send_download_email(
            to_email=pedido.email,
            nome=pedido.nome,
            download_token=str(pedido.download_token),
            planta_titulo=planta_titulo,
        )
    except Exception as exc:
        logger.error("Falha ao reenviar e-mail: %s", exc)
        raise HTTPException(status_code=500, detail="Falha ao enviar e-mail")

    return {"status": "enviado"}


class StatusUpdateRequest(BaseModel):
    status: str


@router.patch("/pedidos/{pedido_id}/status", status_code=200)
async def update_pedido_status(
    pedido_id: str,
    data: StatusUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    import uuid as uuid_mod
    pedido_repo = PedidoRepository(db)
    pedido = await pedido_repo.get_by_id(uuid_mod.UUID(pedido_id))
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    try:
        pedido.status = PedidoStatus(data.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Status inválido")
        
    await pedido_repo.update(pedido)
    return {"status": "atualizado"}


@router.get("/usuarios")
async def list_usuarios(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    admin_repo = AdminUserRepository(db)
    return await admin_repo.list_all()

