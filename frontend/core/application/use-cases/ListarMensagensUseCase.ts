import { IContatoRepository } from "../../domain/repositories/IContatoRepository";
import { MensagemContato } from "../../domain/entities/MensagemContato";

export class ListarMensagensUseCase {
  constructor(private readonly repo: IContatoRepository) {}

  public async execute(token: string): Promise<{ mensagens: MensagemContato[]; nao_lidas: number }> {
    if (!token) {
      throw new Error("Token de autenticação é obrigatório.");
    }
    return this.repo.getMensagens(token);
  }
}
