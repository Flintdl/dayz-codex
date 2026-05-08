"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ITEMS, ITEMS_BY_SLUG } from "@/data/items";
import type { Item } from "@/data/types";

/**
 * Comparador de armas — selecione 2-4 armas e veja stats lado a lado.
 */

const MAX_COMPARE = 4;

export function WeaponCompare() {
  const allWeapons = useMemo(
    () => ITEMS.filter((it) => it.category === "weapon"),
    [],
  );
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "m4-a1",
    "akm",
    "mosin-9130",
  ]);
  const [search, setSearch] = useState("");

  const selected: Item[] = selectedSlugs
    .map((s) => ITEMS_BY_SLUG[s])
    .filter(Boolean) as Item[];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allWeapons
      .filter((w) => !selectedSlugs.includes(w.slug))
      .filter((w) => {
        if (!term) return true;
        return `${w.name} ${w.subcategory ?? ""}`.toLowerCase().includes(term);
      })
      .slice(0, 20);
  }, [allWeapons, selectedSlugs, search]);

  function add(slug: string) {
    if (selectedSlugs.includes(slug)) return;
    if (selectedSlugs.length >= MAX_COMPARE) return;
    setSelectedSlugs([...selectedSlugs, slug]);
  }

  function remove(slug: string) {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  }

  /**
   * Identifica o "vencedor" por métrica numérica. Em caso de empate,
   * todos vencem (highlight todos).
   */
  function winnerSlugs(metric: (it: Item) => number | null, higherBetter = true): Set<string> {
    const values: Array<{ slug: string; v: number }> = [];
    for (const it of selected) {
      const v = metric(it);
      if (v !== null) values.push({ slug: it.slug, v });
    }
    if (values.length === 0) return new Set();
    const best = values.reduce(
      (acc, x) => (higherBetter ? Math.max(acc, x.v) : Math.min(acc, x.v)),
      higherBetter ? -Infinity : Infinity,
    );
    return new Set(values.filter((x) => x.v === best).map((x) => x.slug));
  }

  const winDamage = winnerSlugs((it) => it.stats?.damage ?? null, true);
  const winRange = winnerSlugs((it) => it.stats?.rangeM ?? null, true);
  const winRpm = winnerSlugs((it) => it.stats?.rpm ?? null, true);
  const winCap = winnerSlugs((it) => it.stats?.magCapacity ?? null, true);
  const winWeight = winnerSlugs((it) => it.stats?.weightG ?? null, false); // menor é melhor

  return (
    <div className="space-y-4">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Selecionar Armas (max {MAX_COMPARE})</span>
          <span className="panel-header__meta">{selected.length}/{MAX_COMPARE}</span>
        </div>
        <div className="panel-body space-y-3">
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {selected.map((w) => (
              <button
                key={w.slug}
                onClick={() => remove(w.slug)}
                className="badge badge--olive cursor-pointer hover:bg-[var(--c-olive)]/30"
              >
                <i className={`fi-rr-${w.icon} mr-1`} /> {w.name.toUpperCase()} ✕
              </button>
            ))}
            {selected.length === 0 && (
              <span className="text-sm text-[var(--c-bone-dim)] italic">
                Adicione armas abaixo
              </span>
            )}
          </div>
          {selected.length < MAX_COMPARE && (
            <>
              <div className="relative">
                <i className="fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="BUSCAR ARMA..."
                  className="input"
                />
              </div>
              <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                {filtered.map((w) => (
                  <button
                    key={w.slug}
                    onClick={() => add(w.slug)}
                    className="badge cursor-pointer hover:bg-[var(--c-surface-3)]"
                  >
                    + {w.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selected.length >= 2 && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Stats Comparados</span>
          </div>
          <div className="panel-body overflow-x-auto">
            <table className="field-table min-w-full">
              <thead>
                <tr>
                  <th>Spec</th>
                  {selected.map((w) => (
                    <th key={w.slug}>
                      <Link
                        href={`/itens/${w.slug}`}
                        className="text-[var(--c-bone)] hover:text-[var(--c-olive-bright)]"
                      >
                        {w.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row label="Subcategoria" cells={selected.map((w) => w.subcategory ?? "—")} />
                <Row
                  label="Calibre"
                  cells={selected.map((w) => (w.stats?.caliber ?? []).join(", ") || "—")}
                />
                <Row
                  label="Capacidade"
                  cells={selected.map((w) => w.stats?.magCapacity?.toString() ?? "—")}
                  highlight={selected.map((w) => winCap.has(w.slug))}
                />
                <Row
                  label="Dano"
                  cells={selected.map((w) =>
                    w.stats?.damage !== undefined ? `${w.stats.damage} pts` : "—",
                  )}
                  highlight={selected.map((w) => winDamage.has(w.slug))}
                />
                <Row
                  label="Alcance"
                  cells={selected.map((w) =>
                    w.stats?.rangeM !== undefined ? `${w.stats.rangeM} m` : "—",
                  )}
                  highlight={selected.map((w) => winRange.has(w.slug))}
                />
                <Row
                  label="Cadência"
                  cells={selected.map((w) =>
                    w.stats?.rpm !== undefined ? `${w.stats.rpm} RPM` : "—",
                  )}
                  highlight={selected.map((w) => winRpm.has(w.slug))}
                />
                <Row
                  label="Peso"
                  cells={selected.map((w) =>
                    w.stats?.weightG !== undefined
                      ? `${(w.stats.weightG / 1000).toFixed(2)} kg`
                      : "—",
                  )}
                  highlight={selected.map((w) => winWeight.has(w.slug))}
                  highlightLabel="MENOR = MELHOR"
                />
                <Row
                  label="Slots"
                  cells={selected.map((w) =>
                    w.stats?.slots ? `${w.stats.slots.w}×${w.stats.slots.h}` : "—",
                  )}
                />
                <Row
                  label="Raridade"
                  cells={selected.map((w) => w.rarity.toUpperCase().replace(/_/g, " "))}
                />
                <Row label="Loot Tier" cells={selected.map((w) => w.loot.join(", ") || "—")} />
              </tbody>
            </table>
            <p className="text-xs font-mono text-[var(--c-ash)] mt-3">
              <span className="inline-block w-3 h-3 bg-[var(--c-olive-bright)] mr-1 align-middle" />
              Verde = melhor da categoria. Empates: ambos verdes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  cells,
  highlight,
  highlightLabel,
}: {
  label: string;
  cells: string[];
  highlight?: boolean[];
  highlightLabel?: string;
}) {
  return (
    <tr>
      <td className="font-mono text-xs text-[var(--c-ash)] tracking-wider">
        {label.toUpperCase()}
        {highlightLabel && (
          <span className="block text-[0.6rem] opacity-60">{highlightLabel}</span>
        )}
      </td>
      {cells.map((c, i) => (
        <td
          key={i}
          style={
            highlight?.[i]
              ? { color: "var(--c-olive-bright)", fontWeight: 700 }
              : undefined
          }
        >
          {c}
        </td>
      ))}
    </tr>
  );
}
