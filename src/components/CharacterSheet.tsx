"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ITEMS, ITEMS_BY_SLUG } from "@/data/items";
import {
  CharacterSchema,
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
                <div className="space-y-1">
                  {store.current.inventory.map((inv) => {
                    const it = ITEMS_BY_SLUG[inv.slug];
                    if (!it) return null;
                    return (
                      <div
                        key={inv.slug}
                        className="flex items-center gap-2 p-2 border border-[var(--c-border)] hover:border-[var(--c-olive)]"
                      >
                        <i className={`fi-rr-${it.icon} text-[var(--c-olive-bright)]`} />
                        <Link
                          href={`/itens/${inv.slug}`}
                          className="flex-1 text-sm text-[var(--c-bone)] hover:text-[var(--c-olive-bright)] truncate"
                        >
                          {it.name}
                        </Link>
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
                          className="w-14 bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-bone)] px-2 py-1 font-mono text-sm"
                        />
                        <button
                          onClick={() =>
                            setInventory(store.current.inventory.filter((x) => x.slug !== inv.slug))
                          }
                          className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline"
                          aria-label="Remover"
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

  return (
    <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3 relative group">
      <div className="text-[0.65rem] font-mono text-[var(--c-ash)] tracking-[0.18em] mb-2">
        ◆ {meta.label.toUpperCase()}
      </div>
      {item ? (
        <>
          <button onClick={onClick} className="block w-full text-left">
            <div className="flex items-center gap-2">
              <i className={`fi-rr-${item.icon} text-[var(--c-olive-bright)] text-xl`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--c-bone)] truncate">{item.name}</div>
                {item.stats?.weightG !== undefined && (
                  <div className="text-[0.65rem] font-mono text-[var(--c-ash)]">
                    {(item.stats.weightG / 1000).toFixed(2)}kg
                  </div>
                )}
              </div>
            </div>
          </button>
          <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-[var(--c-border)]">
            <select
              value={equipped!.condition}
              onChange={(e) => onCondition(e.target.value as Condition)}
              className="text-[0.65rem] font-mono bg-[var(--c-bg)] border border-[var(--c-border)] px-1 py-0.5"
              style={{ color: cond!.color }}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {CONDITION_META[c].abbr}
                </option>
              ))}
            </select>
            <button
              onClick={onClear}
              className="text-xs font-mono text-[var(--c-blood-bright)] hover:underline"
              aria-label="Tirar item"
            >
              ✕
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={onClick}
          className="w-full h-20 flex flex-col items-center justify-center text-[var(--c-ash)] hover:text-[var(--c-olive-bright)] hover:bg-[var(--c-surface-3)]"
        >
          <i className={`fi-rr-${meta.icon} text-2xl mb-1`} />
          <span className="text-[0.65rem] font-mono tracking-wider">VAZIO</span>
        </button>
      )}
    </div>
  );
}

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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let pool = ITEMS;
    if (slot !== "inventory") {
      const meta = SLOT_META[slot];
      const cats = meta.categoryFilter ?? [];
      pool = pool.filter((it) => cats.includes(it.category));
      // Subcategoria hint pra restringir mais (ex: head só Cabeça)
      if (meta.subcategoryHints && meta.subcategoryHints.length > 0) {
        const hints = meta.subcategoryHints.map((h) => h.toLowerCase());
        const filteredBySub = pool.filter((it) =>
          it.subcategory ? hints.some((h) => it.subcategory!.toLowerCase().includes(h)) : false,
        );
        if (filteredBySub.length > 0) pool = filteredBySub;
      }
    }
    if (activeCat) pool = pool.filter((it) => it.category === activeCat);
    if (term) {
      pool = pool.filter((it) => {
        const hay = `${it.name} ${it.summary} ${it.subcategory ?? ""}`.toLowerCase();
        return hay.includes(term);
      });
    }
    return pool.slice(0, 60);
  }, [search, activeCat, slot]);

  const slotMeta = slot !== "inventory" ? SLOT_META[slot] : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <span className="panel-header__title">
            {slot === "inventory" ? "Adicionar ao Inventário" : `Equipar: ${slotMeta!.label}`}
          </span>
          <button onClick={onClose} className="text-[var(--c-ash)]">✕</button>
        </div>
        <div className="panel-body space-y-3">
          <div className="relative">
            <i className="fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="BUSCAR..."
              className="input"
            />
          </div>
          <div className="max-h-[50vh] overflow-y-auto space-y-1">
            {filtered.length === 0 && (
              <p className="text-sm text-[var(--c-bone-dim)] italic text-center py-8">
                Nada encontrado.
              </p>
            )}
            {filtered.map((it) => (
              <button
                key={it.slug}
                onClick={() => onPick(it.slug)}
                className="w-full flex items-center gap-2 p-2 border border-transparent hover:border-[var(--c-border)] hover:bg-[var(--c-surface-3)] text-left"
              >
                <i className={`fi-rr-${it.icon} text-[var(--c-olive-bright)] shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[var(--c-bone)] truncate">{it.name}</div>
                  <div className="text-xs text-[var(--c-ash)] font-mono">
                    {it.subcategory ?? it.category}
                    {it.stats?.weightG !== undefined && ` · ${(it.stats.weightG / 1000).toFixed(2)}kg`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
