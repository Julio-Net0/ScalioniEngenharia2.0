import { IContatoRepository } from "../../domain/repositories/IContatoRepository";

export class MarcarMensagemLidaUseCase {
  constructor(private readonly repo: IContatoRepository) {}

  public async execute(token: string, id: string): Promise<void> {
    if (!token || !id) {
      throw new Error("Token e ID são obrigatórios.");
    }
    return this.repo.marcarLida(token, id);
  }
}
