import Link from "next/link";
import type { Item, Rarity } from "@/data/types";
import { ItemImage } from "./ItemImage";

const RARITY_LABEL: Record<Rarity, string> = {
  common: "COMUM",
  uncommon: "INCOMUM",
  rare: "RARO",
  very_rare: "MUITO RARO",
  legendary: "ENDGAME",
};
const RARITY_BADGE: Record<Rarity, string> = {
  common: "badge",
  uncommon: "badge badge--olive",
  rare: "badge badge--brass",
  very_rare: "badge badge--blood",
  legendary: "badge badge--radiation",
};

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/itens/${item.slug}`}
      className="item-card scan-on-hover group focus:outline-none"
    >
      {item.subcategory && (
        <span className="item-card__tag">
          {item.subcategory.toUpperCase().slice(0, 16)}
        </span>
      )}
      <div className="flex items-center justify-center pt-2">
        <ItemImage slug={item.slug} icon={item.icon} alt={item.name} size="md" />
      </div>
      <div>
        <h3 className="text-[var(--c-bone)] font-stencil text-base tracking-wide leading-tight mb-1 group-hover:text-[var(--c-olive-bright)] transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-[var(--c-bone-dim)] leading-snug line-clamp-2">
          {item.summary}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-[var(--c-border)]/50">
        <span className={RARITY_BADGE[item.rarity]}>
          {RARITY_LABEL[item.rarity]}
        </span>
        {item.stats?.weightG !== undefined && (
          <span className="text-xs font-mono text-[var(--c-ash)]">
            {(item.stats.weightG / 1000).toFixed(2)}KG
          </span>
        )}
      </div>
    </Link>
  );
}
