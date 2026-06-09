export interface PlainMensagemContato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
}

export class MensagemContato {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string,
    public readonly telefone: string | null,
    public readonly mensagem: string,
    public readonly lida: boolean,
    public readonly criadaEm: string
  ) {}
}
