import { ITEMS, CATEGORY_META } from "@/data/items";
import { ItemsBrowser } from "./ItemsBrowser";

export const metadata = {
  title: "Catálogo de Itens",
};

export default function ItemsPage() {
  // Agrupa por categoria
  const grouped = CATEGORY_META.map((cat) => ({
    ...cat,
    items: ITEMS.filter((it) => it.category === cat.key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">SETOR ALMOXARIFADO</span>
        <h1>Catálogo de Itens</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          {ITEMS.length} itens vanilla catalogados. Filtre por categoria,
          raridade ou texto. Clique pra ver stats, relações e cadeia de
          dependências.
        </p>
      </header>

      <ItemsBrowser groups={grouped} />
    </div>
  );
}
