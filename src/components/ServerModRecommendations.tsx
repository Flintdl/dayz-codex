import Link from "next/link";
import { matchProfiles, type ModProfile } from "@/data/serverMods";
import { ITEMS_BY_SLUG } from "@/data/items";
import { ItemImage } from "./ItemImage";

interface Props {
  modNames: readonly string[];
}

/**
 * Renderiza recomendações curadas com base nos mods detectados.
 * Casa mods do server contra perfis em `data/serverMods.ts` (substring match).
 *
 * Segurança: modNames já vem saneado de battlemetrics.ts. Output é texto
 * estático curado — não interpolamos modNames em texto livre. React escapa.
 */
export function ServerModRecommendations({ modNames }: Props) {
  const profiles = matchProfiles(modNames);
  if (profiles.length === 0) return null;

  return (
    <section className="panel">
      <div className="panel-header">
        <span className="panel-header__title flex items-center gap-2">
          <i className="fi-rr-shield-check text-[var(--c-olive-bright)]" />
          Recomendações p/ esse server
        </span>
        <span className="panel-header__meta">
          {profiles.length} PERFIL{profiles.length === 1 ? "" : "S"} DETECTADO{profiles.length === 1 ? "" : "S"}
        </span>
      </div>
      <div className="panel-body space-y-6">
        {profiles.map((profile) => (
          <ProfileBlock key={profile.slug} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function ProfileBlock({ profile }: { profile: ModProfile }) {
  const tone = profile.tone ?? "olive";
  const toneColor = `var(--c-${tone}-bright)`;
  const items = (profile.recommendedItems ?? [])
    .map((slug) => ITEMS_BY_SLUG[slug])
    .filter((it): it is NonNullable<typeof it> => Boolean(it));

  return (
    <article className="border-l-2 pl-4" style={{ borderColor: toneColor }}>
      <div className="flex items-baseline gap-2 flex-wrap mb-2">
        <i
          className={`fi-rr-${profile.icon} text-base`}
          style={{ color: toneColor }}
        />
        <h3 className="text-[var(--c-bone)] text-base font-stencil tracking-wide">
          {profile.name}
        </h3>
      </div>
      <p className="text-xs text-[var(--c-bone-dim)] leading-relaxed mb-3">
        {profile.summary}
      </p>

      {profile.tips.length > 0 && (
        <div className="mb-3">
          <div
            className="text-[0.6rem] font-mono tracking-widest mb-1.5"
            style={{ color: toneColor }}
          >
            ◆ DICAS
          </div>
          <ul className="bullet-mil text-xs text-[var(--c-bone-dim)] space-y-1">
            {profile.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {profile.mechanics && profile.mechanics.length > 0 && (
        <div className="mb-3">
          <div
            className="text-[0.6rem] font-mono tracking-widest mb-1.5"
            style={{ color: toneColor }}
          >
            ◆ MECÂNICAS NOVAS
          </div>
          <ul className="bullet-mil text-xs text-[var(--c-bone-dim)] space-y-1">
            {profile.mechanics.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {profile.warnings && profile.warnings.length > 0 && (
        <div className="mb-3">
          <div className="text-[0.6rem] font-mono tracking-widest mb-1.5 text-[var(--c-blood-bright)]">
            ⚠ AVISOS
          </div>
          <ul className="bullet-mil text-xs text-[var(--c-bone-dim)] space-y-1">
            {profile.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
        <div>
          <div
            className="text-[0.6rem] font-mono tracking-widest mb-2"
            style={{ color: toneColor }}
          >
            ◆ ITENS-CHAVE ({items.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
            {items.map((it) => (
              <Link
                key={it.slug}
                href={`/itens/${it.slug}`}
                className="border border-[var(--c-border)] bg-[var(--c-bg)] p-1.5 hover:border-[var(--c-olive-bright)] hover:bg-[var(--c-surface-3)] text-left flex items-center gap-2 group"
              >
                <ItemImage
                  slug={it.slug}
                  icon={it.icon}
                  alt={it.name}
                  size="sm"
                  className="shrink-0 border border-[var(--c-border)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.7rem] text-[var(--c-bone)] leading-tight line-clamp-2 group-hover:text-[var(--c-olive-bright)]">
                    {it.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
