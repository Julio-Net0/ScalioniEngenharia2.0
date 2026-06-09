import { IPedidoRepository } from "../../domain/repositories/IPedidoRepository";
import { Pedido } from "../../domain/entities/Pedido";

export class ListarPedidosUseCase {
  constructor(private readonly repo: IPedidoRepository) {}

  public async execute(token: string): Promise<Pedido[]> {
    if (!token) {
      throw new Error("Token de autenticação é obrigatório.");
    }
    return this.repo.getPedidos(token);
  }
}
