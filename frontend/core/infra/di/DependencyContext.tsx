'use client';

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { HttpPlantaRepository } from "../http/HttpPlantaRepository";
import { HttpProjetoRepository } from "../http/HttpProjetoRepository";
import { HttpContatoRepository } from "../http/HttpContatoRepository";
import { HttpPedidoRepository } from "../http/HttpPedidoRepository";
import { HttpAdminRepository } from "../http/HttpAdminRepository";

import { ObterPlantaDetalhadaUseCase } from "../../application/use-cases/ObterPlantaDetalhadaUseCase";
import { SubmeterContatoUseCase } from "../../application/use-cases/SubmeterContatoUseCase";
import { LoginAdminUseCase } from "../../application/use-cases/LoginAdminUseCase";
import { MarcarMensagemLidaUseCase } from "../../application/use-cases/MarcarMensagemLidaUseCase";
import { ListarMensagensUseCase } from "../../application/use-cases/ListarMensagensUseCase";
import { CriarPedidoUseCase } from "../../application/use-cases/CriarPedidoUseCase";
import { ListarPedidosUseCase } from "../../application/use-cases/ListarPedidosUseCase";
import { ListarProjetosUseCase } from "../../application/use-cases/ListarProjetosUseCase";
import { DeletarProjetoUseCase } from "../../application/use-cases/DeletarProjetoUseCase";
import { DeletarPlantaUseCase } from "../../application/use-cases/DeletarPlantaUseCase";

interface DependencyContextType {
  obterPlantaDetalhadaUseCase: ObterPlantaDetalhadaUseCase;
  submeterContatoUseCase: SubmeterContatoUseCase;
  loginAdminUseCase: LoginAdminUseCase;
  marcarMensagemLidaUseCase: MarcarMensagemLidaUseCase;
  listarMensagensUseCase: ListarMensagensUseCase;
  criarPedidoUseCase: CriarPedidoUseCase;
  listarPedidosUseCase: ListarPedidosUseCase;
  listarProjetosUseCase: ListarProjetosUseCase;
  deletarProjetoUseCase: DeletarProjetoUseCase;
  deletarPlantaUseCase: DeletarPlantaUseCase;
}

const DependencyContext = createContext<DependencyContextType | null>(null);

export const DependencyProvider = ({ children }: { children: ReactNode }) => {
  const dependencies = useMemo(() => {
    const isServer = typeof window === 'undefined';
    const apiUrl = isServer
      ? (process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000')
      : '';

    const plantaRepo = new HttpPlantaRepository(apiUrl);
    const projetoRepo = new HttpProjetoRepository(apiUrl);
    const contatoRepo = new HttpContatoRepository(apiUrl);
    const pedidoRepo = new HttpPedidoRepository(apiUrl);
    const adminRepo = new HttpAdminRepository(apiUrl);

    const obterPlantaDetalhadaUseCase = new ObterPlantaDetalhadaUseCase(plantaRepo);
    const submeterContatoUseCase = new SubmeterContatoUseCase(contatoRepo);
    const loginAdminUseCase = new LoginAdminUseCase(adminRepo);
    const marcarMensagemLidaUseCase = new MarcarMensagemLidaUseCase(contatoRepo);
    const listarMensagensUseCase = new ListarMensagensUseCase(contatoRepo);
    const criarPedidoUseCase = new CriarPedidoUseCase(pedidoRepo);
    const listarPedidosUseCase = new ListarPedidosUseCase(pedidoRepo);
    const listarProjetosUseCase = new ListarProjetosUseCase(projetoRepo);
    const deletarProjetoUseCase = new DeletarProjetoUseCase(projetoRepo);
    const deletarPlantaUseCase = new DeletarPlantaUseCase(plantaRepo);

    return {
      obterPlantaDetalhadaUseCase,
      submeterContatoUseCase,
      loginAdminUseCase,
      marcarMensagemLidaUseCase,
      listarMensagensUseCase,
      criarPedidoUseCase,
      listarPedidosUseCase,
      listarProjetosUseCase,
      deletarProjetoUseCase,
      deletarPlantaUseCase
    };
  }, []);

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};

export const useDependencies = (): DependencyContextType => {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error("useDependencies deve ser utilizado dentro de um DependencyProvider");
  }
  return context;
};
