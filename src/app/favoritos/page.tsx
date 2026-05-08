"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ITEMS_BY_SLUG } from "@/data/items";
import { readFavorites, writeFavorites } from "@/lib/favorites";
import { readHistory, clearHistory, type HistoryEntry } from "@/lib/history";
import { ItemImage } from "@/components/ItemImage";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
    setHistory(readHistory());
  }, []);

  function unfavorite(slug: string) {
    const next = favorites.filter((s) => s !== slug);
    setFavorites(next);
    writeFavorites(next);
  }

  function clearAll() {
    if (confirm("Apagar todos os favoritos?")) {
      setFavorites([]);
      writeFavorites([]);
    }
  }

  function clearHistoryConfirm() {
    if (confirm("Apagar histórico de visitas?")) {
      clearHistory();
      setHistory([]);
    }
  }

  const favItems = favorites
    .map((s) => ITEMS_BY_SLUG[s])
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">PESSOAL</span>
        <h1>Seus Itens</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Favoritos e histórico de visitas — tudo salvo no seu browser, sem
          servidor, sem login. Abra do mesmo browser pra recuperar.
        </p>
      </header>

      <section>
        <header className="flex items-end justify-between mb-3">
          <h2>★ Favoritos · {favItems.length}</h2>
          {favItems.length > 0 && (
            <button onClick={clearAll} className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline">
              LIMPAR TODOS
            </button>
          )}
        </header>
        {favItems.length === 0 ? (
          <p className="text-sm text-[var(--c-bone-dim)] italic">
            Nenhum favorito ainda. Marque itens com ★ na página de detalhe.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {favItems.map((it) => (
              <article key={it.slug} className="item-card relative">
                <button
                  onClick={() => unfavorite(it.slug)}
                  className="absolute top-2 right-2 z-10 text-xs font-mono text-[var(--c-blood-bright)] hover:bg-[var(--c-blood)]/30 px-1.5 py-0.5 border border-[var(--c-blood)]"
                  aria-label="Remover dos favoritos"
                >
                  ✕
                </button>
                <Link href={`/itens/${it.slug}`} className="contents">
                  <div className="flex items-center justify-center pt-2">
                    <ItemImage
                      slug={it.slug}
                      icon={it.icon}
                      alt={it.name}
                      size="md"
                    />
                  </div>
                  <div>
                    <h3 className="text-[var(--c-bone)] font-stencil text-base tracking-wide leading-tight mb-1">
                      {it.name}
                    </h3>
                    <p className="text-xs text-[var(--c-bone-dim)] leading-snug line-clamp-2">
                      {it.summary}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <header className="flex items-end justify-between mb-3">
          <h2>↻ Histórico · {history.length}</h2>
          {history.length > 0 && (
            <button onClick={clearHistoryConfirm} className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline">
              LIMPAR
            </button>
          )}
        </header>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--c-bone-dim)] italic">
            Sem histórico. Visite páginas de itens pra preencher aqui.
          </p>
        ) : (
          <div className="space-y-1">
            {history.map((h) => {
              const it = ITEMS_BY_SLUG[h.slug];
              if (!it) return null;
              const ago = ((Date.now() - h.visitedAt) / 1000 / 60) | 0;
              const agoLabel = ago < 1 ? "agora" : ago < 60 ? `${ago}min atrás` : `${(ago / 60) | 0}h atrás`;
              return (
                <Link
                  key={h.slug + h.visitedAt}
                  href={`/itens/${h.slug}`}
                  className="flex items-center gap-3 p-2 border border-transparent hover:border-[var(--c-border)] hover:bg-[var(--c-surface-3)]"
                >
                  <i className={`fi-rr-${it.icon} text-[var(--c-olive-bright)]`} />
                  <span className="flex-1 text-sm text-[var(--c-bone)]">{it.name}</span>
                  <span className="text-xs font-mono text-[var(--c-ash)]">{agoLabel}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
