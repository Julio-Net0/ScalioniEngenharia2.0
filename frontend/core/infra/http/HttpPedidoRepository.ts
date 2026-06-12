import { IPedidoRepository } from "../../domain/repositories/IPedidoRepository";
import { Pedido } from "../../domain/entities/Pedido";

export class HttpPedidoRepository implements IPedidoRepository {
  constructor(private readonly apiUrl: string) {}

  public async criarPedido(
    plantaId: string,
    nome: string,
    email: string,
    telefone?: string
  ): Promise<{ id: string; init_point: string }> {
    const res = await fetch(`${this.apiUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planta_id: plantaId, nome, email, telefone })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? "Erro ao criar pedido");
    }
    return res.json();
  }

  public async getPedidos(token: string): Promise<Pedido[]> {
    const res = await fetch(`${this.apiUrl}/api/admin/pedidos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erro ao carregar pedidos");
    const data = await res.json();
    return data.map((p: any) => new Pedido(
      p.id, p.planta_id, p.email, p.nome, p.telefone, Number(p.valor), p.status, p.mp_payment_id, p.download_token, p.expires_at, p.criado_em, p.atualizado_em
    ));
  }

  public async reenviarEmail(token: string, id: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/api/admin/pedidos/${id}/reenviar-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erro ao reenviar e-mail");
  }

  public async atualizarStatus(token: string, id: string, status: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/api/admin/pedidos/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Erro ao atualizar status do pedido");
  }
}
