import { IPedidoRepository } from "../../domain/repositories/IPedidoRepository";

export class CriarPedidoUseCase {
  constructor(private readonly repo: IPedidoRepository) {}

  public async execute(
    plantaId: string,
    nome: string,
    email: string,
    telefone?: string
  ): Promise<{ id: string; init_point: string }> {
    if (!plantaId || !nome || !email) {
      throw new Error("Planta, nome e e-mail são obrigatórios.");
    }
    return this.repo.criarPedido(plantaId, nome, email, telefone);
  }
}
