"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORY_META, ITEMS, ITEMS_BY_SLUG } from "@/data/items";
import {
  CONDITION_META,
  EQUIPMENT_SLOTS,
  SLOT_META,
  decodeShare,
  encodeShare,
  newSnapshotId,
  readStore,
  writeStore,
  type Character,
  type Condition,
  type EquipmentSlot,
  type EquippedItem,
  type InventoryEntry,
  type Snapshot,
  type Store,
} from "@/lib/character";
import { ItemImage } from "./ItemImage";

const CONDITIONS: Condition[] = ["pristine", "worn", "damaged", "badly_damaged", "ruined"];

interface PickerState {
  slot: EquipmentSlot | "inventory";
}

export function CharacterSheet() {
  // store começa null pra evitar hydration mismatch (Date.now() no initial state
  // diverge entre SSR e client). Hidrata em useEffect → re-render com dados reais.
  const [store, setStore] = useState<Store | null>(null);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Hidrata localStorage + processa hash de share na URL
  useEffect(() => {
    const fromUrl = window.location.hash.match(/^#share=(.+)$/);
    if (fromUrl) {
      const decoded = decodeShare(fromUrl[1]);
      if (decoded) {
        if (
          confirm(
            "Esta URL contém um personagem compartilhado. Importar (substitui o atual)?",
          )
        ) {
          const next: Store = { ...readStore(), current: decoded };
          writeStore(next);
          setStore(next);
          history.replaceState(null, "", window.location.pathname);
          return;
        }
      }
    }
    setStore(readStore());
  }, []);

  // Stats agregados — handles null store (pre-hydration). Hooks DEVEM rodar
  // antes de qualquer early return pra manter ordem consistente.
  const stats = useMemo(() => {
    if (!store) return { weight: 0, slots: 0, ballisticChest: 0, ballisticHead: 0 };
    let weight = 0;
    let slots = 0;
    let ballisticChest = 0;
    let ballisticHead = 0;

    for (const slot of EQUIPMENT_SLOTS) {
      const e = store.current.equipment[slot];
      if (!e) continue;
      const it = ITEMS_BY_SLUG[e.slug];
      if (!it) continue;
      weight += it.stats?.weightG ?? 0;
      if (slot === "vest") {
        if (e.slug === "plate-carrier") ballisticChest = 5;
        else if (e.slug === "press-vest") ballisticChest = 2;
        else if (e.slug === "high-capacity-vest") ballisticChest = 1;
      }
      if (slot === "head") {
        if (e.slug === "ballistic-helmet") ballisticHead = 3;
        else if (e.slug === "ushanka") ballisticHead = 0;
      }
    }
    for (const inv of store.current.inventory) {
      const it = ITEMS_BY_SLUG[inv.slug];
      if (!it) continue;
      weight += (it.stats?.weightG ?? 0) * inv.qty;
      if (it.stats?.slots) {
        slots += it.stats.slots.w * it.stats.slots.h * inv.qty;
      }
    }

    return { weight, slots, ballisticChest, ballisticHead };
  }, [store]);

  const STAMINA = useMemo(() => {
    if (stats.weight <= 15000) return { label: "FULL SPRINT", color: "var(--c-olive-bright)", pct: stats.weight / 40000 };
    if (stats.weight <= 25000) return { label: "REGEN -25%", color: "var(--c-brass)", pct: stats.weight / 40000 };
    if (stats.weight <= 40000) return { label: "REGEN -50%", color: "var(--c-rust)", pct: stats.weight / 40000 };
    return { label: "WALK FORÇADO", color: "var(--c-blood-bright)", pct: 1 };
  }, [stats.weight]);

  // Skeleton enquanto hidrata
  if (!store) {
    return (
      <div className="space-y-4">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Identificação</span>
          </div>
          <div className="panel-body grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 skel" />
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Equipamento</span>
          </div>
          <div className="panel-body grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="h-32 skel" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  function update(c: Character) {
    if (!store) return;
    const next: Store = {
      ...store,
      current: { ...c, updatedAt: Date.now() },
    };
    setStore(next);
    writeStore(next);
  }

  function setEquipment(slot: EquipmentSlot, item: EquippedItem | undefined) {
    if (!store) return;
    const eq = { ...store.current.equipment };
    if (item) eq[slot] = item;
    else delete eq[slot];
    update({ ...store.current, equipment: eq });
  }

  function setInventory(items: InventoryEntry[]) {
    if (!store) return;
    update({ ...store.current, inventory: items.slice(0, 200) });
  }

  function addToInventory(slug: string) {
    if (!store) return;
    const existing = store.current.inventory.find((i) => i.slug === slug);
    if (existing) {
      setInventory(
        store.current.inventory.map((i) =>
          i.slug === slug ? { ...i, qty: Math.min(999, i.qty + 1) } : i,
        ),
      );
    } else {
      setInventory([...store.current.inventory, { slug, qty: 1 }]);
    }
  }

  function newSnapshot() {
    if (!store) return;
    const label = prompt("Nome do snapshot (ex: 'pré-NWAF', 'pós-raid'):");
    if (!label) return;
    const trimmed = label.trim().slice(0, 60);
    if (!trimmed) return;
    const snap: Snapshot = {
      id: newSnapshotId(),
      label: trimmed,
      character: { ...store.current },
      createdAt: Date.now(),
    };
    const next: Store = {
      ...store,
      snapshots: [snap, ...store.snapshots].slice(0, 50),
    };
    setStore(next);
    writeStore(next);
  }

  function loadSnapshot(id: string) {
    if (!store) return;
    const snap = store.snapshots.find((s) => s.id === id);
    if (!snap) return;
    if (!confirm(`Carregar snapshot "${snap.label}"? Substitui o atual.`)) return;
    update(snap.character);
  }

  function deleteSnapshot(id: string) {
    if (!store) return;
    if (!confirm("Apagar este snapshot?")) return;
    const next: Store = {
      ...store,
      snapshots: store.snapshots.filter((s) => s.id !== id),
    };
    setStore(next);
    writeStore(next);
  }

  function exportJson() {
    if (!store) return;
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dayz-codex-character-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function generateShareUrl() {
    if (!store) return;
    const hash = encodeShare(store.current);
    const url = `${window.location.origin}/personagem#share=${hash}`;
    setShareUrl(url);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  function reset() {
    if (!confirm("Resetar personagem (mantém snapshots)?")) return;
    update({
      name: "Survivor",
      server: "",
      map: "chernarus",
      notes: "",
      equipment: {},
      inventory: [],
      updatedAt: Date.now(),
    });
  }

  return (
    <div className="space-y-4">
      {/* Header: nome / server / map / notes */}
      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Identificação</span>
          <span className="panel-header__meta">
            ATUALIZADO {new Date(store.current.updatedAt).toLocaleString("pt-BR")}
          </span>
        </div>
        <div className="panel-body grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="Nome" value={store.current.name} onChange={(v) => update({ ...store.current, name: v })} max={60} />
          <Field label="Server" value={store.current.server} onChange={(v) => update({ ...store.current, server: v })} max={60} placeholder="ex: Survivors PT-BR" />
          <div>
            <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-1">MAPA</div>
            <select
              className="input"
              value={store.current.map}
              onChange={(e) => update({ ...store.current, map: e.target.value as Character["map"] })}
            >
              <option value="chernarus">Chernarus +</option>
              <option value="livonia">Livonia</option>
              <option value="sakhal">Sakhal</option>
              <option value="other">Outro (mod)</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-1">AÇÕES</div>
            <div className="flex flex-wrap gap-1">
              <button onClick={newSnapshot} className="btn h-9 px-3 text-xs">
                <i className="fi-rr-shield-check" /> SNAPSHOT
              </button>
              <button onClick={generateShareUrl} className="btn btn--ghost h-9 px-3 text-xs">
                <i className="fi-rr-arrow-right" /> SHARE
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Equipment + Inventory */}
        <div className="space-y-4">
          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Equipamento</span>
            </div>
            <div className="panel-body grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {EQUIPMENT_SLOTS.map((slot) => (
                <SlotCard
                  key={slot}
                  slot={slot}
                  equipped={store.current.equipment[slot]}
                  onClick={() => setPicker({ slot })}
                  onClear={() => setEquipment(slot, undefined)}
                  onCondition={(c) => {
                    const e = store.current.equipment[slot];
                    if (e) setEquipment(slot, { ...e, condition: c });
                  }}
                />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">
                Inventário · {store.current.inventory.length} itens
              </span>
              <button
                onClick={() => setPicker({ slot: "inventory" })}
                className="text-xs font-mono text-[var(--c-olive-bright)] hover:underline"
              >
                + ADICIONAR
              </button>
            </div>
            <div className="panel-body">
              {store.current.inventory.length === 0 ? (
                <p className="text-sm text-[var(--c-bone-dim)] italic text-center py-8">
                  Vazio. Click "+ ADICIONAR" pra incluir items soltos na vest/mochila.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {store.current.inventory.map((inv) => {
                    const it = ITEMS_BY_SLUG[inv.slug];
                    if (!it) return null;
                    const totalWeight = (it.stats?.weightG ?? 0) * inv.qty;
                    return (
                      <div
                        key={inv.slug}
                        className="flex items-center gap-2 p-1.5 border border-[var(--c-border)] hover:border-[var(--c-olive)]"
                      >
                        <ItemImage
                          slug={it.slug}
                          icon={it.icon}
                          alt={it.name}
                          size="sm"
                          className="shrink-0 border border-[var(--c-border)]"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/itens/${inv.slug}`}
                            className="block text-sm text-[var(--c-bone)] hover:text-[var(--c-olive-bright)] truncate"
                          >
                            {it.name}
                          </Link>
                          {totalWeight > 0 && (
                            <div className="text-[0.6rem] font-mono text-[var(--c-ash)]">
                              {(totalWeight / 1000).toFixed(2)}kg · {it.subcategory ?? it.category}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center border border-[var(--c-border)]">
                          <button
                            onClick={() => {
                              if (inv.qty <= 1) {
                                setInventory(store.current.inventory.filter((x) => x.slug !== inv.slug));
                                return;
                              }
                              setInventory(
                                store.current.inventory.map((x) =>
                                  x.slug === inv.slug ? { ...x, qty: x.qty - 1 } : x,
                                ),
                              );
                            }}
                            className="w-6 h-7 text-[var(--c-bone-dim)] hover:text-[var(--c-blood-bright)] hover:bg-[var(--c-surface-3)] font-mono text-sm leading-none"
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={999}
                            value={inv.qty}
                            onChange={(e) => {
                              const n = Math.max(1, Math.min(999, Math.round(+e.target.value || 1)));
                              setInventory(
                                store.current.inventory.map((x) =>
                                  x.slug === inv.slug ? { ...x, qty: n } : x,
                                ),
                              );
                            }}
                            className="w-10 bg-[var(--c-bg)] text-[var(--c-bone)] text-center font-mono text-sm border-x border-[var(--c-border)] h-7"
                          />
                          <button
                            onClick={() =>
                              setInventory(
                                store.current.inventory.map((x) =>
                                  x.slug === inv.slug ? { ...x, qty: Math.min(999, x.qty + 1) } : x,
                                ),
                              )
                            }
                            className="w-6 h-7 text-[var(--c-bone-dim)] hover:text-[var(--c-olive-bright)] hover:bg-[var(--c-surface-3)] font-mono text-sm leading-none"
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            setInventory(store.current.inventory.filter((x) => x.slug !== inv.slug))
                          }
                          className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline px-1"
                          aria-label="Remover"
                          title="Remover do inventário"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Notas</span>
            </div>
            <div className="panel-body">
              <textarea
                value={store.current.notes}
                onChange={(e) => update({ ...store.current, notes: e.target.value.slice(0, 2000) })}
                placeholder="Stash em XX,YY · Squad: ABC · TODO: pegar M4 mag..."
                rows={4}
                className="input h-28 py-2 resize-none"
                maxLength={2000}
              />
            </div>
          </section>
        </div>

        {/* Sidebar: stats + snapshots */}
        <aside className="space-y-4">
          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Status</span>
            </div>
            <div className="panel-body space-y-3 text-sm">
              <Stat label="PESO" value={`${(stats.weight / 1000).toFixed(2)} kg`} />
              <Stat label="SLOTS USADOS" value={`${stats.slots}`} />
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--c-ash)] tracking-widest">STAMINA</span>
                  <span style={{ color: STAMINA.color }}>{STAMINA.label}</span>
                </div>
                <div className="relative h-2 bg-[var(--c-bg)] border border-[var(--c-border)]">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(100, STAMINA.pct * 100)}%`,
                      background: STAMINA.color,
                    }}
                  />
                </div>
              </div>
              <Stat
                label="PROT. TORSO"
                value={
                  stats.ballisticChest === 5
                    ? "RIFLE-PROOF"
                    : stats.ballisticChest >= 2
                    ? "PISTOL-PROOF"
                    : stats.ballisticChest === 1
                    ? "FRAGS"
                    : "EXPOSTO"
                }
                tone={stats.ballisticChest === 5 ? "olive-bright" : stats.ballisticChest > 0 ? "brass" : "blood-bright"}
              />
              <Stat
                label="PROT. CABEÇA"
                value={stats.ballisticHead >= 3 ? "BALÍSTICA" : "EXPOSTA"}
                tone={stats.ballisticHead > 0 ? "olive-bright" : "blood-bright"}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Snapshots</span>
              <span className="panel-header__meta">{store.snapshots.length}</span>
            </div>
            <div className="panel-body space-y-1.5">
              {store.snapshots.length === 0 ? (
                <p className="text-xs text-[var(--c-bone-dim)] italic">
                  Sem snapshots. Use "SNAPSHOT" pra salvar versões datadas.
                </p>
              ) : (
                store.snapshots.map((s) => (
                  <div
                    key={s.id}
                    className="border border-[var(--c-border)] p-2 hover:border-[var(--c-olive)]"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <button
                        onClick={() => loadSnapshot(s.id)}
                        className="text-sm text-[var(--c-bone)] hover:text-[var(--c-olive-bright)] truncate flex-1 text-left"
                      >
                        {s.label}
                      </button>
                      <button
                        onClick={() => deleteSnapshot(s.id)}
                        className="text-xs text-[var(--c-blood-bright)] hover:underline"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-[0.65rem] font-mono text-[var(--c-ash)] mt-0.5">
                      {new Date(s.createdAt).toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Manutenção</span>
            </div>
            <div className="panel-body space-y-1.5">
              <button onClick={exportJson} className="btn btn--ghost h-8 text-xs w-full">
                <i className="fi-rr-arrow-right" /> EXPORTAR JSON
              </button>
              <button onClick={reset} className="btn btn--blood h-8 text-xs w-full">
                <i className="fi-rr-skull" /> RESETAR PERSONAGEM
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* Share modal */}
      {shareUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShareUrl(null)}
        >
          <div
            className="panel max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <span className="panel-header__title">URL de Share</span>
              <button onClick={() => setShareUrl(null)} className="text-[var(--c-ash)]">✕</button>
            </div>
            <div className="panel-body space-y-3 text-sm">
              <p className="text-[var(--c-bone-dim)]">
                URL copiada pro clipboard. Cole no Discord/grupo. Quem abrir vê seu loadout.
              </p>
              <textarea
                readOnly
                className="input h-24 py-2 resize-none font-mono text-xs"
                value={shareUrl}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <div className="text-xs text-[var(--c-ash)] font-mono">
                Tamanho: {shareUrl.length} chars
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item picker modal */}
      {picker && (
        <ItemPicker
          slot={picker.slot}
          onPick={(slug, condition) => {
            if (picker.slot === "inventory") {
              addToInventory(slug);
            } else {
              setEquipment(picker.slot, { slug, condition: condition ?? "pristine" });
            }
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-1">{label}</div>
      <input
        className="input"
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--c-border)] last:border-0 pb-2 last:pb-0">
      <span className="font-mono text-xs text-[var(--c-ash)] tracking-wider">{label}</span>
      <span
        className="font-stencil text-sm tracking-wide"
        style={tone ? { color: `var(--c-${tone})` } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function SlotCard({
  slot,
  equipped,
  onClick,
  onClear,
  onCondition,
}: {
  slot: EquipmentSlot;
  equipped: EquippedItem | undefined;
  onClick: () => void;
  onClear: () => void;
  onCondition: (c: Condition) => void;
}) {
  const meta = SLOT_META[slot];
  const item = equipped ? ITEMS_BY_SLUG[equipped.slug] : null;
  const cond = equipped ? CONDITION_META[equipped.condition] : null;

  function cycleCondition() {
    if (!equipped) return;
    const idx = CONDITIONS.indexOf(equipped.condition);
    const next = CONDITIONS[(idx + 1) % CONDITIONS.length];
    onCondition(next);
  }

  return (
    <div className="border border-[var(--c-border)] bg-[var(--c-bg)] relative group">
      <div className="flex items-center justify-between px-2.5 pt-2 pb-1">
        <span className="text-[0.6rem] font-mono text-[var(--c-ash)] tracking-[0.18em]">
          ◆ {meta.label.toUpperCase()}
        </span>
        {item && cond && (
          <button
            onClick={cycleCondition}
            className="text-[0.6rem] font-mono font-bold tracking-wider px-1.5 py-0.5 border leading-none"
            style={{ color: cond.color, borderColor: cond.color }}
            title={`${cond.label} — click pra ciclar`}
          >
            {cond.abbr}
          </button>
        )}
      </div>
      {item ? (
        <>
          <button onClick={onClick} className="block w-full text-left px-2.5 pb-2.5">
            <div className="flex items-center gap-2.5">
              <ItemImage
                slug={item.slug}
                icon={item.icon}
                alt={item.name}
                size="sm"
                className="shrink-0 border border-[var(--c-border)]"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--c-bone)] leading-tight line-clamp-2 group-hover:text-[var(--c-olive-bright)]">
                  {item.name}
                </div>
                {item.stats?.weightG !== undefined && (
                  <div className="text-[0.65rem] font-mono text-[var(--c-ash)] mt-0.5">
                    {(item.stats.weightG / 1000).toFixed(2)}kg
                  </div>
                )}
              </div>
            </div>
          </button>
          <button
            onClick={onClear}
            className="absolute top-1 right-1 text-[var(--c-blood-bright)] opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono w-5 h-5 leading-none flex items-center justify-center hover:bg-[var(--c-surface-3)]"
            aria-label="Tirar item"
            title="Tirar item"
          >
            ✕
          </button>
        </>
      ) : (
        <button
          onClick={onClick}
          className="w-full h-24 flex flex-col items-center justify-center text-[var(--c-ash)] hover:text-[var(--c-olive-bright)] hover:bg-[var(--c-surface-3)] gap-1.5 border-t border-dashed border-[var(--c-border)]"
        >
          <i className={`fi-rr-${meta.icon} text-2xl opacity-60`} />
          <span className="text-[0.65rem] font-mono tracking-wider">+ EQUIPAR</span>
        </button>
      )}
    </div>
  );
}

const RARITY_COLOR: Record<string, string> = {
  common: "var(--c-ash)",
  uncommon: "var(--c-olive-bright)",
  rare: "var(--c-brass)",
  very_rare: "var(--c-rust)",
  legendary: "var(--c-blood-bright)",
};
const PAGE_SIZE = 60;

function ItemPicker({
  slot,
  onPick,
  onClose,
}: {
  slot: EquipmentSlot | "inventory";
  onPick: (slug: string, condition?: Condition) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("");
  const [bypassSlotFilter, setBypassSlotFilter] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Categorias mostradas como chips: dentro do filtro do slot, ou todas
  // se for inventário/bypass. Mantém os mesmos chips quando o user vai
  // de "TODAS" pra uma específica — sem reflow.
  const availableCats = useMemo(() => {
    if (slot === "inventory" || bypassSlotFilter) {
      return CATEGORY_META.map((c) => c.key as string);
    }
    return (SLOT_META[slot].categoryFilter ?? []) as string[];
  }, [slot, bypassSlotFilter]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let pool = ITEMS;
    if (slot !== "inventory" && !bypassSlotFilter) {
      const meta = SLOT_META[slot];
      const cats = meta.categoryFilter ?? [];
      pool = pool.filter((it) => cats.includes(it.category));
      if (meta.subcategoryHints && meta.subcategoryHints.length > 0) {
        const hints = meta.subcategoryHints.map((h) => h.toLowerCase());
        const sub = pool.filter((it) =>
          it.subcategory ? hints.some((h) => it.subcategory!.toLowerCase().includes(h)) : false,
        );
        if (sub.length > 0) pool = sub;
      }
    }
    if (activeCat) pool = pool.filter((it) => it.category === activeCat);
    if (term) {
      pool = pool.filter((it) => {
        const hay = `${it.name} ${it.summary} ${it.subcategory ?? ""} ${(it.tags ?? []).join(" ")}`.toLowerCase();
        return hay.includes(term);
      });
    }
    return pool;
  }, [search, activeCat, slot, bypassSlotFilter]);

  const visible = filtered.slice(0, limit);
  const slotMeta = slot !== "inventory" ? SLOT_META[slot] : null;
  const isSlotFiltered = slot !== "inventory" && !bypassSlotFilter;

  function resetPagination() {
    setLimit(PAGE_SIZE);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[6vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl panel max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <span className="panel-header__title">
            {slot === "inventory" ? "Adicionar ao Inventário" : `Equipar: ${slotMeta!.label}`}
          </span>
          <button onClick={onClose} className="text-[var(--c-ash)] text-lg leading-none" aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="panel-body space-y-3 flex-1 overflow-hidden flex flex-col">
          {/* Busca */}
          <div className="relative">
            <i className="fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
            <input
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPagination();
              }}
              placeholder="BUSCAR por nome, calibre, tag..."
              className="input pl-9"
            />
          </div>

          {/* Filtro de slot ativo (toggle pra ignorar) */}
          {isSlotFiltered && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="badge badge--olive">FILTRO: {slotMeta!.label.toUpperCase()}</span>
              <button
                onClick={() => {
                  setBypassSlotFilter(true);
                  setActiveCat("");
                  resetPagination();
                }}
                className="text-[var(--c-bone-dim)] hover:text-[var(--c-olive-bright)] underline"
              >
                ver todos os itens
              </button>
            </div>
          )}
          {!isSlotFiltered && slot !== "inventory" && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[var(--c-ash)]">SEM FILTRO DE SLOT</span>
              <button
                onClick={() => {
                  setBypassSlotFilter(false);
                  setActiveCat("");
                  resetPagination();
                }}
                className="text-[var(--c-bone-dim)] hover:text-[var(--c-olive-bright)] underline"
              >
                voltar pro filtro de {slotMeta!.label.toLowerCase()}
              </button>
            </div>
          )}

          {/* Chips de categoria */}
          {availableCats.length > 1 && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setActiveCat("");
                  resetPagination();
                }}
                className={`text-[0.65rem] font-mono px-2 py-1 border tracking-wider transition-colors ${
                  activeCat === ""
                    ? "border-[var(--c-olive-bright)] text-[var(--c-olive-bright)] bg-[var(--c-surface-3)]"
                    : "border-[var(--c-border)] text-[var(--c-ash)] hover:text-[var(--c-bone)]"
                }`}
              >
                TODAS
              </button>
              {CATEGORY_META.filter((c) => availableCats.includes(c.key)).map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    setActiveCat(activeCat === c.key ? "" : c.key);
                    resetPagination();
                  }}
                  className={`text-[0.65rem] font-mono px-2 py-1 border flex items-center gap-1 tracking-wider transition-colors ${
                    activeCat === c.key
                      ? "border-[var(--c-olive-bright)] text-[var(--c-olive-bright)] bg-[var(--c-surface-3)]"
                      : "border-[var(--c-border)] text-[var(--c-ash)] hover:text-[var(--c-bone)]"
                  }`}
                >
                  <i className={`fi-rr-${c.icon}`} />
                  {c.label.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Contador */}
          <div className="text-[0.65rem] font-mono text-[var(--c-ash)] tracking-wide">
            {filtered.length === 0
              ? "0 itens"
              : `mostrando ${Math.min(limit, filtered.length)} de ${filtered.length}`}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto -mx-1 px-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-[var(--c-bone-dim)] italic text-center py-12">
                Nada encontrado com esses filtros.
                {isSlotFiltered && (
                  <>
                    {" "}
                    <button
                      onClick={() => setBypassSlotFilter(true)}
                      className="underline text-[var(--c-olive-bright)]"
                    >
                      ver todos os itens
                    </button>
                  </>
                )}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {visible.map((it) => (
                    <button
                      key={it.slug}
                      onClick={() => onPick(it.slug)}
                      className="border border-[var(--c-border)] bg-[var(--c-bg)] p-2 hover:border-[var(--c-olive-bright)] hover:bg-[var(--c-surface-3)] text-left flex flex-col gap-1.5 group"
                    >
                      <div className="flex items-start gap-2">
                        <ItemImage
                          slug={it.slug}
                          icon={it.icon}
                          alt={it.name}
                          size="sm"
                          className="shrink-0 border border-[var(--c-border)]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[var(--c-bone)] leading-tight line-clamp-2 group-hover:text-[var(--c-olive-bright)]">
                            {it.name}
                          </div>
                          <div className="text-[0.6rem] font-mono text-[var(--c-ash)] mt-0.5 truncate">
                            {it.subcategory ?? it.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[0.6rem] font-mono pt-1 border-t border-[var(--c-border)]">
                        <span
                          className="flex items-center gap-1 uppercase"
                          style={{ color: RARITY_COLOR[it.rarity] ?? RARITY_COLOR.common }}
                        >
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ background: "currentColor" }}
                          />
                          {it.rarity.replace("_", " ")}
                        </span>
                        <span className="text-[var(--c-ash)]">
                          {it.stats?.weightG !== undefined
                            ? `${(it.stats.weightG / 1000).toFixed(2)}kg`
                            : "—"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {visible.length < filtered.length && (
                  <button
                    onClick={() => setLimit((l) => l + PAGE_SIZE)}
                    className="btn btn--ghost h-9 text-xs w-full mt-3"
                  >
                    + VER MAIS ({filtered.length - visible.length} restantes)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
