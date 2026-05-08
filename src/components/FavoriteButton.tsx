"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

/**
 * Botão de favoritar/desfavoritar item. Sincroniza com localStorage.
 * Hidrata sem flash usando state inicial false.
 */
export function FavoriteButton({ slug }: { slug: string }) {
  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(isFavorite(slug));
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => {
        toggleFavorite(slug);
        setFav((f) => !f);
      }}
      className="btn btn--ghost h-9 px-3 text-xs"
      aria-pressed={fav}
      aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <i className={`fi-rr-${fav ? "shield-check" : "shield"}`} />
      {fav ? "FAVORITADO" : "FAVORITAR"}
    </button>
  );
}
