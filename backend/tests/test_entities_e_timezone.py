"""
Testes unitários das entidades de domínio e utilitários de timezone.
Sem dependência de banco de dados — puro Python.
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

import pytest

from backend.core.timezone import BRT, now_brt, now_utc, to_brt
from backend.domain.entities.admin_user import AdminUser
from backend.domain.entities.mensagem_contato import MensagemContato
from backend.domain.entities.pedido import Pedido, PedidoStatus
from backend.domain.entities.planta import Planta
from backend.domain.entities.projeto import Projeto


# ─── core/timezone.py ────────────────────────────────────────────────────────

class TestTimezone:
    def test_now_utc_is_aware(self):
        dt = now_utc()
        assert dt.tzinfo is not None
        assert dt.utcoffset().total_seconds() == 0

    def test_now_brt_is_aware(self):
        dt = now_brt()
        assert dt.tzinfo is not None

    def test_now_brt_offset_minus3_or_minus2(self):
        """BRT é UTC-3 (ou UTC-2 no horário de verão)."""
        dt = now_brt()
        offset_hours = dt.utcoffset().total_seconds() / 3600
        assert offset_hours in (-3.0, -2.0)

    def test_to_brt_converts_utc(self):
        utc_dt = datetime(2026, 4, 10, 16, 0, 0, tzinfo=timezone.utc)
        brt_dt = to_brt(utc_dt)
        # 16h UTC = 13h BRT (UTC-3)
        assert brt_dt.hour == 13

    def test_brt_constant_is_sao_paulo(self):
        assert "Sao_Paulo" in str(BRT) or "America" in str(BRT)

    def test_now_utc_type(self):
        assert isinstance(now_utc(), datetime)

    def test_now_brt_type(self):
        assert isinstance(now_brt(), datetime)


# ─── domain/entities/pedido.py ───────────────────────────────────────────────

class TestPedidoEntity:
    def _make_pedido(self, **kwargs):
        defaults = dict(
            planta_id=uuid.uuid4(),
            email="cliente@email.com",
            nome="Cliente Teste",
            valor=Decimal("2490.00"),
        )
        return Pedido(**{**defaults, **kwargs})

    def test_pedido_default_status_pendente(self):
        p = self._make_pedido()
        assert p.status == PedidoStatus.pendente

    def test_pedido_id_gerado_automaticamente(self):
        p = self._make_pedido()
        assert isinstance(p.id, uuid.UUID)

    def test_pedido_ids_unicos(self):
        p1 = self._make_pedido()
        p2 = self._make_pedido()
        assert p1.id != p2.id

    def test_pedido_criado_em_aware(self):
        p = self._make_pedido()
        assert p.criado_em.tzinfo is not None

    def test_pedido_atualizado_em_aware(self):
        p = self._make_pedido()
        assert p.atualizado_em.tzinfo is not None

    def test_pedido_campos_opcionais_none(self):
        p = self._make_pedido()
        assert p.telefone is None
        assert p.mp_payment_id is None
        assert p.download_token is None
        assert p.expires_at is None

    def test_pedido_status_enum_values(self):
        assert PedidoStatus.pago == "pago"
        assert PedidoStatus.rejected == "rejected"
        assert PedidoStatus.cancelled == "cancelled"
        assert PedidoStatus.in_process == "in_process"


# ─── domain/entities/planta.py ───────────────────────────────────────────────

class TestPlantaEntity:
    def _make_planta(self, **kwargs):
        defaults = dict(
            slug="residencia-aurum",
            titulo="Residência Aurum",
            descricao="Planta de alto padrão",
            preco=Decimal("2490.00"),
        )
        return Planta(**{**defaults, **kwargs})

    def test_planta_ativo_by_default(self):
        p = self._make_planta()
        assert p.ativo is True

    def test_planta_id_gerado(self):
        p = self._make_planta()
        assert isinstance(p.id, uuid.UUID)

    def test_planta_imagens_lista_vazia(self):
        p = self._make_planta()
        assert p.imagens == []

    def test_planta_criado_em_aware(self):
        p = self._make_planta()
        assert p.criado_em.tzinfo is not None

    def test_planta_terreno_minimo_none(self):
        p = self._make_planta()
        assert p.terreno_minimo_m2 is None

    def test_planta_arquivo_path_none(self):
        p = self._make_planta()
        assert p.arquivo_path is None


# ─── domain/entities/projeto.py ──────────────────────────────────────────────

class TestProjetoEntity:
    def _make_projeto(self, **kwargs):
        defaults = dict(
            slug="mansao-alvorada",
            titulo="Mansão Alvorada",
            descricao="Projeto residencial de luxo",
            categoria="Residencial",
            imagem_capa="/imgs/capa.jpg",
            ano=2023,
        )
        return Projeto(**{**defaults, **kwargs})

    def test_projeto_ativo_by_default(self):
        p = self._make_projeto()
        assert p.ativo is True

    def test_projeto_id_gerado(self):
        p = self._make_projeto()
        assert isinstance(p.id, uuid.UUID)

    def test_projeto_imagens_lista_vazia(self):
        p = self._make_projeto()
        assert p.imagens == []

    def test_projeto_criado_em_aware(self):
        p = self._make_projeto()
        assert p.criado_em.tzinfo is not None

    def test_projeto_ids_unicos(self):
        p1 = self._make_projeto()
        p2 = self._make_projeto()
        assert p1.id != p2.id


# ─── domain/entities/mensagem_contato.py ─────────────────────────────────────

class TestMensagemContatoEntity:
    def _make_mensagem(self, **kwargs):
        defaults = dict(
            nome="Ricardo Alencar",
            email="ricardo@empresa.com",
            mensagem="Tenho interesse em construir uma residência.",
        )
        return MensagemContato(**{**defaults, **kwargs})

    def test_mensagem_lida_false_by_default(self):
        m = self._make_mensagem()
        assert m.lida is False

    def test_mensagem_id_gerado(self):
        m = self._make_mensagem()
        assert isinstance(m.id, uuid.UUID)

    def test_mensagem_telefone_none(self):
        m = self._make_mensagem()
        assert m.telefone is None

    def test_mensagem_criada_em_aware(self):
        m = self._make_mensagem()
        assert m.criada_em.tzinfo is not None

    def test_mensagem_ids_unicos(self):
        m1 = self._make_mensagem()
        m2 = self._make_mensagem()
        assert m1.id != m2.id


# ─── domain/entities/admin_user.py ───────────────────────────────────────────

class TestAdminUserEntity:
    def test_admin_user_id_gerado(self):
        from backend.domain.entities.admin_user import AdminUser
        user = AdminUser(nome="Admin", email="admin@scalioni.com", senha_hash="hash123")
        assert isinstance(user.id, uuid.UUID)

    def test_admin_user_ativo_by_default(self):
        from backend.domain.entities.admin_user import AdminUser
        user = AdminUser(nome="Admin", email="admin@scalioni.com", senha_hash="hash123")
        assert user.ativo is True

    def test_admin_user_criado_em_aware(self):
        from backend.domain.entities.admin_user import AdminUser
        user = AdminUser(nome="Admin", email="admin@scalioni.com", senha_hash="hash123")
        assert user.criado_em.tzinfo is not None
