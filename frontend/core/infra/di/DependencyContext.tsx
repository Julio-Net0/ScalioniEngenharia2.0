'use client';

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { HttpPlantaRepository } from "../http/HttpPlantaRepository";
import { ObterPlantaDetalhadaUseCase } from "../../application/use-cases/ObterPlantaDetalhadaUseCase";

interface DependencyContextType {
  obterPlantaDetalhadaUseCase: ObterPlantaDetalhadaUseCase;
}

const DependencyContext = createContext<DependencyContextType | null>(null);

export const DependencyProvider = ({ children }: { children: ReactNode }) => {
  const dependencies = useMemo(() => {
    const isServer = typeof window === 'undefined';
    const apiUrl = isServer
      ? (process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000')
      : '';

    const repo = new HttpPlantaRepository(apiUrl);
    const obterPlantaDetalhadaUseCase = new ObterPlantaDetalhadaUseCase(repo);

    return { obterPlantaDetalhadaUseCase };
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
