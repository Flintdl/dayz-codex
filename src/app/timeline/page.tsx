import { TIMELINE } from "@/data/timeline";

export const metadata = {
  title: "Timeline DayZ",
};

export default function TimelinePage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">EVOLUÇÃO</span>
        <h1>Timeline DayZ Standalone</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Major releases de 1.0 (saída do Early Access) até 1.27 (atual). O que
          mudou em cada versão, com foco em itens/sistemas que afetam este Codex.
        </p>
      </header>

      <div className="space-y-4 relative pl-6">
        <div className="absolute left-[3px] top-0 bottom-0 w-0.5 bg-[var(--c-border-strong)]" />
        {TIMELINE.map((t, i) => (
          <article
            key={t.version}
            className="panel relative"
          >
            <div
              className="absolute -left-[26px] top-5 w-3 h-3 border-2 border-[var(--c-olive-bright)] bg-[var(--c-bg)]"
              style={{
                background: i === TIMELINE.length - 1 ? "var(--c-olive-bright)" : undefined,
              }}
            />
            <div className="panel-header">
              <span className="panel-header__title">
                {t.version} · {t.title}
              </span>
              <span className="panel-header__meta">{t.date}</span>
            </div>
            <div className="panel-body">
              <ul className="bullet-mil text-sm text-[var(--c-bone-dim)] space-y-1.5">
                {t.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
