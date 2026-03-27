import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Enum,
    ForeignKey,
    Index,
    Numeric,
    SmallInteger,
    String,
    Text,
    TIMESTAMP,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class PedidoStatus(str, enum.Enum):
    pendente = "pendente"
    pago = "pago"
    rejected = "rejected"
    cancelled = "cancelled"
    in_process = "in_process"


class Projeto(Base):
    __tablename__ = "projetos"
    __table_args__ = (
        CheckConstraint("ano >= 1900 AND ano <= 2100", name="ck_projetos_ano"),
        UniqueConstraint("slug", name="uq_projetos_slug"),
        Index("idx_projetos_ativo", "ativo"),
        Index("idx_projetos_slug", "slug"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    titulo: Mapped[str] = mapped_column(Text, nullable=False)
    descricao: Mapped[str] = mapped_column(Text, nullable=False)
    categoria: Mapped[str] = mapped_column(Text, nullable=False)
    imagem_capa: Mapped[str] = mapped_column(Text, nullable=False)
    imagens: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, default=list)
    ano: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    ativo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    criado_em: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())


class Planta(Base):
    __tablename__ = "plantas"
    __table_args__ = (
        CheckConstraint("preco >= 0", name="ck_plantas_preco"),
        UniqueConstraint("slug", name="uq_plantas_slug"),
        Index("idx_plantas_ativo", "ativo"),
        Index("idx_plantas_slug", "slug"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    titulo: Mapped[str] = mapped_column(Text, nullable=False)
    descricao: Mapped[str] = mapped_column(Text, nullable=False)
    preco: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    imagens: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, default=list)
    terreno_minimo_m2: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    arquivo_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    ativo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    criado_em: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

    pedidos: Mapped[list["Pedido"]] = relationship("Pedido", back_populates="planta")


class Pedido(Base):
    __tablename__ = "pedidos"
    __table_args__ = (
        UniqueConstraint("mp_payment_id", name="uq_pedidos_mp_payment_id"),
        UniqueConstraint("download_token", name="uq_pedidos_download_token"),
        Index("idx_pedidos_status", "status"),
        Index("idx_pedidos_email", "email"),
        Index("idx_pedidos_mp_payment_id", "mp_payment_id"),
        Index("idx_pedidos_download_token", "download_token"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    planta_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("plantas.id", ondelete="RESTRICT"),
        nullable=False,
    )
    email: Mapped[str] = mapped_column(Text, nullable=False)
    nome: Mapped[str] = mapped_column(Text, nullable=False)
    telefone: Mapped[str | None] = mapped_column(Text, nullable=True)
    valor: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[PedidoStatus] = mapped_column(
        Enum(PedidoStatus, name="pedido_status"),
        nullable=False,
        default=PedidoStatus.pendente,
    )
    mp_payment_id: Mapped[str | None] = mapped_column(Text, nullable=True, unique=True)
    download_token: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True, unique=True)
    expires_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    criado_em: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    atualizado_em: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    planta: Mapped["Planta"] = relationship("Planta", back_populates="pedidos")


class AdminUser(Base):
    __tablename__ = "admin_users"
    __table_args__ = (UniqueConstraint("email", name="uq_admin_users_email"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    senha_hash: Mapped[str] = mapped_column(Text, nullable=False)
    ativo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    criado_em: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())


class MensagemContato(Base):
    __tablename__ = "mensagens_contato"
    __table_args__ = (
        CheckConstraint("length(mensagem) <= 2000", name="ck_mensagens_tamanho"),
        Index("idx_mensagens_lida", "lida"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False)
    telefone: Mapped[str | None] = mapped_column(Text, nullable=True)
    mensagem: Mapped[str] = mapped_column(Text, nullable=False)
    lida: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    criada_em: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
