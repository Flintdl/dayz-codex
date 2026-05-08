import Link from "next/link";
import { notFound } from "next/navigation";
import { ITEMS, ITEMS_BY_SLUG, CATEGORY_META, getItem } from "@/data/items";
import { RECIPES, buildRecipeIndex } from "@/data/recipes";
import { ItemImage } from "@/components/ItemImage";
import { FavoriteButton } from "@/components/FavoriteButton";
import { HistoryRecorder } from "@/components/HistoryRecorder";
import type { Item, Rarity } from "@/data/types";

const RARITY_LABEL: Record<Rarity, string> = {
  common: "COMUM",
  uncommon: "INCOMUM",
  rare: "RARO",
  very_rare: "MUITO RARO",
  legendary: "ENDGAME",
};
const RARITY_TONE: Record<Rarity, string> = {
  common: "badge",
  uncommon: "badge badge--olive",
  rare: "badge badge--brass",
  very_rare: "badge badge--blood",
  legendary: "badge badge--radiation",
};

export function generateStaticParams() {
  return ITEMS.map((it) => ({ slug: it.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return { title: "Item não encontrado" };
  return {
    title: item.name,
    description: item.summary,
  };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  const cat = CATEGORY_META.find((c) => c.key === item.category);
  const recipeIdx = buildRecipeIndex();
  const usedInRecipes = recipeIdx.usedIn[item.slug] ?? [];
  const producedByRecipes = recipeIdx.producedBy[item.slug] ?? [];

  return (
    <article className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono text-[var(--c-ash)] flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[var(--c-bone)]">
          HOME
        </Link>
        <span>/</span>
        <Link href="/itens" className="hover:text-[var(--c-bone)]">
          ITENS
        </Link>
        <span>/</span>
        {cat && (
          <>
            <Link
              href={`/itens?cat=${item.category}`}
              className="hover:text-[var(--c-bone)]"
            >
              {cat.label.toUpperCase()}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--c-bone)]">{item.name.toUpperCase()}</span>
      </nav>

      {/* HERO ─────────────────────────────────── */}
      <header className="panel panel--cut">
        <div className="panel-header">
          <span className="panel-header__title">FICHA DE ITEM</span>
          <span className="panel-header__meta">SLUG: {item.slug}</span>
        </div>
        <div className="panel-body grid md:grid-cols-[220px_1fr] gap-6">
          <div className="flex flex-col items-center gap-3">
            <ItemImage
              slug={item.slug}
              icon={item.icon}
              alt={item.name}
              size="lg"
              className="w-[192px] h-[192px]"
            />
            <span className={RARITY_TONE[item.rarity]}>
              {RARITY_LABEL[item.rarity]}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <HistoryRecorder slug={item.slug} />
            <div className="flex items-center justify-between gap-3">
              {item.subcategory && (
                <span className="tape-label">
                  {item.subcategory.toUpperCase()}
                </span>
              )}
              <FavoriteButton slug={item.slug} />
            </div>
            <h1 className="!leading-tight">{item.name}</h1>
            <p className="text-[var(--c-bone-dim)] text-base leading-relaxed">
              {item.summary}
            </p>
            <p className="text-[var(--c-bone-dim)] text-sm leading-relaxed">
              {item.description}
            </p>
            {item.notes && item.notes.length > 0 && (
              <ul className="bullet-mil text-sm mt-2">
                {item.notes.map((n, i) => (
                  <li key={i} className="text-[var(--c-blood-bright)]/90">
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* STATS ───────────────────────────────── */}
      {item.stats && (
        <section className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Especificações</span>
          </div>
          <div className="panel-body grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {item.stats.slots && (
              <Spec
                label="Slots"
                value={`${item.stats.slots.w}×${item.stats.slots.h}`}
                icon="grid"
              />
            )}
            {item.stats.weightG !== undefined && (
              <Spec
                label="Peso"
                value={`${(item.stats.weightG / 1000).toFixed(2)} kg`}
                icon="dumbbell-weightlifting"
              />
            )}
            {item.stats.damage !== undefined && (
              <Spec
                label="Dano"
                value={`${item.stats.damage} pts`}
                icon="bolt"
              />
            )}
            {item.stats.rangeM !== undefined && (
              <Spec
                label="Alcance"
                value={`${item.stats.rangeM} m`}
                icon="dart"
              />
            )}
            {item.stats.rpm !== undefined && (
              <Spec label="Cadência" value={`${item.stats.rpm} RPM`} icon="bolt" />
            )}
            {item.stats.magCapacity !== undefined && (
              <Spec
                label="Capacidade"
                value={`${item.stats.magCapacity}`}
                icon="boxes"
              />
            )}
            {item.stats.energyKcal !== undefined && (
              <Spec
                label="Calorias"
                value={`${item.stats.energyKcal} kcal`}
                icon="drumstick-bite"
              />
            )}
            {item.stats.hydrationMl !== undefined && (
              <Spec
                label="Hidratação"
                value={`${item.stats.hydrationMl} mL`}
                icon="bottle"
              />
            )}
            {item.stats.medicalEffect && (
              <Spec
                label="Efeito"
                value={item.stats.medicalEffect}
                icon="band-aid"
              />
            )}
            {item.stats.caliber && item.stats.caliber.length > 0 && (
              <div className="col-span-2 sm:col-span-3 md:col-span-4">
                <div className="text-xs font-mono text-[var(--c-ash)] tracking-wider mb-2">
                  CALIBRE(S)
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.stats.caliber.map((c) => {
                    const ammo = ITEMS_BY_SLUG[c];
                    return ammo ? (
                      <Link
                        key={c}
                        href={`/itens/${c}`}
                        className="badge badge--brass hover:bg-[var(--c-brass)]/30"
                      >
                        {ammo.name}
                      </Link>
                    ) : (
                      <span key={c} className="badge">
                        {c}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* LOOT ──────────────────────────────── */}
      {item.loot.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Onde encontrar</span>
          </div>
          <div className="panel-body flex flex-wrap gap-2">
            {item.loot.map((tier) => (
              <span key={tier} className="badge badge--olive">
                <i className="fi-rr-marker mr-1" /> {tier.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* RELATIONS ─────────────────────────── */}
      {item.relations && (
        <RelationsSection item={item} />
      )}

      {/* RECIPES INDEX ────────────────────── */}
      {(usedInRecipes.length > 0 || producedByRecipes.length > 0) && (
        <section className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Crafting</span>
          </div>
          <div className="panel-body grid md:grid-cols-2 gap-6">
            {producedByRecipes.length > 0 && (
              <div>
                <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-3">
                  ↗ PRODUZIDO POR
                </div>
                <ul className="space-y-2">
                  {producedByRecipes.map((rs) => {
                    const r = RECIPES.find((x) => x.slug === rs);
                    if (!r) return null;
                    return (
                      <li key={rs}>
                        <Link
                          href={`/crafting#${rs}`}
                          className="block panel scan-on-hover px-3 py-2.5 hover:border-[var(--c-olive-bright)]"
                        >
                          <div className="text-sm text-[var(--c-bone)]">
                            {r.method}
                          </div>
                          <div className="text-xs text-[var(--c-bone-dim)] mt-1 font-mono">
                            {r.inputs
                              .map((inp) => `${inp.qty}× ${inp.itemSlug}`)
                              .join(" + ")}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {usedInRecipes.length > 0 && (
              <div>
                <div className="text-xs font-mono text-[var(--c-brass)] tracking-widest mb-3">
                  ↘ INGREDIENTE EM
                </div>
                <ul className="space-y-2">
                  {usedInRecipes.map((rs) => {
                    const r = RECIPES.find((x) => x.slug === rs);
                    if (!r) return null;
                    const out = ITEMS_BY_SLUG[r.output.itemSlug];
                    return (
                      <li key={rs}>
                        <Link
                          href={`/crafting#${rs}`}
                          className="block panel scan-on-hover px-3 py-2.5 hover:border-[var(--c-brass)]"
                        >
                          <div className="text-sm text-[var(--c-bone)]">
                            → produz {out?.name ?? r.output.itemSlug}
                          </div>
                          <div className="text-xs text-[var(--c-bone-dim)] mt-1 font-mono">
                            {r.method}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MECHANICS RELATED ──────────────────────── */}
      <RelatedMechanics item={item} />

      {/* TAGS ──────────────────────── */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="badge">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function RelatedMechanics({ item }: { item: Item }) {
  /**
   * Heurística simples: linka pra mecânicas que mencionam categoria/tags do item.
   * Custo: zero — categoria → mecânicas direto.
   */
  const links: Array<{ slug: string; label: string }> = [];
  if (item.category === "weapon") {
    links.push(
      { slug: "damage-zones", label: "Damage Zones" },
      { slug: "weapon-noise", label: "Som de Armas" },
      { slug: "blood-shock-system", label: "Sangue × Shock" },
    );
  }
  if (item.category === "medical") {
    links.push(
      { slug: "blood-shock-system", label: "Sangue × Shock" },
      { slug: "blood-types", label: "Tipos Sanguíneos" },
    );
  }
  if (item.category === "clothing" || item.category === "container") {
    links.push(
      { slug: "stamina-system", label: "Estamina & Carga" },
      { slug: "weather-temperature", label: "Clima & Temperatura" },
      { slug: "inventory-tetris", label: "Inventário & Slots" },
    );
  }
  if (item.category === "consumable" && item.subcategory?.toLowerCase().includes("ve")) {
    links.push({ slug: "vehicle-checklist", label: "Ligar um Veículo" });
  }
  if (item.category === "ammo" || item.category === "magazine") {
    links.push({ slug: "weapon-noise", label: "Som de Armas" });
  }

  if (links.length === 0) return null;

  return (
    <section className="panel">
      <div className="panel-header">
        <span className="panel-header__title">Mecânicas Relacionadas</span>
      </div>
      <div className="panel-body flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.slug}
            href={`/sobrevivencia#${l.slug}`}
            className="badge badge--brass hover:bg-[var(--c-brass)]/30"
          >
            <i className="fi-rr-shield mr-1" />
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Spec({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="border border-[var(--c-border)] bg-[var(--c-bg)] p-3">
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--c-ash)] tracking-wider mb-1">
        <i className={`fi-rr-${icon}`} />
        {label.toUpperCase()}
      </div>
      <div className="text-[var(--c-bone)] font-stencil text-base">{value}</div>
    </div>
  );
}

function RelationsSection({ item }: { item: Item }) {
  const r = item.relations!;
  const groups: Array<{ title: string; tone: string; list?: { to: string; note?: string }[] }> = [
    { title: "Requer", tone: "var(--c-blood-bright)", list: r.requires },
    { title: "Compatível com", tone: "var(--c-olive-bright)", list: r.compatibleWith },
    { title: "Reparado por", tone: "var(--c-brass)", list: r.repairedBy },
    { title: "Repara", tone: "var(--c-brass)", list: r.repairs },
    { title: "Produz", tone: "var(--c-olive-bright)", list: r.yields },
  ];
  const visible = groups.filter((g) => g.list && g.list.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="panel">
      <div className="panel-header">
        <span className="panel-header__title">Cadeia de Relações</span>
        <span className="panel-header__meta">DATAMINER MODE</span>
      </div>
      <div className="panel-body grid md:grid-cols-2 gap-6">
        {visible.map((g) => (
          <div key={g.title}>
            <div
              className="text-xs font-mono tracking-widest mb-3"
              style={{ color: g.tone }}
            >
              ◆ {g.title.toUpperCase()}
            </div>
            <ul className="space-y-2">
              {g.list!.map((rel) => {
                const target = ITEMS_BY_SLUG[rel.to];
                if (!target) {
                  return (
                    <li
                      key={rel.to}
                      className="text-sm text-[var(--c-ash)] italic font-mono"
                    >
                      ? {rel.to}
                    </li>
                  );
                }
                return (
                  <li key={rel.to}>
                    <Link
                      href={`/itens/${target.slug}`}
                      className="block panel scan-on-hover px-3 py-2 hover:border-[var(--c-olive-bright)] flex items-center gap-3"
                    >
                      <i
                        className={`fi-rr-${target.icon} text-[var(--c-olive-bright)] text-lg`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[var(--c-bone)] truncate">
                          {target.name}
                        </div>
                        {rel.note && (
                          <div className="text-xs text-[var(--c-bone-dim)] truncate">
                            {rel.note}
                          </div>
                        )}
                      </div>
                      <i className="fi-rr-arrow-right text-[var(--c-bone-dim)] text-xs" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
