import { IProjetoRepository } from "../../domain/repositories/IProjetoRepository";
import { Projeto } from "../../domain/entities/Projeto";

export class ListarProjetosUseCase {
  constructor(private readonly repo: IProjetoRepository) {}

  public async execute(): Promise<Projeto[]> {
    return this.repo.getProjetos();
  }
}
