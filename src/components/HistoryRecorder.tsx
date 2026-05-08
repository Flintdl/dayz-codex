"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/history";

/**
 * Componente invisível — registra visita ao montar. Use nas páginas
 * de detalhe de item.
 */
export function HistoryRecorder({ slug }: { slug: string }) {
  useEffect(() => {
    recordVisit(slug);
  }, [slug]);
  return null;
}
