"use client";

import { useMemo, useState } from "react";
import type { Item, ItemCategory, Rarity } from "@/data/types";
import { ItemCard } from "@/components/ItemCard";

interface Group {
  key: ItemCategory;
  label: string;
  icon: string;
  intro: string;
  items: Item[];
}

const RARITY_OPTIONS: Array<{ value: Rarity | "all"; label: string }> = [
  { value: "all", label: "TODAS" },
  { value: "common", label: "COMUM" },
  { value: "uncommon", label: "INCOMUM" },
  { value: "rare", label: "RARO" },
  { value: "very_rare", label: "MUITO RARO" },
  { value: "legendary", label: "ENDGAME" },
];

export function ItemsBrowser({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<ItemCategory | "all">("all");
  const [rarity, setRarity] = useState<Rarity | "all">("all");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return groups
      .filter((g) => active === "all" || g.key === active)
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => {
          if (rarity !== "all" && it.rarity !== rarity) return false;
          if (term.length === 0) return true;
          const hay = `${it.name} ${it.summary} ${it.subcategory ?? ""} ${
            it.tags?.join(" ") ?? ""
          }`.toLowerCase();
          return hay.includes(term);
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, active, rarity, q]);

  const total = visible.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Filter row */}
      <div className="panel">
        <div className="panel-body space-y-4">
          <div className="relative">
            <i className="fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="BUSCAR ITEM POR NOME, SUMMARY, TAG..."
              className="input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--c-ash)] tracking-widest mr-2">
              CATEGORIA:
            </span>
            <button
              onClick={() => setActive("all")}
              className={`badge cursor-pointer ${
                active === "all" ? "badge--olive" : ""
              }`}
            >
              TODAS · {groups.reduce((a, g) => a + g.items.length, 0)}
            </button>
            {groups.map((g) => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`badge cursor-pointer ${
                  active === g.key ? "badge--olive" : ""
                }`}
              >
                {g.label.toUpperCase()} · {g.items.length}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--c-ash)] tracking-widest mr-2">
              RARIDADE:
            </span>
            {RARITY_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRarity(r.value)}
                className={`badge cursor-pointer ${
                  rarity === r.value ? "badge--olive" : ""
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[var(--c-ash)] flex items-center gap-2 pt-2 border-t border-[var(--c-border)]">
            <i className="fi-rr-info" /> {total} resultado{total !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Groups */}
      {visible.map((g) => (
        <section key={g.key}>
          <header className="flex items-end justify-between mb-3">
            <div>
              <h2 className="flex items-center gap-2">
                <i
                  className={`fi-rr-${g.icon} text-[var(--c-olive-bright)] text-2xl`}
                />
                {g.label}
              </h2>
              <p className="text-sm text-[var(--c-bone-dim)] mt-1">{g.intro}</p>
            </div>
            <span className="badge badge--olive">{g.items.length}</span>
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {g.items.map((it) => (
              <ItemCard key={it.slug} item={it} />
            ))}
          </div>
        </section>
      ))}

      {visible.length === 0 && (
        <div className="panel panel-body text-center py-12 text-[var(--c-bone-dim)]">
          Nada encontrado com esses filtros. Tente “Limpar busca”.
        </div>
      )}
    </div>
  );
}
