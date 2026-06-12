import { Projeto } from "../entities/Projeto";
import { PlainProjeto } from "../entities/Projeto";

export interface IProjetoRepository {
  getProjetos(): Promise<Projeto[]>;
  getProjeto(slug: string): Promise<Projeto>;
  createProjeto(token: string, data: Omit<PlainProjeto, "id" | "criadoEm">): Promise<Projeto>;
  updateProjeto(token: string, slug: string, data: Partial<PlainProjeto>): Promise<Projeto>;
  deleteProjeto(token: string, slug: string): Promise<void>;
}
