import { MAPS, MAP_ZONES } from "@/data/maps";
import type { MapZone } from "@/data/types";

export const metadata = {
  title: "Mapas & Zonas",
};

const TYPE_LABEL: Record<MapZone["type"], string> = {
  military: "MILITAR",
  police: "POLÍCIA",
  industrial: "INDUSTRIAL",
  town: "CIDADE",
  village: "VILA",
  hospital: "HOSPITAL",
  fire: "BOMBEIROS",
  hunting: "CAÇA",
  spawn: "SPAWN",
  contamination: "CONTAMINAÇÃO",
  heli_crash: "HELI CRASH",
};
const TYPE_TONE: Record<MapZone["type"], string> = {
  military: "badge badge--olive",
  police: "badge badge--brass",
  industrial: "badge",
  town: "badge",
  village: "badge",
  hospital: "badge badge--blood",
  fire: "badge badge--rust",
  hunting: "badge badge--olive",
  spawn: "badge",
  contamination: "badge badge--radiation",
  heli_crash: "badge badge--blood",
};

function risk(n: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <i
      key={i}
      className={
        i < n
          ? "fi-rr-skull text-[var(--c-blood-bright)]"
          : "fi-rr-skull text-[var(--c-ash-dim)]"
      }
    />
  ));
}

export default function MapsPage() {
  return (
    <div className="space-y-10">
      <header>
        <span className="tape-label mb-3 inline-block">RECONHECIMENTO</span>
        <h1>Mapas & Zonas de Loot</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Resumo dos três mapas oficiais (Chernarus+, Livonia, Sakhal) e
          principais zonas de loot — risco PvP/Z, tier, coordenadas grid.
        </p>
      </header>

      {MAPS.map((m) => {
        const zones = m.zoneSlugs
          .map((s) => MAP_ZONES.find((z) => z.slug === s))
          .filter((x): x is MapZone => Boolean(x));
        return (
          <section key={m.slug} id={m.slug} className="space-y-4 scroll-mt-24">
            <div className="panel panel--cut">
              <div className="panel-header">
                <span className="panel-header__title">{m.name}</span>
                <span className="panel-header__meta">{m.area}</span>
              </div>
              <div className="panel-body space-y-3">
                <p className="text-[var(--c-bone-dim)] leading-relaxed">
                  {m.description}
                </p>
                <div className="text-xs font-mono text-[var(--c-ash)]">
                  {m.climate}
                </div>
                <ul className="bullet-mil text-sm text-[var(--c-bone-dim)] mt-2">
                  {m.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {zones.length > 0 && (
              <>
                <h3 className="text-[var(--c-bone)] mt-4">
                  Zonas Notáveis · {zones.length}
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {zones.map((z) => (
                    <article
                      key={z.slug}
                      id={z.slug}
                      className="panel scroll-mt-24"
                    >
                      <div className="panel-body space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-stencil text-base text-[var(--c-bone)] tracking-wide">
                              {z.name}
                            </h4>
                            <div className="text-xs font-mono text-[var(--c-ash)] mt-1">
                              {z.region}
                              {z.grid && ` · GRID ${z.grid}`}
                            </div>
                          </div>
                          <span className={TYPE_TONE[z.type]}>
                            {TYPE_LABEL[z.type]}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--c-bone-dim)] leading-relaxed">
                          {z.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex flex-wrap gap-1">
                            {z.loot.map((l) => (
                              <span key={l} className="badge">
                                {l.replace(/_/g, " ").toUpperCase()}
                              </span>
                            ))}
                          </div>
                          <div
                            className="flex items-center gap-1"
                            title={`Risco ${z.risk}/5`}
                          >
                            {risk(z.risk)}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
