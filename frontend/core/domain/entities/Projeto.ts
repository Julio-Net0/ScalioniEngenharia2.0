export interface PlainProjeto {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  imagemCapa: string;
  imagens: string[];
  ano: number;
  ativo: boolean;
  criadoEm: string;
}

export class Projeto {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly titulo: string,
    public readonly descricao: string,
    public readonly categoria: string,
    public readonly imagemCapa: string,
    public readonly imagens: string[],
    public readonly ano: number,
    public readonly ativo: boolean,
    public readonly criadoEm: string
  ) {}
}
