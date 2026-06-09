import { IProjetoRepository } from "../../domain/repositories/IProjetoRepository";
import { Projeto, PlainProjeto } from "../../domain/entities/Projeto";

export class HttpProjetoRepository implements IProjetoRepository {
  constructor(private readonly apiUrl: string) {}

  public async getProjetos(): Promise<Projeto[]> {
    const res = await fetch(`${this.apiUrl}/api/projetos`);
    if (!res.ok) throw new Error("Falha ao recuperar projetos");
    const data = await res.json();
    
    return data.map((p: any) => new Projeto(
      p.id, p.slug, p.titulo, p.descricao, p.categoria, p.imagem_capa, p.imagens, p.ano, p.ativo, p.criado_em
    ));
  }

  public async getProjeto(slug: string): Promise<Projeto> {
    const res = await fetch(`${this.apiUrl}/api/projetos/${slug}`);
    if (!res.ok) throw new Error("Projeto não encontrado");
    const p = await res.json();
    
    return new Projeto(
      p.id, p.slug, p.titulo, p.descricao, p.categoria, p.imagem_capa, p.imagens, p.ano, p.ativo, p.criado_em
    );
  }

  public async createProjeto(token: string, data: Omit<PlainProjeto, "id" | "criadoEm">): Promise<Projeto> {
    const res = await fetch(`${this.apiUrl}/api/projetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        slug: data.slug,
        titulo: data.titulo,
        descricao: data.descricao,
        categoria: data.categoria,
        imagem_capa: data.imagemCapa,
        imagens: data.imagens,
        ano: data.ano,
        ativo: data.ativo
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? "Erro ao criar projeto");
    }
    const p = await res.json();
    return new Projeto(
      p.id, p.slug, p.titulo, p.descricao, p.categoria, p.imagem_capa, p.imagens, p.ano, p.ativo, p.criado_em
    );
  }

  public async updateProjeto(token: string, slug: string, data: Partial<PlainProjeto>): Promise<Projeto> {
    const body: any = {};
    if (data.slug !== undefined) body.slug = data.slug;
    if (data.titulo !== undefined) body.titulo = data.titulo;
    if (data.descricao !== undefined) body.descricao = data.descricao;
    if (data.categoria !== undefined) body.categoria = data.categoria;
    if (data.imagemCapa !== undefined) body.imagem_capa = data.imagemCapa;
    if (data.imagens !== undefined) body.imagens = data.imagens;
    if (data.ano !== undefined) body.ano = data.ano;
    if (data.ativo !== undefined) body.ativo = data.ativo;

    const res = await fetch(`${this.apiUrl}/api/projetos/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? "Erro ao atualizar projeto");
    }
    const p = await res.json();
    return new Projeto(
      p.id, p.slug, p.titulo, p.descricao, p.categoria, p.imagem_capa, p.imagens, p.ano, p.ativo, p.criado_em
    );
  }

  public async deleteProjeto(token: string, slug: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/api/projetos/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Falha ao excluir projeto");
  }
}
