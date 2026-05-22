import { IPlantaRepository } from "../../domain/repositories/IPlantaRepository";
import { Planta } from "../../domain/entities/Planta";
import { Preco } from "../../domain/value-objects/Preco";

export class HttpPlantaRepository implements IPlantaRepository {
  constructor(private readonly apiUrl: string) {}

  public async getPlantas(): Promise<Planta[]> {
    const res = await fetch(`${this.apiUrl}/api/plantas`);
    if (!res.ok) throw new Error("Falha ao recuperar plantas");
    const data = await res.json();
    
    return data.map((p: any) => new Planta(
      p.id, p.slug, p.titulo, p.descricao, new Preco(Number(p.preco)), p.imagens, p.terreno_minimo_m2, p.ativo, p.arquivo_path
    ));
  }

  public async getPlanta(slug: string): Promise<Planta> {
    const res = await fetch(`${this.apiUrl}/api/plantas/${slug}`);
    if (!res.ok) throw new Error("Planta não encontrada");
    const p = await res.json();
    
    return new Planta(
      p.id, p.slug, p.titulo, p.descricao, new Preco(Number(p.preco)), p.imagens, p.terreno_minimo_m2, p.ativo, p.arquivo_path
    );
  }
}
