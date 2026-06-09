import { IContatoRepository } from "../../domain/repositories/IContatoRepository";

export class SubmeterContatoUseCase {
  constructor(private readonly repo: IContatoRepository) {}

  public async execute(
    nome: string,
    email: string,
    mensagem: string,
    telefone?: string,
    assunto?: string
  ): Promise<{ id: string; criada_em: string }> {
    if (!nome || !email || !mensagem) {
      throw new Error("Nome, e-mail e mensagem são obrigatórios.");
    }
    return this.repo.enviarMensagem(nome, email, mensagem, telefone, assunto);
  }
}
