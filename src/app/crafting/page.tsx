import Link from "next/link";
import { RECIPES } from "@/data/recipes";
import { ITEMS_BY_SLUG } from "@/data/items";
import type { Recipe } from "@/data/types";

export const metadata = {
  title: "Crafting & Receitas",
};

const CATEGORY_LABEL: Record<Recipe["category"], string> = {
  weapon: "ARMAS IMPROVISADAS",
  ammo: "MUNIÇÃO",
  tool: "FERRAMENTAS",
  base: "BASE BUILDING",
  food: "COZINHA & ÁGUA",
  medical: "MÉDICO",
  traversal: "TRAVERSAL",
  fire: "FOGO",
  clothing: "VESTUÁRIO",
};

export default function CraftingPage() {
  // Agrupa por categoria mantendo ordem do enum acima
  const order: Recipe["category"][] = [
    "fire",
    "food",
    "medical",
    "weapon",
    "ammo",
    "tool",
    "clothing",
    "base",
    "traversal",
  ];
  const byCat = order
    .map((cat) => ({
      cat,
      label: CATEGORY_LABEL[cat],
      list: RECIPES.filter((r) => r.category === cat),
    }))
    .filter((g) => g.list.length > 0);

  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">TÁTICAS DE CAMPO</span>
        <h1>Crafting & Receitas</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Receitas vanilla mais usadas. Cada input é navegável — clique pra
          abrir a ficha do item. Tempo aproximado em condições normais.
        </p>
      </header>

      <nav className="panel panel-body flex flex-wrap gap-2">
        {byCat.map((g) => (
          <a
            key={g.cat}
            href={`#${g.cat}`}
            className="badge badge--olive hover:bg-[var(--c-olive)]/30"
          >
            {g.label} · {g.list.length}
          </a>
        ))}
      </nav>

      {byCat.map((g) => (
        <section key={g.cat} id={g.cat} className="space-y-3 scroll-mt-24">
          <h2 className="flex items-center gap-2">
            <i className="fi-rr-tools text-[var(--c-olive-bright)]" />
            {g.label}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {g.list.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const out = ITEMS_BY_SLUG[recipe.output.itemSlug];
  return (
    <article id={recipe.slug} className="panel scroll-mt-24">
      <div className="panel-header">
        <span className="panel-header__title">
          → {recipe.output.qty}× {out?.name ?? recipe.output.itemSlug}
        </span>
        {recipe.durationS !== undefined && (
          <span className="panel-header__meta">
            ≈ {recipe.durationS < 60
              ? `${recipe.durationS}s`
              : `${Math.round(recipe.durationS / 60)}min`}
          </span>
        )}
      </div>
      <div className="panel-body space-y-4 text-sm">
        <p className="text-[var(--c-bone-dim)] leading-relaxed">
          {recipe.method}
        </p>

        {recipe.inputs.length > 0 && (
          <div>
            <div className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest mb-2">
              ◆ MATERIAIS
            </div>
            <ul className="space-y-1">
              {recipe.inputs.map((inp) => {
                const it = ITEMS_BY_SLUG[inp.itemSlug];
                return (
                  <li key={inp.itemSlug}>
                    {it ? (
                      <Link
                        href={`/itens/${inp.itemSlug}`}
                        className="flex items-center gap-2 text-[var(--c-bone)] hover:text-[var(--c-olive-bright)]"
                      >
                        <span className="badge badge--olive">{inp.qty}×</span>
                        <i className={`fi-rr-${it.icon} text-xs`} />
                        {it.name}
                      </Link>
                    ) : (
                      <span className="text-[var(--c-ash)] font-mono">
                        {inp.qty}× {inp.itemSlug}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {recipe.tools && recipe.tools.length > 0 && (
          <div>
            <div className="text-xs font-mono text-[var(--c-brass)] tracking-widest mb-2">
              ◆ FERRAMENTAS
            </div>
            <ul className="flex flex-wrap gap-2">
              {recipe.tools.map((t) => {
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
            </ul>
          </div>
        )}

        {recipe.notes && (
          <div className="border-l-2 border-[var(--c-blood)] pl-3 text-xs text-[var(--c-bone-dim)] italic">
            {recipe.notes}
          </div>
        )}
      </div>
    </article>
  );
}
