import { Pedido } from "../entities/Pedido";

export interface IPedidoRepository {
  criarPedido(plantaId: string, nome: string, email: string, telefone?: string): Promise<{ id: string; init_point: string }>;
  getPedidos(token: string): Promise<Pedido[]>;
  reenviarEmail(token: string, id: string): Promise<void>;
  atualizarStatus(token: string, id: string, status: string): Promise<void>;
}
