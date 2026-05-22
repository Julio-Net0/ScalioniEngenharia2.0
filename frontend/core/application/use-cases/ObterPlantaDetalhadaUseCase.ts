import { IPlantaRepository } from "../../domain/repositories/IPlantaRepository";
import { Planta } from "../../domain/entities/Planta";

export class ObterPlantaDetalhadaUseCase {
  constructor(private readonly repo: IPlantaRepository) {}

  public async execute(slug: string): Promise<Planta> {
    if (!slug) {
      throw new Error("O slug da planta é obrigatório para a busca.");
    }
    
    const planta = await this.repo.getPlanta(slug);
    
    // Regra de aplicação: não podemos detalhar uma planta inativa no catálogo público
    if (!planta.ativo) {
      throw new Error("Esta planta está temporariamente indisponível no catálogo.");
    }
    
    return planta;
  }
}
