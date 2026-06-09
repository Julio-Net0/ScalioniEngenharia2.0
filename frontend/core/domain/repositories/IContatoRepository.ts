import { MensagemContato } from "../entities/MensagemContato";

export interface IContatoRepository {
  enviarMensagem(nome: string, email: string, mensagem: string, telefone?: string, assunto?: string): Promise<{ id: string; criada_em: string }>;
  getMensagens(token: string): Promise<{ mensagens: MensagemContato[]; nao_lidas: number }>;
  marcarLida(token: string, id: string): Promise<void>;
}
