import { Planta } from "../entities/Planta";

export interface IPlantaRepository {
  getPlantas(): Promise<Planta[]>;
  getPlanta(slug: string): Promise<Planta>;
  deletePlanta(token: string, slug: string): Promise<void>;
}
