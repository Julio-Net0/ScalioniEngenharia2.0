import { IAdminRepository } from "../../domain/repositories/IAdminRepository";

export class HttpAdminRepository implements IAdminRepository {
  constructor(private readonly apiUrl: string) {}

  public async login(email: string, senha: string): Promise<string> {
    const res = await fetch(`${this.apiUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    if (!res.ok) throw new Error("Credenciais inválidas");
    const data = await res.json();
    return data.access_token;
  }

  public async getUsuarios(token: string): Promise<any[]> {
    const res = await fetch(`${this.apiUrl}/api/admin/usuarios`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erro ao carregar usuários");
    return res.json();
  }
}
