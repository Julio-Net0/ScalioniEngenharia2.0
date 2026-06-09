import { IAdminRepository } from "../../domain/repositories/IAdminRepository";

export class LoginAdminUseCase {
  constructor(private readonly repo: IAdminRepository) {}

  public async execute(email: string, senha: string): Promise<string> {
    if (!email || !senha) {
      throw new Error("E-mail e senha são obrigatórios.");
    }
    return this.repo.login(email, senha);
  }
}
