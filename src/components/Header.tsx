"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalSearch } from "./GlobalSearch";

const NAV = [
  { href: "/itens", label: "Itens", icon: "boxes" },
  { href: "/crafting", label: "Crafting", icon: "tools" },
  { href: "/sobrevivencia", label: "Sobrevivência", icon: "band-aid" },
  { href: "/base-building", label: "Base", icon: "fence" },
  { href: "/mapas", label: "Mapas", icon: "map" },
  { href: "/mapa-interativo", label: "Tático", icon: "map-marker" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--c-border)] bg-[var(--c-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0"
          aria-label="DayZ Codex — home"
        >
          <span
            className="flex h-9 w-9 items-center justify-center border border-[var(--c-border-strong)] bg-[var(--c-surface-2)] group-hover:border-[var(--c-olive-bright)] transition-colors"
            aria-hidden
          >
            <i className="fi-rr-shield-check text-[var(--c-olive-bright)] text-lg" />
          </span>
          <span className="font-stencil text-base sm:text-lg tracking-[0.2em] text-[var(--c-bone)]">
            DAYZ <span className="text-[var(--c-olive-bright)]">CODEX</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4 flex-1">
          {NAV.map((it) => {
            const active = pathname?.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`nav-link ${active ? "active" : ""}`}
              >
                <i className={`fi-rr-${it.icon} mr-2 text-xs`} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <GlobalSearch />
        </div>
      </div>

      {/* Mobile nav scrollable */}
      <nav className="md:hidden border-t border-[var(--c-border)] overflow-x-auto no-scrollbar">
        <div className="flex gap-1 px-3 py-1.5">
          {NAV.map((it) => {
            const active = pathname?.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`nav-link whitespace-nowrap ${active ? "active" : ""}`}
              >
                <i className={`fi-rr-${it.icon} mr-1.5 text-xs`} />
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
