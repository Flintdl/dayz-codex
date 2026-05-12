"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DayZServer } from "@/lib/battlemetrics";

/**
 * Browser de servidores DayZ — filtra client-side os dados que já vieram
 * via RSC. Pra busca externa (servers fora do top 50), faz fetch debounced
 * em /api/servers que é rate-limitado server-side.
 *
 * Sanitização: nomes/descrições já vieram saneados do server.
 * React escapa o text content por padrão — nenhum dangerouslySetInnerHTML aqui.
 */

const MAP_LABEL: Record<string, string> = {
  chernarusplus: "Chernarus +",
  livonia: "Livonia",
  sakhal: "Sakhal",
  enoch: "Livonia",
  banov: "Banov",
  namalsk: "Namalsk",
  esseker: "Esseker",
  deer_isle: "Deer Isle",
};

function mapDisplay(raw: string): string {
  const key = raw.toLowerCase().replace(/[^a-z_]/g, "");
  return MAP_LABEL[key] ?? raw;
}

interface Props {
  initialServers: DayZServer[];
}

export function ServerBrowser({ initialServers }: Props) {
  const [search, setSearch] = useState("");
  const [remote, setRemote] = useState<DayZServer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter1pp, setFilter1pp] = useState<"all" | "1pp" | "3pp">("all");
  const [filterOfficial, setFilterOfficial] = useState<"all" | "official" | "community">(
    "all",
  );
  const [filterCountry, setFilterCountry] = useState<string>("");

  // Fetch remoto quando search >= 3 chars OU country selecionado.
  // Sem nenhum dos dois → usa initialServers (top 50 mundial).
  useEffect(() => {
    const term = search.trim();
    const needsRemote = term.length >= 3 || filterCountry !== "";
    if (!needsRemote) {
      setRemote(null);
      setError(null);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ limit: "50" });
      if (term.length >= 3) params.set("q", term);
      if (filterCountry) params.set("country", filterCountry);
      fetch(`/api/servers?${params.toString()}`, { signal: ctrl.signal })
        .then(async (r) => {
          if (!r.ok) {
            if (r.status === 429) throw new Error("Muitas buscas — tente em 1 min");
            throw new Error(`HTTP ${r.status}`);
          }
          return r.json();
        })
        .then((d: { servers: DayZServer[] }) => {
          setRemote(d.servers);
          setError(null);
        })
        .catch((e: unknown) => {
          if (e instanceof Error && e.name === "AbortError") return;
          setError(e instanceof Error ? e.message : "fetch falhou");
          setRemote(null);
        })
        .finally(() => setLoading(false));
    }, 350);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [search, filterCountry]);

  const baseServers = remote ?? initialServers;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return baseServers.filter((s) => {
      if (filter1pp === "1pp" && !s.firstPersonOnly) return false;
      if (filter1pp === "3pp" && s.firstPersonOnly) return false;
      if (filterOfficial === "official" && !s.official) return false;
      if (filterOfficial === "community" && s.official) return false;
      // country é aplicado no fetch remoto — não filtra de novo aqui
      // (evita filtragem dupla; se algo passa, BM já validou)
      if (term && !remote) {
        // Search local só quando nenhuma busca remota foi feita
        const hay = `${s.name} ${s.map} ${s.country ?? ""}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [baseServers, search, remote, filter1pp, filterOfficial]);

  // Lista de países sempre vem dos initialServers (top mundial) pra
  // dropdown não ficar travada num único país após filtrar.
  const countries = useMemo(() => {
    const set = new Set<string>();
    for (const s of initialServers) if (s.country) set.add(s.country);
    // Garante que o país selecionado esteja na lista mesmo se não estava no top
    if (filterCountry) set.add(filterCountry);
    return Array.from(set).sort();
  }, [initialServers, filterCountry]);

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="panel">
        <div className="panel-body space-y-3">
          <div className="relative">
            <i className="fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-bone-dim)]" />
            <input
              type="search"
              autoComplete="off"
              maxLength={40}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="BUSCAR NOME, MAPA, PAÍS (3+ chars = busca remota)..."
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <FilterGroup
              label="Visão"
              value={filter1pp}
              onChange={(v) => setFilter1pp(v as typeof filter1pp)}
              options={[
                { value: "all", label: "Todos" },
                { value: "1pp", label: "1PP" },
                { value: "3pp", label: "3PP" },
              ]}
            />
            <FilterGroup
              label="Tipo"
              value={filterOfficial}
              onChange={(v) => setFilterOfficial(v as typeof filterOfficial)}
              options={[
                { value: "all", label: "Todos" },
                { value: "official", label: "Oficiais" },
                { value: "community", label: "Comunidade" },
              ]}
            />
            {countries.length > 0 && (
              <label className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-[var(--c-ash)] tracking-widest">PAÍS</span>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-bone)] px-2 py-1"
                >
                  <option value="">Todos</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <span className="ml-auto text-xs text-[var(--c-ash)] font-mono">
              {loading ? "buscando..." : `${filtered.length} servidores`}
            </span>
          </div>
          {error && (
            <p className="text-xs text-[var(--c-blood-bright)] font-mono">{error}</p>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="grid gap-2">
        {filtered.map((s) => (
          <ServerRow key={s.id} server={s} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--c-bone-dim)] italic text-center py-12">
            Nenhum servidor com esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <span className="text-[var(--c-ash)] tracking-widest mr-1">
        {label.toUpperCase()}
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2 py-1 border transition-colors ${
            value === o.value
              ? "border-[var(--c-olive-bright)] text-[var(--c-olive-bright)] bg-[var(--c-surface-3)]"
              : "border-[var(--c-border)] text-[var(--c-bone-dim)] hover:text-[var(--c-bone)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ServerRow({ server: s }: { server: DayZServer }) {
  const popPct = s.maxPlayers > 0 ? (s.players / s.maxPlayers) * 100 : 0;
  const popColor =
    popPct >= 90
      ? "var(--c-blood-bright)"
      : popPct >= 50
      ? "var(--c-brass)"
      : "var(--c-olive-bright)";

  return (
    <Link
      href={`/servidores/${s.id}`}
      className="panel scan-on-hover px-4 py-3 hover:border-[var(--c-olive-bright)] transition-colors flex items-start gap-4"
    >
      <div className="shrink-0 w-14 text-center">
        <div className="font-stencil text-2xl tracking-wide" style={{ color: popColor }}>
          {s.players}
        </div>
        <div className="text-[0.6rem] font-mono text-[var(--c-ash)]">
          / {s.maxPlayers}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[var(--c-bone)] text-sm truncate font-medium">
            {s.name}
          </span>
          {s.passworded && (
            <span className="badge" style={{ borderColor: "var(--c-brass)" }}>
              PWD
            </span>
          )}
          {s.official && <span className="badge badge--olive">OFICIAL</span>}
          {s.firstPersonOnly && <span className="badge">1PP</span>}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] font-mono text-[var(--c-ash)] mt-1">
          <span>
            <i className="fi-rr-map mr-1" />
            {mapDisplay(s.map)}
          </span>
          {s.country && (
            <span>
              <i className="fi-rr-globe mr-1" />
              {s.country}
            </span>
          )}
          {s.time && (
            <span>
              <i className="fi-rr-clock mr-1" />
              {s.time}
            </span>
          )}
          {s.modNames.length > 0 && (
            <span>
              <i className="fi-rr-settings mr-1" />
              {s.modNames.length} mod{s.modNames.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 self-center">
        <span className="font-mono text-xs text-[var(--c-olive-bright)]">
          DETALHES →
        </span>
      </div>
    </Link>
  );
}
