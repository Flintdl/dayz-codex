import Link from "next/link";
import { GLOSSARY_BY_CATEGORY } from "@/data/glossary";
import { ITEMS_BY_SLUG } from "@/data/items";
import type { GlossaryTerm } from "@/data/glossary";

export const metadata = {
  title: "Glossário",
};

const CATEGORY_LABEL = {
  comunidade: "Comunidade & Gíria",
  combate: "Combate",
  loot: "Loot & Economy",
  tecnico: "Técnico",
  social: "Social & Server",
};

const CATEGORY_TONE = {
  comunidade: "var(--c-olive-bright)",
  combate: "var(--c-blood-bright)",
  loot: "var(--c-brass)",
  tecnico: "var(--c-bone-dim)",
  social: "var(--c-rust)",
};

export default function GlossaryPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">DICIONÁRIO TÁTICO</span>
        <h1>Glossário</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Termos da comunidade DayZ — gírias, abreviações, jargão técnico.
          Necessário pra entender voice chat de squads e Reddit/Discord.
        </p>
      </header>

      <nav className="panel panel-body flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_LABEL) as Array<keyof typeof CATEGORY_LABEL>).map((cat) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="badge cursor-pointer"
            style={{ color: CATEGORY_TONE[cat], borderColor: CATEGORY_TONE[cat] }}
          >
            {CATEGORY_LABEL[cat].toUpperCase()} ·{" "}
            {GLOSSARY_BY_CATEGORY[cat].length}
          </a>
        ))}
      </nav>

      {(Object.keys(CATEGORY_LABEL) as Array<keyof typeof CATEGORY_LABEL>).map((cat) => (
        <section key={cat} id={cat} className="space-y-3 scroll-mt-24">
          <h2 style={{ color: CATEGORY_TONE[cat] }}>{CATEGORY_LABEL[cat]}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {GLOSSARY_BY_CATEGORY[cat].map((t) => (
              <TermCard key={t.term} term={t} tone={CATEGORY_TONE[cat]} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TermCard({ term: t, tone }: { term: GlossaryTerm; tone: string }) {
  return (
    <article className="panel">
      <div className="panel-body space-y-2">
        <div className="flex items-baseline gap-2">
          <h3
            className="text-base"
            style={{ color: tone }}
          >
            {t.term}
          </h3>
          {t.abbr && (
            <span className="badge text-[0.65rem]">{t.abbr}</span>
          )}
        </div>
        <p className="text-sm text-[var(--c-bone-dim)] leading-relaxed">
          {t.definition}
        </p>
        {t.related && t.related.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--c-border)]">
            {t.related.map((slug) => {
              const it = ITEMS_BY_SLUG[slug];
              if (!it) return null;
              return (
                <Link
                  key={slug}
                  href={`/itens/${slug}`}
                  className="badge badge--olive hover:bg-[var(--c-olive)]/30 text-[0.65rem]"
                >
                  <i className={`fi-rr-${it.icon} mr-1`} />
                  {it.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
