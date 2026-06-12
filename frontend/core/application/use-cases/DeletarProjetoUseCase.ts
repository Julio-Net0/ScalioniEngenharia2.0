import { IProjetoRepository } from "../../domain/repositories/IProjetoRepository";

export class DeletarProjetoUseCase {
  constructor(private readonly repo: IProjetoRepository) {}

  public async execute(token: string, slug: string): Promise<void> {
    if (!token || !slug) {
      throw new Error("Token e slug do projeto são obrigatórios.");
    }
    return this.repo.deleteProjeto(token, slug);
  }
}
