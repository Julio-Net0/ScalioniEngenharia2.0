export interface IAdminRepository {
  login(email: string, senha: string): Promise<string>;
  getUsuarios(token: string): Promise<any[]>;
}
