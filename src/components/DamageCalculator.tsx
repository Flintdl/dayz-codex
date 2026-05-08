"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ITEMS, ITEMS_BY_SLUG } from "@/data/items";

/**
 * Calculadora de Dano — quantos tiros pra matar (TTK) com vest/capacete.
 *
 * Modelo simplificado baseado em mechanics damage zones do Codex:
 *  - HP base: 100 pts
 *  - Sangue base: 5000 pts
 *  - Headshot: ×3 dano. Se tem capacete: ×1.5
 *  - Body sem vest: ×1
 *  - Body com Press Vest: ×0.7 (pistol-only protection)
 *  - Body com Plate Carrier: ×0.4 (5.56/7.62 reduction)
 *  - Pernas: ×0.7
 *  - Braços: ×0.7
 *
 * Mata quando dano cumulativo > 100 (HP). Sangue cai paralelo.
 */

type Zone = "head" | "torso" | "leg" | "arm";
type Armor = "none" | "press-vest" | "plate-carrier" | "ballistic-helmet" | "plate+helmet";

const ZONE_MULT: Record<Zone, number> = {
  head: 3.0,
  torso: 1.0,
  leg: 0.7,
  arm: 0.7,
};

function armorMult(zone: Zone, armor: Armor): number {
  if (zone === "head") {
    if (armor === "ballistic-helmet" || armor === "plate+helmet") return 0.5;
    return 1.0;
  }
  if (zone === "torso") {
    if (armor === "press-vest") return 0.7;
    if (armor === "plate-carrier") return 0.4;
    if (armor === "plate+helmet") return 0.4;
    return 1.0;
  }
  return 1.0;
}

const ARMORS: { value: Armor; label: string }[] = [
  { value: "none", label: "Sem Armadura" },
  { value: "press-vest", label: "Press Vest" },
  { value: "plate-carrier", label: "Plate Carrier" },
  { value: "ballistic-helmet", label: "Capacete Balístico" },
  { value: "plate+helmet", label: "Plate + Capacete" },
];

const ZONES: { value: Zone; label: string; icon: string }[] = [
  { value: "head", label: "Cabeça", icon: "skull" },
  { value: "torso", label: "Torso", icon: "shield" },
  { value: "leg", label: "Perna", icon: "boot" },
  { value: "arm", label: "Braço", icon: "shield" },
];

export function DamageCalculator() {
  const weapons = useMemo(
    () => ITEMS.filter((it) => it.category === "weapon" && it.stats?.damage !== undefined),
    [],
  );

  const [weaponSlug, setWeaponSlug] = useState("m4-a1");
  const [zone, setZone] = useState<Zone>("torso");
  const [armor, setArmor] = useState<Armor>("none");

  const weapon = ITEMS_BY_SLUG[weaponSlug];
  const baseDmg = weapon?.stats?.damage ?? 0;
  const effectiveDmg = baseDmg * ZONE_MULT[zone] * armorMult(zone, armor);
  const ttk = effectiveDmg > 0 ? Math.ceil(100 / effectiveDmg) : Infinity;

  // Ranking de armas por TTK no setup atual
  const ranking = useMemo(() => {
    return weapons
      .map((w) => {
        const dmg = (w.stats?.damage ?? 0) * ZONE_MULT[zone] * armorMult(zone, armor);
        return {
          slug: w.slug,
          name: w.name,
          icon: w.icon,
          dmg,
          ttk: dmg > 0 ? Math.ceil(100 / dmg) : Infinity,
        };
      })
      .sort((a, b) => a.ttk - b.ttk)
      .slice(0, 12);
  }, [weapons, zone, armor]);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Cenário</span>
        </div>
        <div className="panel-body space-y-4">
          <div>
            <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-2">
              ARMA
            </div>
            <select
              value={weaponSlug}
              onChange={(e) => setWeaponSlug(e.target.value)}
              className="input"
            >
              {weapons.map((w) => (
                <option key={w.slug} value={w.slug}>
                  {w.name} ({w.stats?.damage} pts base)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-2">
              ZONA DE IMPACTO
            </div>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((z) => (
                <button
                  key={z.value}
                  onClick={() => setZone(z.value)}
                  className={`badge cursor-pointer ${zone === z.value ? "badge--olive" : ""}`}
                >
                  <i className={`fi-rr-${z.icon} mr-1`} /> {z.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-2">
              ARMADURA DO ALVO
            </div>
            <div className="flex flex-wrap gap-2">
              {ARMORS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setArmor(a.value)}
                  className={`badge cursor-pointer ${armor === a.value ? "badge--olive" : ""}`}
                >
                  {a.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Resultado */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--c-border)]">
            <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3">
              <div className="text-xs font-mono text-[var(--c-ash)] tracking-wider mb-1">
                DANO BASE
              </div>
              <div className="font-stencil text-xl text-[var(--c-bone)]">{baseDmg}</div>
            </div>
            <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3">
              <div className="text-xs font-mono text-[var(--c-ash)] tracking-wider mb-1">
                EFETIVO
              </div>
              <div className="font-stencil text-xl text-[var(--c-bone)]">
                {effectiveDmg.toFixed(1)}
              </div>
              <div className="text-[0.65rem] font-mono text-[var(--c-ash)] mt-1">
                ×{ZONE_MULT[zone]} zona × {armorMult(zone, armor)} armor
              </div>
            </div>
            <div className="border border-[var(--c-blood)] bg-[var(--c-bg)] p-3">
              <div className="text-xs font-mono text-[var(--c-blood-bright)] tracking-wider mb-1">
                TIROS PRA MATAR
              </div>
              <div className="font-stencil text-3xl text-[var(--c-blood-bright)]">
                {Number.isFinite(ttk) ? ttk : "∞"}
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--c-bone-dim)] italic leading-relaxed">
            Modelo simplificado — DayZ tem RNG + falloff de distância. Use como
            referência relativa, não regra absoluta. Para Plate Carrier, placa
            cerâmica degrada após 3-5 tiros e perde efeito.
          </p>
        </div>
      </div>

      <aside className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Ranking p/ Setup</span>
          <span className="panel-header__meta">TTK CRESCENTE</span>
        </div>
        <div className="panel-body space-y-1 max-h-[60vh] overflow-y-auto">
          {ranking.map((r, i) => (
            <Link
              key={r.slug}
              href={`/itens/${r.slug}`}
              className={`flex items-center gap-2 p-2 border ${
                r.slug === weaponSlug
                  ? "border-[var(--c-olive-bright)] bg-[var(--c-olive)]/10"
                  : "border-transparent hover:border-[var(--c-border)] hover:bg-[var(--c-surface-3)]"
              }`}
            >
              <span className="font-stencil text-base text-[var(--c-bone-dim)] w-6 text-center">
                {i + 1}
              </span>
              <i className={`fi-rr-${r.icon} text-[var(--c-olive-bright)]`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--c-bone)] truncate">{r.name}</div>
              </div>
              <span className="font-mono text-xs text-[var(--c-blood-bright)]">
                {Number.isFinite(r.ttk) ? `${r.ttk}×` : "∞"}
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
