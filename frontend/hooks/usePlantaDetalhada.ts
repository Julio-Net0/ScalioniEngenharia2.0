'use client';

import { useEffect, useState } from "react";
import { useDependencies } from "../core/infra/di/DependencyContext";
import { Planta } from "../core/domain/entities/Planta";

export function usePlantaDetalhada(slug: string) {
  const { obterPlantaDetalhadaUseCase } = useDependencies();
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    obterPlantaDetalhadaUseCase.execute(slug)
      .then((data) => {
        if (isMounted) {
          setPlanta(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar planta");
          setPlanta(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, obterPlantaDetalhadaUseCase]);

  return { planta, loading, error };
}
