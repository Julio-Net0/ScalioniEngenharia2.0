import { Planta } from "../entities/Planta";

export interface IPlantaRepository {
  getPlantas(): Promise<Planta[]>;
  getPlanta(slug: string): Promise<Planta>;
}
