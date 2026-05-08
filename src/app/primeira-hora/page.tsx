import Link from "next/link";
import { FIRST_HOUR } from "@/data/firstHour";
import { ITEMS_BY_SLUG } from "@/data/items";

export const metadata = {
  title: "Guia Primeira Hora",
};

export default function FirstHourPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">PROTOCOLO 0001</span>
        <h1>Primeira Hora</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-3xl">
          Passo-a-passo de fresh spawn ao primeiro loadout viável (~60 min).
          Decisões críticas em cada fase — escolhas erradas custam horas.
        </p>
      </header>

      <nav className="panel panel-body flex flex-wrap gap-2">
        {FIRST_HOUR.map((p) => (
          <a key={p.slug} href={`#${p.slug}`} className="badge badge--olive">
            FASE {p.number} · {p.title.split(" (")[0].toUpperCase()}
          </a>
        ))}
      </nav>

      {FIRST_HOUR.map((p) => (
        <section key={p.slug} id={p.slug} className="space-y-4 scroll-mt-24">
          <header className="border-l-4 border-[var(--c-olive-bright)] pl-4">
            <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-1">
              FASE {p.number} · {p.duration.toUpperCase()}
            </div>
            <h2>{p.title}</h2>
            <p className="text-sm text-[var(--c-bone-dim)] mt-2 leading-relaxed">
              {p.intro}
            </p>
          </header>
          <div className="space-y-3">
            {p.steps.map((s, i) => (
              <article key={i} className="panel">
                <div className="panel-header">
                  <span className="panel-header__title flex items-center gap-2">
                    <span
                      className="font-stencil text-xs px-2 py-0.5 bg-[var(--c-olive)]/20"
                      style={{ color: "var(--c-olive-bright)" }}
                    >
                      {p.number}.{i + 1}
                    </span>
                    {s.goal}
                  </span>
                </div>
                <div className="panel-body grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-2">
                      ◆ AÇÕES
                    </div>
                    <ul className="bullet-mil text-sm text-[var(--c-bone-dim)] space-y-1.5">
                      {s.actions.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[var(--c-blood-bright)] tracking-widest mb-2">
                      ⚠ CUIDADO
                    </div>
                    <ul className="bullet-mil text-sm text-[var(--c-bone-dim)] space-y-1.5">
                      {s.watchOut.map((w, j) => (
                        <li key={j}>{w}</li>
                      ))}
                    </ul>
                  </div>
                  {s.keyItems.length > 0 && (
                    <div className="md:col-span-2 pt-3 border-t border-[var(--c-border)]">
                      <div className="text-xs font-mono text-[var(--c-brass)] tracking-widest mb-2">
                        ITENS-CHAVE
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {s.keyItems.map((slug) => {
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
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
