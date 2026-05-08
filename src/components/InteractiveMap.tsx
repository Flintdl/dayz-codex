"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MARKER_TYPES,
  MAP_SLUGS,
  MarkerSchema,
  MarkersFileSchema,
  TYPE_META,
  newMarkerId,
  readMarkers,
  writeMarkers,
  type Marker,
} from "@/lib/markers";
import { ITEMS } from "@/data/items";
import type { Item, LootTier } from "@/data/types";

/**
 * Mapa interativo client-side baseado em Leaflet com CRS.Simple.
 * Usa imagens reais do DayZ Wiki Fandom (topographic) servidas same-origin.
 *
 * Click num spot → painel lateral lista todos itens do catálogo que
 * spawnam no(s) tier(s) daquela zona. Filtra a partir de Item.loot.
 *
 * Marcadores customizados em localStorage com Zod validation.
 */

type MapSlug = (typeof MAP_SLUGS)[number];
type MarkerType = (typeof MARKER_TYPES)[number];

const MAP_META: Record<
  MapSlug,
  {
    name: string;
    file: string;
    widthPx: number;
    heightPx: number;
    gridLabel: string;
  }
> = {
  chernarus: {
    name: "Chernarus +",
    file: "/maps/chernarus.jpeg",
    widthPx: 4096,
    heightPx: 3705,
    gridLabel: "15 360 m × 15 360 m",
  },
  livonia: {
    name: "Livonia",
    file: "/maps/livonia.jpg",
    widthPx: 2048,
    heightPx: 1852,
    gridLabel: "12 800 m × 12 800 m",
  },
  sakhal: {
    name: "Sakhal",
    file: "/maps/sakhal.webp",
    widthPx: 4087,
    heightPx: 3695,
    gridLabel: "10 240 m × 10 240 m",
  },
};

interface PresetMarker {
  id: string;
  map: MapSlug;
  type: MarkerType;
  x: number;
  y: number;
  label: string;
  /** Tiers de loot que spawnam aqui — filtra ITEMS pra mostrar no painel */
  lootTiers: LootTier[];
  notes?: string;
  preset: true;
}

/**
 * Markers oficiais — coordenadas em pixel da imagem do mapa.
 * Cada um declara que tiers de loot spawnam ali (drives o painel de itens).
 */
const PRESET_MARKERS: PresetMarker[] = [
  // ── Chernarus ─────────────────────────────────────────────
  { id: "p-tisy", map: "chernarus", type: "loot", x: 850, y: 630, label: "Tisy Military", lootTiers: ["military_high", "military"], notes: "Tier máximo. M4-A1, Plate Carrier, ACOG. Heli crash 30%.", preset: true },
  { id: "p-nwaf", map: "chernarus", type: "loot", x: 1200, y: 1410, label: "NWAF (Aeroporto NW)", lootTiers: ["military_high", "military"], notes: "Hot zone tradicional. Hangares + ATC + barracks.", preset: true },
  { id: "p-neaf", map: "chernarus", type: "loot", x: 3060, y: 855, label: "NEAF (Krasnostav)", lootTiers: ["military"], notes: "Bom risk/reward. Krasnostav perto pra reabastecer.", preset: true },
  { id: "p-balota", map: "chernarus", type: "loot", x: 1285, y: 3155, label: "Balota Military", lootTiers: ["military"], notes: "Aeroporto litorâneo. Sempre ocupado.", preset: true },
  { id: "p-myshkino", map: "chernarus", type: "loot", x: 1525, y: 2475, label: "Tendas Myshkino", lootTiers: ["military"], notes: "Acampamento militar improvisado.", preset: true },
  { id: "p-vybor", map: "chernarus", type: "loot", x: 1735, y: 1730, label: "Vybor Military", lootTiers: ["military"], notes: "Base intermediária. Ideal pra solo.", preset: true },
  { id: "p-elektro-pol", map: "chernarus", type: "trader", x: 2780, y: 3270, label: "Polícia Elektro", lootTiers: ["police"], notes: "CR-75, Press Vest, ammo 9mm.", preset: true },
  { id: "p-elektro", map: "chernarus", type: "danger", x: 2775, y: 3220, label: "Elektrozavodsk (PvP)", lootTiers: ["town", "police", "medical"], notes: "Cidade portuária — PvP intenso.", preset: true },
  { id: "p-cherno", map: "chernarus", type: "danger", x: 1955, y: 3320, label: "Chernogorsk (PvP)", lootTiers: ["town", "police", "medical", "firefighter"], notes: "Maior cidade da costa sul.", preset: true },
  { id: "p-berezino", map: "chernarus", type: "danger", x: 3185, y: 2400, label: "Berezino", lootTiers: ["town", "police", "medical"], notes: "Cidade leste — ressuprir a caminho do norte.", preset: true },
  { id: "p-rify", map: "chernarus", type: "danger", x: 3745, y: 715, label: "Rify (Contaminação)", lootTiers: ["military_high"], notes: "Naufrágio contaminado. Use Gas Mask + filtros.", preset: true },
  { id: "p-novo", map: "chernarus", type: "loot", x: 2255, y: 1020, label: "Novodmitrovsk", lootTiers: ["town", "industrial", "firefighter"], notes: "Bombeiros aqui = Fire Axe.", preset: true },
  { id: "p-zelen", map: "chernarus", type: "loot", x: 2545, y: 2655, label: "Zelenogorsk", lootTiers: ["town", "police"], notes: "Cidade central. Polícia + supermercado.", preset: true },
  { id: "p-svetlo", map: "chernarus", type: "danger", x: 3400, y: 2980, label: "Svetlojarsk", lootTiers: ["town", "industrial"], notes: "Cidade leste litorânea.", preset: true },
  { id: "p-kamenka", map: "chernarus", type: "loot", x: 380, y: 3275, label: "Kamenka (spawn SW)", lootTiers: ["village"], notes: "Spawn area — zero loot, saia rápido.", preset: true },
  { id: "p-solnich", map: "chernarus", type: "danger", x: 3030, y: 3380, label: "Solnichniy", lootTiers: ["town", "industrial"], notes: "Porto industrial — caixotes pra base.", preset: true },
  { id: "p-kabanino", map: "chernarus", type: "loot", x: 1595, y: 1875, label: "Kabanino", lootTiers: ["village", "farm"], notes: "Vila central. Tools + comida.", preset: true },
  { id: "p-stary", map: "chernarus", type: "loot", x: 1770, y: 2080, label: "Stary Sobor", lootTiers: ["village", "police"], notes: "Pequena cidade central.", preset: true },
  { id: "p-altar", map: "chernarus", type: "loot", x: 2630, y: 1985, label: "Altar Military", lootTiers: ["military"], notes: "Base interior. Less crowded.", preset: true },
  { id: "p-pavlovo", map: "chernarus", type: "loot", x: 1135, y: 3105, label: "Pavlovo Military", lootTiers: ["military"], notes: "Sul. Próximo a costa.", preset: true },
  { id: "p-zub", map: "chernarus", type: "loot", x: 1990, y: 2110, label: "Castelo Zub", lootTiers: ["village", "police"], notes: "Castelo medieval. Loot raro.", preset: true },
  { id: "p-lopatino", map: "chernarus", type: "loot", x: 800, y: 1750, label: "Lopatino Hunting", lootTiers: ["hunting", "village"], notes: "Casa de caça — Mosin, Hatchet.", preset: true },
  { id: "p-dolina", map: "chernarus", type: "loot", x: 2200, y: 2400, label: "Dolina", lootTiers: ["village"], notes: "Vila central pequena.", preset: true },
  { id: "p-veresnik", map: "chernarus", type: "loot", x: 1650, y: 2900, label: "Vyshnoye", lootTiers: ["village", "farm"], notes: "Fazenda + farms.", preset: true },
  { id: "p-novo-hosp", map: "chernarus", type: "trader", x: 2245, y: 1090, label: "Hospital Novo", lootTiers: ["medical"], notes: "Loot médico denso.", preset: true },
  { id: "p-elektro-hosp", map: "chernarus", type: "trader", x: 2780, y: 3215, label: "Hospital Elektro", lootTiers: ["medical"], notes: "Médico de bom retorno.", preset: true },
  { id: "p-berezino-hosp", map: "chernarus", type: "trader", x: 3160, y: 2420, label: "Hospital Berezino", lootTiers: ["medical"], notes: "Médico tier 2.", preset: true },

  // ── Livonia ───────────────────────────────────────────────
  { id: "l-bilo", map: "livonia", type: "loot", x: 990, y: 685, label: "Bilo Mountain Mil", lootTiers: ["military_high", "military"], notes: "Base militar central. Top tier.", preset: true },
  { id: "l-radun", map: "livonia", type: "loot", x: 1110, y: 1060, label: "Radunin", lootTiers: ["village", "town"], notes: "Cidade central.", preset: true },
  { id: "l-sitnik", map: "livonia", type: "loot", x: 800, y: 905, label: "Sitnik", lootTiers: ["village"], notes: "Vila pequena.", preset: true },
  { id: "l-tarnow", map: "livonia", type: "danger", x: 470, y: 1340, label: "Tarnow", lootTiers: ["town", "police"], notes: "Cidade sul. PvP.", preset: true },
  { id: "l-swarog", map: "livonia", type: "danger", x: 1240, y: 1410, label: "Swarog", lootTiers: ["town"], notes: "Cidade leste.", preset: true },
  { id: "l-nadbor", map: "livonia", type: "loot", x: 540, y: 640, label: "Nadbor (Crash)", lootTiers: ["military_high"], notes: "Heli crash recorrente.", preset: true },
  { id: "l-topolin", map: "livonia", type: "loot", x: 1530, y: 980, label: "Topolin Military", lootTiers: ["military"], notes: "Base militar leste.", preset: true },

  // ── Sakhal ────────────────────────────────────────────────
  { id: "s-volcano", map: "sakhal", type: "danger", x: 2000, y: 1900, label: "Vulcão Sakhal", lootTiers: ["military_high"], notes: "Endgame zone. Tier máximo.", preset: true },
  { id: "s-airfield", map: "sakhal", type: "loot", x: 900, y: 900, label: "Aeroporto Sakhal", lootTiers: ["military"], notes: "Aeroporto principal.", preset: true },
  { id: "s-storozh", map: "sakhal", type: "loot", x: 2700, y: 900, label: "Storozh Military", lootTiers: ["military"], notes: "Base militar norte.", preset: true },
  { id: "s-ushki", map: "sakhal", type: "loot", x: 1800, y: 2900, label: "Ushki Coast", lootTiers: ["village"], notes: "Vila costeira sul.", preset: true },
  { id: "s-burukan", map: "sakhal", type: "loot", x: 2900, y: 2200, label: "Burukan Camp", lootTiers: ["military"], notes: "Acampamento militar.", preset: true },
  { id: "s-bolotnoe", map: "sakhal", type: "loot", x: 1300, y: 2200, label: "Bolotnoe Village", lootTiers: ["village", "farm"], notes: "Vila central.", preset: true },
  { id: "s-ayan", map: "sakhal", type: "loot", x: 1100, y: 1500, label: "Ayan", lootTiers: ["village"], notes: "Vila norte-central.", preset: true },
];

interface SelectedSpot {
  id: string;
  label: string;
  type: MarkerType;
  lootTiers: LootTier[];
  notes?: string;
  isCustom: boolean;
}

interface Props {
  initialMap?: MapSlug;
}

export function InteractiveMap({ initialMap = "chernarus" }: Props) {
  const [activeMap, setActiveMap] = useState<MapSlug>(initialMap);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [filter, setFilter] = useState<Set<MarkerType>>(
    new Set(MARKER_TYPES),
  );
  const [editing, setEditing] = useState<{
    x: number;
    y: number;
    label: string;
    notes: string;
    type: MarkerType;
  } | null>(null);
  const [selected, setSelected] = useState<SelectedSpot | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const layerRef = useRef<unknown>(null);

  useEffect(() => {
    setMarkers(readMarkers());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      writeMarkers(markers);
    }
  }, [markers]);

  // Inicializa Leaflet
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      const meta = MAP_META[activeMap];
      const bounds = L.latLngBounds(
        L.latLng(0, 0),
        L.latLng(meta.heightPx, meta.widthPx),
      );

      const map = L.map(containerRef.current, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
        zoomSnap: 0.25,
        attributionControl: false,
        preferCanvas: true,
        maxBounds: bounds.pad(0.1),
        maxBoundsViscosity: 0.7,
      });
      map.fitBounds(bounds);
      mapInstanceRef.current = map;

      L.imageOverlay(meta.file, bounds, {
        opacity: 1,
        interactive: false,
      }).addTo(map);

      const layer = L.layerGroup().addTo(map);
      layerRef.current = layer;

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const x = Math.round(e.latlng.lng);
        const y = Math.round(e.latlng.lat);
        if (x < 0 || x > meta.widthPx || y < 0 || y > meta.heightPx) return;
        setEditing({ x, y, label: "", notes: "", type: "loot" });
      });

      cleanup = () => map.remove();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      mapInstanceRef.current = null;
      layerRef.current = null;
      setSelected(null);
    };
  }, [activeMap]);

  // Render markers
  useEffect(() => {
    (async () => {
      if (!layerRef.current || !mapInstanceRef.current) return;
      const L = await import("leaflet");
      const layer = layerRef.current as ReturnType<typeof L.layerGroup>;
      layer.clearLayers();

      const all: Array<PresetMarker | Marker> = [
        ...PRESET_MARKERS,
        ...markers,
      ].filter((m) => m.map === activeMap && filter.has(m.type));

      for (const m of all) {
        const meta = TYPE_META[m.type];
        const isSelected = selected?.id === m.id;
        const size = isSelected ? 22 : 16;
        const icon = L.divIcon({
          className: `dz-marker${isSelected ? " dz-marker--active" : ""}`,
          html: `<span style="background:${meta.color};border:2px solid #07080a;box-shadow:0 0 0 1px ${meta.color}66"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const lm = L.marker([m.y, m.x], { icon }).addTo(layer);
        lm.on("click", (ev: { originalEvent: { stopPropagation(): void } }) => {
          // Bloqueia o "criar marker" ao clicar num existente
          ev.originalEvent.stopPropagation();
          const isCustom = !("preset" in m && m.preset);
          const lootTiers: LootTier[] = "lootTiers" in m && Array.isArray(m.lootTiers)
            ? (m.lootTiers as LootTier[])
            : []; // custom markers não têm tier; painel mostra só info
          setSelected({
            id: m.id,
            label: m.label,
            type: m.type,
            lootTiers,
            notes: "notes" in m && m.notes ? m.notes : undefined,
            isCustom,
          });
        });
      }
    })();
  }, [markers, activeMap, filter, selected]);

  function saveMarker() {
    if (!editing) return;
    const candidate = {
      id: newMarkerId(),
      map: activeMap,
      type: editing.type,
      x: editing.x,
      y: editing.y,
      label: editing.label.trim().slice(0, 80),
      notes: editing.notes.trim().slice(0, 500),
      createdAt: Date.now(),
    };
    const result = MarkerSchema.safeParse(candidate);
    if (!result.success) {
      alert(`Erro: ${result.error.issues[0]?.message}`);
      return;
    }
    setMarkers((prev) => [...prev, result.data]);
    setEditing(null);
  }

  function deleteMarker(id: string) {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    setSelected(null);
  }

  function exportJson() {
    const file = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      markers,
    };
    const blob = new Blob([JSON.stringify(file, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dayz-codex-markers-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200_000) {
      alert("Arquivo grande demais (max 200KB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        const parsed = MarkersFileSchema.safeParse(json);
        if (!parsed.success) {
          alert("Arquivo inválido.");
          return;
        }
        if (confirm(`Importar ${parsed.data.markers.length} markers? Substitui os atuais.`)) {
          setMarkers(parsed.data.markers);
        }
      } catch {
        alert("Arquivo corrompido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const customMarkers = useMemo(
    () => markers.filter((m) => m.map === activeMap),
    [markers, activeMap],
  );

  // Itens que spawnam no spot selecionado, agrupados por categoria
  const spawnItems = useMemo(() => {
    if (!selected || selected.lootTiers.length === 0) return null;
    const tierSet = new Set<LootTier>(selected.lootTiers);
    const matching = ITEMS.filter((i) =>
      i.loot.some((t) => tierSet.has(t)),
    );
    const grouped = new Map<string, Item[]>();
    for (const it of matching) {
      const key = it.category;
      const bucket = grouped.get(key) ?? [];
      bucket.push(it);
      grouped.set(key, bucket);
    }
    // Sort buckets internally por raridade desc
    const RARITY_RANK: Record<Item["rarity"], number> = {
      legendary: 5, very_rare: 4, rare: 3, uncommon: 2, common: 1,
    };
    for (const [, list] of grouped) {
      list.sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]);
    }
    return grouped;
  }, [selected]);

  return (
    <div className="space-y-4">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-header__title">{MAP_META[activeMap].name}</span>
          <span className="panel-header__meta">
            {MAP_META[activeMap].gridLabel} · {customMarkers.length} customizados
          </span>
        </div>
        <div className="panel-body space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-xs text-[var(--c-ash)] tracking-widest mr-2">
              MAPA:
            </span>
            {MAP_SLUGS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setActiveMap(s);
                  setSelected(null);
                }}
                className={`badge cursor-pointer ${activeMap === s ? "badge--olive" : ""}`}
              >
                {MAP_META[s].name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-xs text-[var(--c-ash)] tracking-widest mr-2">
              FILTRO:
            </span>
            {MARKER_TYPES.map((t) => {
              const meta = TYPE_META[t];
              const active = filter.has(t);
              return (
                <button
                  key={t}
                  onClick={() => {
                    const next = new Set(filter);
                    if (next.has(t)) next.delete(t);
                    else next.add(t);
                    setFilter(next);
                  }}
                  className="badge cursor-pointer"
                  style={{
                    color: active ? meta.color : "var(--c-ash-dim)",
                    borderColor: active ? meta.color : "var(--c-border)",
                    opacity: active ? 1 : 0.4,
                  }}
                >
                  ◆ {meta.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--c-border)]">
            <button onClick={exportJson} className="btn btn--ghost h-8 text-xs">
              <i className="fi-rr-arrow-right" /> EXPORTAR JSON
            </button>
            <label className="btn btn--ghost h-8 text-xs cursor-pointer">
              <i className="fi-rr-arrow-right" /> IMPORTAR
              <input type="file" accept="application/json" onChange={importJson} className="hidden" />
            </label>
            <button
              onClick={() => {
                if (confirm("Apagar TODOS os markers customizados?")) {
                  setMarkers([]);
                }
              }}
              className="btn btn--blood h-8 text-xs"
            >
              <i className="fi-rr-skull" /> LIMPAR
            </button>
            <span className="ml-auto text-xs font-mono text-[var(--c-ash)] self-center">
              CLIQUE NUM SPOT P/ VER LOOT · MAPA VAZIO P/ ADICIONAR
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <div
          ref={containerRef}
          className="border border-[var(--c-border)] bg-[var(--c-bg-deep)]"
          style={{ height: "75vh", minHeight: 500 }}
        />

        <aside className="panel min-h-[500px] max-h-[75vh] flex flex-col">
          {!selected ? (
            <>
              <div className="panel-header">
                <span className="panel-header__title">Briefing</span>
                <span className="panel-header__meta">SEM SPOT</span>
              </div>
              <div className="panel-body text-sm text-[var(--c-bone-dim)] leading-relaxed space-y-3">
                <p>
                  Clique num <span className="text-[var(--c-olive-bright)]">spot oficial</span> pra
                  ver os itens que spawnam ali, classificados por categoria e raridade.
                </p>
                <p>
                  Clique numa <span className="text-[var(--c-bone)]">área vazia do mapa</span> pra
                  adicionar seu próprio marker (stash, base, ponto de encontro).
                </p>
                <div className="border border-[var(--c-border)] p-3 mt-4">
                  <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-2">
                    LEGENDA
                  </div>
                  <div className="space-y-1.5">
                    {MARKER_TYPES.map((t) => {
                      const m = TYPE_META[t];
                      return (
                        <div key={t} className="flex items-center gap-2 text-xs">
                          <span
                            className="w-3 h-3 inline-block"
                            style={{ background: m.color, border: "2px solid #07080a" }}
                          />
                          <span style={{ color: m.color }} className="font-mono">
                            {m.label.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="panel-header">
                <span className="panel-header__title">{selected.label}</span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs font-mono text-[var(--c-ash)] hover:text-[var(--c-bone)]"
                  aria-label="Fechar painel"
                >
                  ✕
                </button>
              </div>
              <div className="panel-body flex-1 overflow-y-auto space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="badge"
                    style={{
                      color: TYPE_META[selected.type].color,
                      borderColor: TYPE_META[selected.type].color,
                    }}
                  >
                    {TYPE_META[selected.type].label.toUpperCase()}
                  </span>
                  {selected.lootTiers.map((t) => (
                    <span key={t} className="badge badge--olive">
                      {t.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ))}
                </div>

                {selected.notes && (
                  <p className="text-sm text-[var(--c-bone-dim)] leading-relaxed border-l-2 border-[var(--c-olive)] pl-3">
                    {selected.notes}
                  </p>
                )}

                {selected.isCustom && (
                  <button
                    onClick={() => deleteMarker(selected.id)}
                    className="btn btn--blood h-8 text-xs"
                  >
                    <i className="fi-rr-skull" /> EXCLUIR MARKER
                  </button>
                )}

                {spawnItems && spawnItems.size > 0 && (
                  <div>
                    <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-2 mt-4">
                      ◆ ITENS QUE SPAWNAM (
                      {Array.from(spawnItems.values()).reduce((a, l) => a + l.length, 0)})
                    </div>
                    <div className="space-y-3">
                      {Array.from(spawnItems.entries()).map(([cat, list]) => (
                        <div key={cat}>
                          <div className="text-[0.65rem] font-mono text-[var(--c-ash)] tracking-widest mb-1.5">
                            {cat.toUpperCase()} · {list.length}
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {list.slice(0, 50).map((it) => (
                              <Link
                                key={it.slug}
                                href={`/itens/${it.slug}`}
                                className="flex items-center gap-2 px-2 py-1 border border-transparent hover:border-[var(--c-border)] hover:bg-[var(--c-surface-3)] text-xs"
                              >
                                <i
                                  className={`fi-rr-${it.icon} text-[var(--c-olive-bright)] text-sm shrink-0`}
                                />
                                <span className="text-[var(--c-bone)] truncate flex-1">
                                  {it.name}
                                </span>
                                <span
                                  className="text-[0.6rem] font-mono uppercase tracking-wider"
                                  style={{
                                    color:
                                      it.rarity === "legendary"
                                        ? "var(--c-radiation)"
                                        : it.rarity === "very_rare"
                                        ? "var(--c-blood-bright)"
                                        : it.rarity === "rare"
                                        ? "var(--c-brass)"
                                        : it.rarity === "uncommon"
                                        ? "var(--c-olive-bright)"
                                        : "var(--c-ash)",
                                  }}
                                >
                                  {it.rarity === "very_rare" ? "v.rare" : it.rarity}
                                </span>
                              </Link>
                            ))}
                            {list.length > 50 && (
                              <div className="text-xs text-[var(--c-ash)] italic px-2 mt-1">
                                + {list.length - 50} itens... (filtre por categoria)
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!spawnItems || spawnItems.size === 0) && selected.isCustom && (
                  <p className="text-xs text-[var(--c-ash)] italic mt-4">
                    Marker customizado — sem mapeamento de loot tier definido.
                  </p>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="panel max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <span className="panel-header__title">Novo Marker</span>
              <span className="panel-header__meta">
                {editing.x}, {editing.y}
              </span>
            </div>
            <div className="panel-body space-y-3">
              <label className="block">
                <span className="text-xs font-mono text-[var(--c-ash)] tracking-widest">
                  CATEGORIA
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {MARKER_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditing({ ...editing, type: t })}
                      className="badge cursor-pointer"
                      style={{
                        color: editing.type === t ? TYPE_META[t].color : "var(--c-ash)",
                        borderColor: editing.type === t ? TYPE_META[t].color : "var(--c-border)",
                      }}
                    >
                      {TYPE_META[t].label}
                    </button>
                  ))}
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-mono text-[var(--c-ash)] tracking-widest">
                  NOME (max 80)
                </span>
                <input
                  className="input mt-1"
                  maxLength={80}
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  placeholder="EX: STASH NORTE DO POMAR"
                  autoFocus
                />
              </label>
              <label className="block">
                <span className="text-xs font-mono text-[var(--c-ash)] tracking-widest">
                  NOTAS (opcional, max 500)
                </span>
                <textarea
                  className="input mt-1 h-20 py-2 resize-none"
                  maxLength={500}
                  value={editing.notes}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                />
              </label>
              <div className="flex gap-2 pt-2">
                <button onClick={saveMarker} className="btn flex-1" disabled={!editing.label.trim()}>
                  <i className="fi-rr-shield-check" /> SALVAR
                </button>
                <button onClick={() => setEditing(null)} className="btn btn--ghost">
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
