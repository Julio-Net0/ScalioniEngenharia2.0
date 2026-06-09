import { IContatoRepository } from "../../domain/repositories/IContatoRepository";
import { MensagemContato } from "../../domain/entities/MensagemContato";

export class HttpContatoRepository implements IContatoRepository {
  constructor(private readonly apiUrl: string) {}

  public async enviarMensagem(
    nome: string,
    email: string,
    mensagem: string,
    telefone?: string,
    assunto?: string
  ): Promise<{ id: string; criada_em: string }> {
    const res = await fetch(`${this.apiUrl}/api/contato`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, mensagem, telefone, assunto })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? "Erro ao enviar mensagem");
    }
    return res.json();
  }

  public async getMensagens(token: string): Promise<{ mensagens: MensagemContato[]; nao_lidas: number }> {
    const res = await fetch(`${this.apiUrl}/api/admin/mensagens`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erro ao carregar mensagens");
    const data = await res.json();
    return {
      mensagens: data.mensagens.map((m: any) => new MensagemContato(
        m.id, m.nome, m.email, m.telefone, m.mensagem, m.lida, m.criada_em
      )),
      nao_lidas: data.nao_lidas
    };
  }

  public async marcarLida(token: string, id: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/api/admin/mensagens/${id}/lida`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erro ao marcar mensagem como lida");
  }
}
