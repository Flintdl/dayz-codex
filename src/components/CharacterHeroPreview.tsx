"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ITEMS_BY_SLUG } from "@/data/items";
import {
  EQUIPMENT_SLOTS,
  SLOT_META,
  readStore,
  type Character,
} from "@/lib/character";

/**
 * Preview compacto do personagem na home. Hidrata do localStorage
 * client-side. Se vazio → CTA "Criar Personagem".
 */

const KEY_SLOTS: Array<keyof Character["equipment"]> = [
  "head",
  "vest",
  "backpack",
  "primary",
  "secondary",
  "melee",
];

export function CharacterHeroPreview() {
  const [c, setC] = useState<Character | null>(null);

  useEffect(() => {
    const store = readStore();
    setC(store.current);
  }, []);

  const stats = useMemo(() => {
    if (!c) return null;
    let weight = 0;
    let equippedCount = 0;
    for (const slot of EQUIPMENT_SLOTS) {
      const e = c.equipment[slot];
      if (!e) continue;
      equippedCount++;
      const it = ITEMS_BY_SLUG[e.slug];
      if (it?.stats?.weightG) weight += it.stats.weightG;
    }
    for (const inv of c.inventory) {
      const it = ITEMS_BY_SLUG[inv.slug];
      if (it?.stats?.weightG) weight += it.stats.weightG * inv.qty;
    }
    return { weight, equippedCount, inventoryCount: c.inventory.length };
  }, [c]);

  // SSR / pré-hidratação
  if (!c) {
    return <SkeletonCard />;
  }

  // Personagem zerado (recém-criado / sem nada equipado)
  const isEmpty =
    stats!.equippedCount === 0 && stats!.inventoryCount === 0 && !c.server;
  if (isEmpty) {
    return <EmptyCTA />;
  }

  const staminaTier =
    stats!.weight <= 15000
      ? { label: "FULL", color: "var(--c-olive-bright)", pct: stats!.weight / 40000 }
      : stats!.weight <= 25000
      ? { label: "-25%", color: "var(--c-brass)", pct: stats!.weight / 40000 }
      : stats!.weight <= 40000
      ? { label: "-50%", color: "var(--c-rust)", pct: stats!.weight / 40000 }
      : { label: "WALK", color: "var(--c-blood-bright)", pct: 1 };

  const mapLabel = {
    chernarus: "Chernarus +",
    livonia: "Livonia",
    sakhal: "Sakhal",
    other: "Mod",
  }[c.map];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-header__title flex items-center gap-2">
          <i className="fi-rr-shield-check text-[var(--c-olive-bright)]" />
          {c.name || "Survivor"}
        </span>
        <Link
          href="/personagem"
          className="text-xs font-mono text-[var(--c-olive-bright)] hover:underline tracking-wider"
        >
          EDITAR ▶
        </Link>
      </div>
      <div className="panel-body space-y-3">
        {/* Server / map */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--c-bone)] truncate flex-1">
            {c.server || (
              <span className="text-[var(--c-ash)] italic">sem server</span>
            )}
          </span>
          <span className="badge badge--olive ml-2 shrink-0">{mapLabel}</span>
        </div>

        {/* Equipment grid (key slots only) */}
        <div className="grid grid-cols-3 gap-1.5">
          {KEY_SLOTS.map((slot) => {
            const e = c.equipment[slot];
            const it = e ? ITEMS_BY_SLUG[e.slug] : null;
            const meta = SLOT_META[slot];
            return (
              <div
                key={slot}
                className="border border-[var(--c-border)] bg-[var(--c-bg)] p-2 min-h-[64px] flex flex-col justify-between"
                title={meta.label}
              >
                <div className="text-[0.55rem] font-mono text-[var(--c-ash)] tracking-widest">
                  {meta.label.toUpperCase()}
                </div>
                {it ? (
                  <div className="flex items-center gap-1 mt-1">
                    <i className={`fi-rr-${it.icon} text-[var(--c-olive-bright)] text-sm shrink-0`} />
                    <span className="text-[0.7rem] text-[var(--c-bone)] truncate">
                      {it.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-[0.7rem] text-[var(--c-ash-dim)] italic mt-1">
                    vazio
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats compactos */}
        <div className="space-y-1.5 pt-2 border-t border-[var(--c-border)]">
          <Row
            label="Peso"
            value={`${(stats!.weight / 1000).toFixed(1)} kg`}
            sub={`${stats!.equippedCount} eq · ${stats!.inventoryCount} inv`}
          />
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--c-ash)] tracking-widest">STAMINA</span>
            <span style={{ color: staminaTier.color }}>{staminaTier.label}</span>
          </div>
          <div className="relative h-1.5 bg-[var(--c-bg)] border border-[var(--c-border)]">
            <div
              className="h-full"
              style={{
                width: `${Math.min(100, staminaTier.pct * 100)}%`,
                background: staminaTier.color,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between text-xs font-mono">
      <span className="text-[var(--c-ash)] tracking-widest">{label.toUpperCase()}</span>
      <span className="text-right">
        <span className="text-[var(--c-bone)] font-stencil text-sm tracking-wide">{value}</span>
        {sub && (
          <span className="block text-[0.6rem] text-[var(--c-ash)] mt-0.5">{sub}</span>
        )}
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-header__title">Personagem</span>
      </div>
      <div className="panel-body space-y-3">
        <div className="h-4 bg-[var(--c-surface-3)] skel" />
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[64px] skel" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyCTA() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-header__title flex items-center gap-2">
          <i className="fi-rr-shield-check text-[var(--c-olive-bright)]" />
          Personagem
        </span>
      </div>
      <div className="panel-body space-y-3 text-center py-6">
        <p className="text-sm text-[var(--c-bone-dim)] leading-relaxed">
          Monte sua ficha tática — equipment slots, inventário, snapshots
          datados. Salvo no seu browser.
        </p>
        <Link href="/personagem" className="btn h-10 inline-flex">
          <i className="fi-rr-shield-check" />
          CRIAR PERSONAGEM
        </Link>
      </div>
    </div>
  );
}
