import Link from "next/link";
import { ITEMS, CATEGORY_META } from "@/data/items";
import { ItemCard } from "@/components/ItemCard";
import { SURVIVAL_STATS } from "@/data/survival";
import { MAPS } from "@/data/maps";

export default function HomePage() {
  // Destaques: 1 representante de armas, médico, ferramentas, vestuário
  const featured = [
    "m4-a1",
    "plate-carrier",
    "saline-iv",
    "mountain-backpack",
    "vss",
    "weapon-cleaning-kit",
  ]
    .map((s) => ITEMS.find((i) => i.slug === s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="space-y-16">
      {/* HERO ─────────────────────────────────────── */}
      <section className="relative panel panel--cut overflow-hidden">
        <div className="absolute inset-0 crosshatch opacity-40" aria-hidden />
        <div className="relative px-6 sm:px-12 py-12 sm:py-20 grid lg:grid-cols-[1fr_320px] gap-8 items-center">
          <div className="space-y-5">
            <span className="tape-label">CLASSIF · MANUAL DE CAMPO 0427</span>
            <h1 className="text-camo">
              Sobreviva. Adapte. <br />
              Vença Chernarus.
            </h1>
            <p className="text-[var(--c-bone-dim)] max-w-xl leading-relaxed">
              Codex completo do DayZ vanilla — armas, calibres, médico,
              crafting, base building e zonas militares. Cada item conecta com
              o que o consome, o que o repara e onde encontrar. Sem fluff, sem
              propaganda — só o manual.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/itens" className="btn">
                <i className="fi-rr-boxes" />
                CATÁLOGO COMPLETO
              </Link>
              <Link href="/sobrevivencia" className="btn btn--blood">
                <i className="fi-rr-heart" />
                MANTER-SE VIVO
              </Link>
              <Link href="/mapas" className="btn btn--ghost">
                <i className="fi-rr-map" />
                ZONAS DE LOOT
              </Link>
            </div>
          </div>

          <div className="hidden lg:block panel">
            <div className="panel-header">
              <span className="panel-header__title">Status do Survivor</span>
              <span className="panel-header__meta">LIVE</span>
            </div>
            <div className="panel-body space-y-3">
              {SURVIVAL_STATS.slice(0, 5).map((s) => {
                const pct =
                  s.slug === "blood"
                    ? 78
                    : s.slug === "energy"
                    ? 62
                    : s.slug === "water"
                    ? 45
                    : s.slug === "health"
                    ? 88
                    : 70;
                const fill =
                  s.tone === "blood"
                    ? "stat-row__fill--blood"
                    : s.tone === "brass"
                    ? "stat-row__fill--brass"
                    : "";
                return (
                  <div key={s.slug} className="stat-row">
                    <span className="stat-row__label">{s.name}</span>
                    <span className="stat-row__bar">
                      <span
                        className={`stat-row__fill ${fill}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="stat-row__value">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ATALHOS PRINCIPAIS ───────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="tape-label mb-2 inline-block">SEÇÕES</span>
            <h2>Cobertura do Manual</h2>
          </div>
          <span className="text-xs font-mono text-[var(--c-ash)]">
            {ITEMS.length} ITENS · {CATEGORY_META.length} CATEGORIAS
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: "/itens",
              title: "Itens",
              desc: "Catálogo navegável de armas, médico, ferramentas e vestuário com referências cruzadas.",
              icon: "boxes",
              count: `${ITEMS.length} itens`,
            },
            {
              href: "/crafting",
              title: "Crafting",
              desc: "Receitas: o que precisa, qual ferramenta, em quanto tempo. Tudo navegável até o item-fonte.",
              icon: "tools",
              count: "Receitas vanilla",
            },
            {
              href: "/sobrevivencia",
              title: "Sobrevivência",
              desc: "Status de fome, sede, sangue, temperatura, doenças e como tratar cada uma.",
              icon: "heart",
              count: `${SURVIVAL_STATS.length} stats · 8 doenças`,
            },
            {
              href: "/base-building",
              title: "Base Building",
              desc: "Construções, materiais por estágio, raid times e dicas de raidproof.",
              icon: "fence",
              count: "Wooden · Metal",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="panel scan-on-hover px-5 py-6 group hover:border-[var(--c-olive-bright)] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <i
                  className={`fi-rr-${c.icon} text-3xl text-[var(--c-olive-bright)]`}
                />
                <i className="fi-rr-arrow-right text-[var(--c-bone-dim)] group-hover:text-[var(--c-olive-bright)] group-hover:translate-x-1 transition" />
              </div>
              <h3 className="text-[var(--c-bone)] mb-2">{c.title}</h3>
              <p className="text-xs text-[var(--c-bone-dim)] leading-relaxed mb-4">
                {c.desc}
              </p>
              <span className="badge">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES ────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="tape-label mb-2 inline-block">TIER ALTO</span>
            <h2>Loot que importa</h2>
          </div>
          <Link
            href="/itens"
            className="text-sm text-[var(--c-olive-bright)] hover:underline font-mono"
          >
            VER TODOS →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featured.map((it) => (
            <ItemCard key={it.slug} item={it} />
          ))}
        </div>
      </section>

      {/* MAPAS ───────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="tape-label mb-2 inline-block">REGIÕES</span>
            <h2>Mapas Suportados</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {MAPS.map((m) => (
            <Link
              key={m.slug}
              href={`/mapas#${m.slug}`}
              className="panel scan-on-hover p-5 hover:border-[var(--c-olive-bright)] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[var(--c-bone)]">{m.name}</h3>
                <span className="badge badge--olive">{m.area}</span>
              </div>
              <p className="text-xs text-[var(--c-bone-dim)] leading-relaxed mb-3">
                {m.description}
              </p>
              <div className="text-xs font-mono text-[var(--c-ash)]">
                {m.climate}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DICA RÁPIDA ──────────────────────────────── */}
      <section className="panel panel--cut">
        <div className="panel-header">
          <span className="panel-header__title">Briefing Rápido</span>
          <span className="panel-header__meta">PROTOCOLO 01</span>
        </div>
        <div className="panel-body grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-[var(--c-blood-bright)] font-stencil text-sm tracking-widest mb-2">
              I. PRIMEIRA HORA
            </div>
            <ul className="bullet-mil text-sm text-[var(--c-bone-dim)]">
              <li>Saia da costa em 5 min — Elektro/Cherno = morte.</li>
              <li>Beba água potável (cisterna pública é seguro).</li>
              <li>Vasculhe casas amarelas pra knife, can opener, matches.</li>
            </ul>
          </div>
          <div>
            <div className="text-[var(--c-olive-bright)] font-stencil text-sm tracking-widest mb-2">
              II. PROGRESSÃO
            </div>
            <ul className="bullet-mil text-sm text-[var(--c-bone-dim)]">
              <li>Casa de caça (Mosin, Hatchet, Hunter Backpack).</li>
              <li>Polícia da cidade (CR-75, Press Vest, ammo).</li>
              <li>Base militar pequena (Vybor, Myshkino) antes do NWAF.</li>
            </ul>
          </div>
          <div>
            <div className="text-[var(--c-brass)] font-stencil text-sm tracking-widest mb-2">
              III. ENDGAME
            </div>
            <ul className="bullet-mil text-sm text-[var(--c-bone-dim)]">
              <li>Tisy / Heli / Rify = M4, Plate Carrier, ACOG.</li>
              <li>Sempre Saline IV antes de blood bag.</li>
              <li>Compass + mapa = nunca se perca à noite.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
