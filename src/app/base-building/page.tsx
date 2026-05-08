import Link from "next/link";
import { BUILDING_PIECES } from "@/data/baseBuilding";
import { ITEMS_BY_SLUG } from "@/data/items";

export const metadata = {
  title: "Base Building",
};

const TIER_TONE: Record<string, string> = {
  improvised: "badge badge--rust",
  wooden: "badge badge--olive",
  metal: "badge badge--brass",
};

export default function BasePage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">FORTIFICAÇÃO</span>
        <h1>Base Building</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Construções vanilla — estágios, materiais por nível, ferramentas e
          tempo médio de raid pra defender melhor (ou raidar quem raidou).
        </p>
      </header>

      <div className="space-y-6">
        {BUILDING_PIECES.map((piece) => (
          <article
            key={piece.slug}
            id={piece.slug}
            className="panel scroll-mt-24"
          >
            <div className="panel-header">
              <span className="panel-header__title flex items-center gap-2">
                <i
                  className={`fi-rr-${piece.icon} text-[var(--c-olive-bright)]`}
                />
                {piece.name}
              </span>
              <div className="flex items-center gap-2">
                <span className={TIER_TONE[piece.tier]}>
                  {piece.tier.toUpperCase()}
                </span>
                <span className="badge">
                  {piece.hp.toLocaleString()} HP
                </span>
              </div>
            </div>
            <div className="panel-body space-y-5">
              <p className="text-[var(--c-bone-dim)] text-sm">
                {piece.description}
              </p>

              <div>
                <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-3">
                  ◆ ESTÁGIOS
                </div>
                <ol className="space-y-3">
                  {piece.stages.map((stage, i) => (
                    <li
                      key={i}
                      className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <strong className="font-stencil text-sm tracking-wide text-[var(--c-bone)]">
                          {stage.label}
                        </strong>
                      </div>
                      {stage.materials.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {stage.materials.map((m) => {
                            const it = ITEMS_BY_SLUG[m.itemSlug];
                            return it ? (
                              <Link
                                key={m.itemSlug}
                                href={`/itens/${m.itemSlug}`}
                                className="badge badge--olive hover:bg-[var(--c-olive)]/30"
                              >
                                {m.qty}× <i className={`fi-rr-${it.icon} mx-1`} />
                                {it.name}
                              </Link>
                            ) : (
                              <span key={m.itemSlug} className="badge">
                                {m.qty}× {m.itemSlug}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {stage.tools && stage.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-1">
                          {stage.tools.map((t) => {
                            const it = ITEMS_BY_SLUG[t];
                            return it ? (
                              <Link
                                key={t}
                                href={`/itens/${t}`}
                                className="badge badge--brass hover:bg-[var(--c-brass)]/30"
                              >
                                <i className={`fi-rr-${it.icon} mr-1`} />
                                {it.name}
                              </Link>
                            ) : (
                              <span key={t} className="badge">
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {stage.notes && (
                        <div className="text-xs text-[var(--c-bone-dim)] italic mt-1">
                          {stage.notes}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {piece.raid && piece.raid.length > 0 && (
                <div>
                  <div className="text-xs font-mono text-[var(--c-blood-bright)] tracking-widest mb-2">
                    ⚠ RAID
                  </div>
                  <ul className="bullet-mil text-xs text-[var(--c-bone-dim)]">
                    {piece.raid.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
