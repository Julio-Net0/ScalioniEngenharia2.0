import { IPlantaRepository } from "../../domain/repositories/IPlantaRepository";

export class DeletarPlantaUseCase {
  constructor(private readonly repo: IPlantaRepository) {}

  public async execute(token: string, slug: string): Promise<void> {
    if (!token || !slug) {
      throw new Error("Token e slug da planta são obrigatórios.");
    }
    return this.repo.deletePlanta(token, slug);
  }
}
