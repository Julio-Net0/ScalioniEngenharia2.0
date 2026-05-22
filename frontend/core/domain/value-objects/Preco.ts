import { PrecoNegativoError } from "../errors/PrecoNegativoError";

export class Preco {
  constructor(public readonly valor: number) {
    // Autovalidação na criação
    if (valor < 0) {
      throw new PrecoNegativoError();
    }
  }

  public equals(outroPreco: Preco): boolean {
    return this.valor === outroPreco.valor;
  }

  public formatarBRL(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valor);
  }
}
