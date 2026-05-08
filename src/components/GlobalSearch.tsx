"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ITEMS } from "@/data/items";
import { RECIPES } from "@/data/recipes";
import { SURVIVAL_STATS, DISEASES } from "@/data/survival";
import { MAPS, MAP_ZONES } from "@/data/maps";
import { BUILDING_PIECES } from "@/data/baseBuilding";

type Hit = {
  kind: "item" | "recipe" | "stat" | "disease" | "map" | "zone" | "build";
  href: string;
  label: string;
  sub: string;
  icon: string;
};

const KIND_LABEL: Record<Hit["kind"], string> = {
  item: "ITEM",
  recipe: "RECEITA",
  stat: "STATUS",
  disease: "DOENÇA",
  map: "MAPA",
  zone: "ZONA",
  build: "CONSTRUÇÃO",
};

function buildIndex(): Hit[] {
  const idx: Hit[] = [];
  for (const it of ITEMS) {
    idx.push({
      kind: "item",
      href: `/itens/${it.slug}`,
      label: it.name,
      sub: it.summary,
      icon: it.icon,
    });
  }
  for (const r of RECIPES) {
    idx.push({
      kind: "recipe",
      href: `/crafting#${r.slug}`,
      label: `→ ${r.output.itemSlug.replace(/-/g, " ")}`,
      sub: r.method,
      icon: "tools",
    });
  }
  for (const s of SURVIVAL_STATS) {
    idx.push({
      kind: "stat",
      href: `/sobrevivencia#${s.slug}`,
      label: s.name,
      sub: `${s.range.min}–${s.range.max} ${s.range.unit}`,
      icon: s.icon,
    });
  }
  for (const d of DISEASES) {
    idx.push({
      kind: "disease",
      href: `/sobrevivencia#${d.slug}`,
      label: d.name,
      sub: d.symptoms.slice(0, 2).join(" · "),
      icon: d.icon,
    });
  }
  for (const m of MAPS) {
    idx.push({
      kind: "map",
      href: `/mapas#${m.slug}`,
      label: m.name,
      sub: m.area,
      icon: "map",
    });
  }
  for (const z of MAP_ZONES) {
    idx.push({
      kind: "zone",
      href: `/mapas#${z.slug}`,
      label: z.name,
      sub: `${z.region} — risco ${z.risk}/5`,
      icon: "map-marker",
    });
  }
  for (const b of BUILDING_PIECES) {
    idx.push({
      kind: "build",
      href: `/base-building#${b.slug}`,
      label: b.name,
      sub: `${b.tier.toUpperCase()} · ${b.hp.toLocaleString()} HP`,
      icon: b.icon,
    });
  }
  return idx;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildIndex, []);

  // Atalho global "/" abre busca
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 10);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const scored = index
      .map((h) => {
        const hay = `${h.label} ${h.sub}`.toLowerCase();
        const exact = hay.includes(term);
        // boost label match
        const labelHit = h.label.toLowerCase().includes(term) ? 2 : 0;
        const score = exact ? 1 + labelHit : 0;
        return { h, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 25)
      .map((x) => x.h);
    return scored;
  }, [q, index]);

  return (
    <>
      <button
        className="btn btn--ghost h-10 px-3 sm:px-4"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 10);
        }}
        aria-label="Abrir busca global"
      >
        <i className="fi-rr-search" />
        <span className="hidden sm:inline">BUSCAR</span>
        <kbd className="hidden sm:inline-block ml-2 font-mono text-[0.65rem] px-1.5 py-0.5 border border-[var(--c-border)] text-[var(--c-ash)]">
          /
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-b border-[var(--c-border)]">
              <i className="fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="BUSCAR ITEM, RECEITA, ZONA..."
                className="input border-0 h-14 text-base"
                autoFocus
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--c-ash)] hidden sm:block">
                ESC
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {q.trim().length < 2 && (
                <div className="px-4 py-8 text-center text-[var(--c-bone-dim)] text-sm">
                  Digite ao menos 2 caracteres. {index.length} entradas indexadas.
                </div>
              )}
              {q.trim().length >= 2 && hits.length === 0 && (
                <div className="px-4 py-8 text-center text-[var(--c-bone-dim)] text-sm">
                  Nada encontrado para “{q}”.
                </div>
              )}
              {hits.map((h, i) => (
                <Link
                  key={i}
                  href={h.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[var(--c-border)] hover:bg-[var(--c-surface-3)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--c-surface-2)] border border-[var(--c-border)]">
                    <i className={`fi-rr-${h.icon} text-[var(--c-olive-bright)]`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--c-bone)] font-medium truncate">
                      {h.label}
                    </div>
                    <div className="text-xs text-[var(--c-bone-dim)] truncate">
                      {h.sub}
                    </div>
                  </div>
                  <span className="badge badge--olive shrink-0 hidden sm:inline-flex">
                    {KIND_LABEL[h.kind]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
