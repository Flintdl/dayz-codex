import Link from "next/link";
import { SURVIVAL_STATS, DISEASES } from "@/data/survival";
import { MECHANICS, type MechanicSection } from "@/data/mechanics";
import { ITEMS_BY_SLUG } from "@/data/items";
import type { SurvivalStat, Disease } from "@/data/types";

export const metadata = {
  title: "Sobrevivência",
};

const TONE_COLOR: Record<MechanicSection["tone"], string> = {
  olive: "var(--c-olive-bright)",
  brass: "var(--c-brass)",
  blood: "var(--c-blood-bright)",
  rust: "var(--c-rust)",
  radiation: "var(--c-radiation)",
};

const SEVERITY_TONE: Record<Disease["severity"], string> = {
  mild: "badge badge--olive",
  moderate: "badge badge--brass",
  severe: "badge badge--blood",
};

export default function SurvivalPage() {
  return (
    <div className="space-y-10">
      <header>
        <span className="tape-label mb-3 inline-block">PROTOCOLO MÉDICO</span>
        <h1>Manter-se vivo</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Status do survivor e doenças mais comuns — sintomas, causas, cura
          e prevenção. Cada item-tratamento abre a ficha completa.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2">
          <i className="fi-rr-heart text-[var(--c-olive-bright)]" />
          Status do Survivor
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {SURVIVAL_STATS.map((s) => (
            <SurvivalCard key={s.slug} stat={s} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2">
          <i className="fi-rr-virus text-[var(--c-blood-bright)]" />
          Doenças & Síndromes
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {DISEASES.map((d) => (
            <DiseaseCard key={d.slug} disease={d} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2">
          <i className="fi-rr-shield text-[var(--c-brass)]" />
          Mecânicas Avançadas
        </h2>
        <p className="text-[var(--c-bone-dim)] text-sm max-w-3xl">
          Sistemas que separam sobreviventes amadores de veteranos: damage zones,
          shock × sangue, transfusão por tipo, persistência, clima, hunting,
          keybinds, loot tier system.
        </p>
        <nav className="panel panel-body flex flex-wrap gap-2">
          {MECHANICS.map((m) => (
            <a
              key={m.slug}
              href={`#${m.slug}`}
              className="badge cursor-pointer"
              style={{
                color: TONE_COLOR[m.tone],
                borderColor: TONE_COLOR[m.tone],
              }}
            >
              <i className={`fi-rr-${m.icon} mr-1`} /> {m.title.toUpperCase()}
            </a>
          ))}
        </nav>
        <div className="space-y-4">
          {MECHANICS.map((m) => (
            <MechanicCard key={m.slug} m={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MechanicCard({ m }: { m: MechanicSection }) {
  const tone = TONE_COLOR[m.tone];
  return (
    <article id={m.slug} className="panel scroll-mt-24">
      <div className="panel-header">
        <span className="panel-header__title flex items-center gap-2">
          <i className={`fi-rr-${m.icon}`} style={{ color: tone }} />
          {m.title}
        </span>
      </div>
      <div className="panel-body space-y-4 text-sm">
        <p className="text-[var(--c-bone-dim)] leading-relaxed">{m.intro}</p>
        <ul className="bullet-mil text-[var(--c-bone-dim)] space-y-1.5">
          {m.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        {m.table && (
          <div className="overflow-x-auto">
            <table className="field-table">
              <thead>
                <tr>
                  {m.table.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}

function SurvivalCard({ stat }: { stat: SurvivalStat }) {
  return (
    <article id={stat.slug} className="panel scroll-mt-24">
      <div className="panel-header">
        <span className="panel-header__title flex items-center gap-2">
          <i className={`fi-rr-${stat.icon} text-[var(--c-olive-bright)]`} />
          {stat.name}
        </span>
        <span className="panel-header__meta">
          {stat.range.min}–{stat.range.max} {stat.range.unit}
        </span>
      </div>
      <div className="panel-body space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-2">
              ↑ AUMENTA
            </div>
            <ul className="bullet-mil space-y-1 text-[var(--c-bone-dim)] text-xs">
              {stat.increases.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--c-blood-bright)] tracking-widest mb-2">
              ↓ DIMINUI
            </div>
            <ul className="bullet-mil space-y-1 text-[var(--c-bone-dim)] text-xs">
              {stat.decreases.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-2">
            FAIXAS
          </div>
          <table className="field-table">
            <tbody>
              {stat.thresholds.map((t) => (
                <tr key={t.level}>
                  <td className="font-stencil text-xs">{t.label}</td>
                  <td className="text-xs">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stat.keyItems.length > 0 && (
          <div>
            <div className="text-xs font-mono text-[var(--c-brass)] tracking-widest mb-2">
              ITENS-CHAVE
            </div>
            <div className="flex flex-wrap gap-2">
              {stat.keyItems.map((slug) => {
                const it = ITEMS_BY_SLUG[slug];
                if (!it) return null;
                return (
                  <Link
                    key={slug}
                    href={`/itens/${slug}`}
                    className="badge badge--brass hover:bg-[var(--c-brass)]/30"
                  >
                    <i className={`fi-rr-${it.icon} mr-1`} />
                    {it.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function DiseaseCard({ disease }: { disease: Disease }) {
  return (
    <article id={disease.slug} className="panel scroll-mt-24">
      <div className="panel-header">
        <span className="panel-header__title flex items-center gap-2">
          <i className={`fi-rr-${disease.icon} text-[var(--c-blood-bright)]`} />
          {disease.name}
        </span>
        <span className={SEVERITY_TONE[disease.severity]}>
          {disease.severity.toUpperCase()}
        </span>
      </div>
      <div className="panel-body space-y-4 text-sm">
        <p className="text-[var(--c-bone-dim)] leading-relaxed">
          {disease.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-mono text-[var(--c-blood-bright)] tracking-widest mb-2">
              SINTOMAS
            </div>
            <ul className="bullet-mil text-xs text-[var(--c-bone-dim)]">
              {disease.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--c-rust)] tracking-widest mb-2">
              CAUSAS
            </div>
            <ul className="bullet-mil text-xs text-[var(--c-bone-dim)]">
              {disease.causes.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {disease.cures.length > 0 && (
          <div>
            <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-2">
              ◆ CURA
            </div>
            <div className="flex flex-wrap gap-2">
              {disease.cures.map((slug) => {
                const it = ITEMS_BY_SLUG[slug];
                return it ? (
                  <Link
                    key={slug}
                    href={`/itens/${slug}`}
                    className="badge badge--olive hover:bg-[var(--c-olive)]/30"
                  >
                    <i className={`fi-rr-${it.icon} mr-1`} />
                    {it.name}
                  </Link>
                ) : (
                  <span key={slug} className="badge">
                    {slug}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {disease.prevention.length > 0 && (
          <div>
            <div className="text-xs font-mono text-[var(--c-brass)] tracking-widest mb-2">
              PREVENÇÃO
            </div>
            <ul className="space-y-1">
              {disease.prevention.map((p) => {
                const it = ITEMS_BY_SLUG[p];
                return (
                  <li key={p} className="text-xs">
                    {it ? (
                      <Link
                        href={`/itens/${p}`}
                        className="text-[var(--c-bone)] hover:text-[var(--c-olive-bright)] flex items-center gap-1"
                      >
                        <i className={`fi-rr-${it.icon}`} />
                        {it.name}
                      </Link>
                    ) : (
                      <span className="text-[var(--c-bone-dim)]">{p}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
