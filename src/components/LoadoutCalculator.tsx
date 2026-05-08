"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ITEMS, ITEMS_BY_SLUG, CATEGORY_META } from "@/data/items";
import type { Item } from "@/data/types";

/**
 * Calculadora de Loadout — escolhe itens, calcula peso/slots/cabe.
 * Quantidades por slug em estado local (pode pesquisar/filtrar).
 *
 * Limites de carga DayZ vanilla:
 *  - Stamina full até ~15kg (15000g)
 *  - 15-25kg: -25% sprint regen
 *  - 25kg+: walk forçado em pico
 */

const LOADOUT_KEY = "dayz-codex:loadout:v1";

interface LoadoutEntry {
  slug: string;
  qty: number;
}

const STAMINA_TIERS = [
  { max: 15000, label: "FULL STAMINA", color: "olive-bright" },
  { max: 25000, label: "REDUZIDA -25%", color: "brass" },
  { max: 40000, label: "PESADA -50%", color: "rust" },
  { max: Infinity, label: "INVIÁVEL — WALK", color: "blood-bright" },
];

function loadFromStorage(): LoadoutEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOADOUT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e) =>
          e &&
          typeof e.slug === "string" &&
          /^[a-z0-9-]{1,60}$/.test(e.slug) &&
          typeof e.qty === "number" &&
          e.qty > 0 &&
          e.qty < 1000,
      )
      .slice(0, 100);
  } catch {
    return [];
  }
}

function saveToStorage(entries: LoadoutEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOADOUT_KEY, JSON.stringify(entries));
  } catch {}
}

export function LoadoutCalculator() {
  const [entries, setEntries] = useState<LoadoutEntry[]>(() => loadFromStorage());
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  function add(slug: string) {
    const next = (() => {
      const existing = entries.find((e) => e.slug === slug);
      if (existing) {
        return entries.map((e) => (e.slug === slug ? { ...e, qty: e.qty + 1 } : e));
      }
      return [...entries, { slug, qty: 1 }];
    })();
    setEntries(next);
    saveToStorage(next);
  }

  function setQty(slug: string, qty: number) {
    const cleaned = Math.max(0, Math.min(999, Math.round(qty)));
    const next = cleaned === 0
      ? entries.filter((e) => e.slug !== slug)
      : entries.map((e) => (e.slug === slug ? { ...e, qty: cleaned } : e));
    setEntries(next);
    saveToStorage(next);
  }

  function remove(slug: string) {
    const next = entries.filter((e) => e.slug !== slug);
    setEntries(next);
    saveToStorage(next);
  }

  function clear() {
    setEntries([]);
    saveToStorage([]);
  }

  const totalWeight = useMemo(() => {
    return entries.reduce((acc, e) => {
      const it = ITEMS_BY_SLUG[e.slug];
      return acc + (it?.stats?.weightG ?? 0) * e.qty;
    }, 0);
  }, [entries]);

  const totalSlots = useMemo(() => {
    return entries.reduce((acc, e) => {
      const it = ITEMS_BY_SLUG[e.slug];
      const slots = it?.stats?.slots;
      if (!slots) return acc;
      return acc + slots.w * slots.h * e.qty;
    }, 0);
  }, [entries]);

  const tier = STAMINA_TIERS.find((t) => totalWeight <= t.max)!;

  // Filtro de catálogo (top right "add" panel)
  const catalogFiltered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ITEMS.filter((it) => {
      if (activeCat !== "all" && it.category !== activeCat) return false;
      if (!term) return true;
      const hay = `${it.name} ${it.summary} ${it.tags?.join(" ") ?? ""}`.toLowerCase();
      return hay.includes(term);
    }).slice(0, 30);
  }, [search, activeCat]);

  const items: Item[] = entries
    .map((e) => ITEMS_BY_SLUG[e.slug])
    .filter(Boolean) as Item[];

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-4">
      {/* Esquerda: loadout atual */}
      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Seu Loadout</span>
          <button onClick={clear} className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline">
            LIMPAR
          </button>
        </div>
        <div className="panel-body space-y-4">
          {/* Resumo HUD */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3">
              <div className="text-xs font-mono text-[var(--c-ash)] tracking-wider mb-1">
                <i className="fi-rr-dumbbell-weightlifting mr-1" /> PESO
              </div>
              <div className="font-stencil text-xl text-[var(--c-bone)]">
                {(totalWeight / 1000).toFixed(2)} kg
              </div>
            </div>
            <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3">
              <div className="text-xs font-mono text-[var(--c-ash)] tracking-wider mb-1">
                <i className="fi-rr-grid mr-1" /> SLOTS
              </div>
              <div className="font-stencil text-xl text-[var(--c-bone)]">{totalSlots}</div>
            </div>
            <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3">
              <div className="text-xs font-mono text-[var(--c-ash)] tracking-wider mb-1">
                <i className="fi-rr-bolt mr-1" /> STAMINA
              </div>
              <div
                className="font-stencil text-base"
                style={{ color: `var(--c-${tier.color})` }}
              >
                {tier.label}
              </div>
            </div>
          </div>

          {/* Barra visual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--c-ash)]">
              <span>0 kg</span>
              <span>15</span>
              <span>25</span>
              <span>40+</span>
            </div>
            <div className="relative h-3 bg-[var(--c-bg)] border border-[var(--c-border)]">
              <div
                className="h-full transition-all"
                style={{
                  width: `${Math.min(100, (totalWeight / 40000) * 100)}%`,
                  background: `var(--c-${tier.color})`,
                }}
              />
              <div className="absolute top-0 bottom-0 border-l border-[var(--c-olive)]/40" style={{ left: "37.5%" }} />
              <div className="absolute top-0 bottom-0 border-l border-[var(--c-brass)]/40" style={{ left: "62.5%" }} />
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-[var(--c-bone-dim)] italic text-center py-8">
              Adicione itens do catálogo →
            </p>
          ) : (
            <table className="field-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Peso</th>
                  <th>Slots</th>
                  <th>Qtd</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const e = entries.find((x) => x.slug === it.slug)!;
                  const w = (it.stats?.weightG ?? 0) * e.qty;
                  const s = (it.stats?.slots ? it.stats.slots.w * it.stats.slots.h : 0) * e.qty;
                  return (
                    <tr key={it.slug}>
                      <td>
                        <Link
                          href={`/itens/${it.slug}`}
                          className="text-[var(--c-bone)] hover:text-[var(--c-olive-bright)]"
                        >
                          <i className={`fi-rr-${it.icon} mr-1.5`} />
                          {it.name}
                        </Link>
                      </td>
                      <td className="font-mono">{(w / 1000).toFixed(2)} kg</td>
                      <td className="font-mono">{s || "—"}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={999}
                          value={e.qty}
                          onChange={(ev) => setQty(it.slug, parseInt(ev.target.value, 10))}
                          className="w-14 bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-bone)] px-2 py-1 font-mono text-sm"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => remove(it.slug)}
                          className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Direita: catálogo de adição */}
      <aside className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Adicionar Item</span>
        </div>
        <div className="panel-body space-y-3">
          <div className="relative">
            <i className="fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="BUSCAR ITEM..."
              className="input"
            />
          </div>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            <button
              onClick={() => setActiveCat("all")}
              className={`badge cursor-pointer ${activeCat === "all" ? "badge--olive" : ""}`}
            >
              TODAS
            </button>
            {CATEGORY_META.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCat(c.key)}
                className={`badge cursor-pointer ${activeCat === c.key ? "badge--olive" : ""}`}
              >
                {c.label.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="space-y-1 max-h-[55vh] overflow-y-auto">
            {catalogFiltered.map((it) => (
              <button
                key={it.slug}
                onClick={() => add(it.slug)}
                className="w-full flex items-center gap-2 p-2 border border-transparent hover:border-[var(--c-border)] hover:bg-[var(--c-surface-3)] text-left"
              >
                <i className={`fi-rr-${it.icon} text-[var(--c-olive-bright)] shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[var(--c-bone)] truncate">{it.name}</div>
                  <div className="text-xs text-[var(--c-ash)] font-mono">
                    {it.stats?.weightG !== undefined ? `${(it.stats.weightG / 1000).toFixed(2)}kg` : "—"}
                    {it.stats?.slots && ` · ${it.stats.slots.w}×${it.stats.slots.h}`}
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--c-olive-bright)] opacity-0 group-hover:opacity-100">+</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
