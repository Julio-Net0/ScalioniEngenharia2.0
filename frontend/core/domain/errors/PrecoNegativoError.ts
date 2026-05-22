export class PrecoNegativoError extends Error {
  constructor() {
    super("Erro de Validação de Domínio: O preço de um item do catálogo não pode ser inferior a R$ 0,00.");
    this.name = "PrecoNegativoError";
  }
}
