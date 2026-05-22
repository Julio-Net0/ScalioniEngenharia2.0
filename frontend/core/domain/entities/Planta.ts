import { Preco } from "../value-objects/Preco";

export interface PlainPlanta {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  preco: {
    valor: number;
  };
  imagens: string[];
  terrenoMinimoM2: number | null;
  ativo: boolean;
  arquivoPath: string | null;
}

export class Planta {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly titulo: string,
    public readonly descricao: string,
    public readonly preco: Preco,
    public readonly imagens: string[],
    public readonly terrenoMinimoM2: number | null,
    public readonly ativo: boolean,
    public readonly arquivoPath: string | null = null
  ) {}

  public temTerrenoMinimo(): boolean {
    return this.terrenoMinimoM2 !== null;
  }
}

