export interface PlainPedido {
  id: string;
  plantaId: string;
  email: string;
  nome: string;
  telefone: string | null;
  valor: number;
  status: 'pendente' | 'pago' | 'rejected' | 'cancelled' | 'in_process';
  mpPaymentId: string | null;
  downloadToken: string | null;
  expiresAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export class Pedido {
  constructor(
    public readonly id: string,
    public readonly plantaId: string,
    public readonly email: string,
    public readonly nome: string,
    public readonly telefone: string | null,
    public readonly valor: number,
    public readonly status: 'pendente' | 'pago' | 'rejected' | 'cancelled' | 'in_process',
    public readonly mpPaymentId: string | null,
    public readonly downloadToken: string | null,
    public readonly expiresAt: string | null,
    public readonly criadoEm: string,
    public readonly atualizadoEm: string
  ) {}
}
