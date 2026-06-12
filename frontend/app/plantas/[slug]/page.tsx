'use client';

import React, { use } from "react";
import { PlantaDetalheView } from "../../../components/PlantaDetalheView";

interface PlantaPageProps {
  params: Promise<{ slug: string }>;
}

export default function PlantaPage({ params }: PlantaPageProps) {
  const { slug } = use(params);

  return (
    <PlantaDetalheView slug={slug} />
  );
}
