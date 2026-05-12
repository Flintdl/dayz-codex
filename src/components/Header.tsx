"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GlobalSearch } from "./GlobalSearch";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Itens primários — sempre visíveis (md+)
const PRIMARY: NavItem[] = [
  { href: "/itens", label: "Itens", icon: "boxes" },
  { href: "/crafting", label: "Crafting", icon: "tools" },
  { href: "/sobrevivencia", label: "Sobrev.", icon: "band-aid" },
  { href: "/base-building", label: "Base", icon: "fence" },
];

// Tudo o resto entra no megamenu "Mais"
const SECTIONS: NavSection[] = [
  {
    title: "Mapas",
    items: [
      { href: "/mapa-oficial", label: "iZurvive (oficial)", icon: "map-marker" },
      { href: "/mapa-interativo", label: "Tático (markers)", icon: "map" },
      { href: "/mapas", label: "Zonas (texto)", icon: "info" },
      { href: "/servidores", label: "Servidores ao vivo", icon: "globe" },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { href: "/personagem", label: "Meu Personagem", icon: "shield-check" },
      { href: "/loadout", label: "Calculadora Loadout", icon: "boxes" },
      { href: "/comparar", label: "Comparar Armas", icon: "search" },
      { href: "/dano", label: "Calculadora Dano", icon: "skull" },
    ],
  },
  {
    title: "Aprender",
    items: [
      { href: "/primeira-hora", label: "Primeira Hora", icon: "shield-check" },
      { href: "/glossario", label: "Glossário", icon: "info" },
      { href: "/quiz", label: "Quiz", icon: "info" },
      { href: "/timeline", label: "Timeline", icon: "info" },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/server-admin", label: "Server Admin", icon: "settings" },
      { href: "/modding", label: "Modding", icon: "tools" },
      { href: "/hosting", label: "Hosting", icon: "shield" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setMegaOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const moreActive = SECTIONS.some((s) =>
    s.items.some((i) => pathname?.startsWith(i.href)),
  );

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--c-border)] bg-[var(--c-bg)]/85 backdrop-blur-md">
      <div ref={navRef} className="mx-auto flex max-w-7xl items-center gap-2 px-3 sm:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="DayZ Codex">
          <span
            className="flex h-9 w-9 items-center justify-center border border-[var(--c-border-strong)] bg-[var(--c-surface-2)] group-hover:border-[var(--c-olive-bright)] transition-colors"
            aria-hidden
          >
            <i className="fi-rr-shield-check text-[var(--c-olive-bright)] text-lg" />
          </span>
          <span className="font-stencil text-base sm:text-lg tracking-[0.2em] text-[var(--c-bone)] hidden sm:inline">
            DAYZ <span className="text-[var(--c-olive-bright)]">CODEX</span>
          </span>
        </Link>

        {/* Desktop nav (md+) */}
        <nav className="hidden md:flex items-center gap-0.5 ml-2 lg:ml-4">
          {PRIMARY.map((it) => {
            const active = pathname?.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} className={`nav-link ${active ? "active" : ""}`}>
                <i className={`fi-rr-${it.icon} mr-1.5 text-xs`} />
                {it.label}
              </Link>
            );
          })}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMegaOpen(!megaOpen);
              }}
              className={`nav-link ${moreActive ? "active" : ""}`}
              aria-expanded={megaOpen}
              aria-haspopup="menu"
            >
              <i className="fi-rr-info mr-1.5 text-xs" />
              Mais
              <span className={`ml-1 text-[0.6rem] transition-transform ${megaOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {megaOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 4,
                  minWidth: 580,
                  maxWidth: "calc(100vw - 1rem)",
                  zIndex: 40,
                  background: "var(--c-bg)",
                  border: "1px solid var(--c-border-strong)",
                  boxShadow: "var(--shadow-panel)",
                }}
                className="animate-fade"
              >
                <div className="grid grid-cols-2 gap-px bg-[var(--c-border)]">
                  {SECTIONS.map((s) => (
                    <div
                      key={s.title}
                      className="bg-[var(--c-bg)] p-3"
                    >
                      <div className="text-[0.65rem] font-mono text-[var(--c-ash)] tracking-[0.2em] mb-2 px-2">
                        ◆ {s.title.toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        {s.items.map((sub) => {
                          const active = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              role="menuitem"
                              className={`flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-[var(--c-surface-3)] ${
                                active ? "text-[var(--c-olive-bright)]" : "text-[var(--c-bone)]"
                              }`}
                            >
                              <i className={`fi-rr-${sub.icon} text-[var(--c-olive-bright)] text-xs shrink-0`} />
                              <span className="truncate">{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Lado direito */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/favoritos"
            className="hidden sm:flex h-10 w-10 items-center justify-center border border-[var(--c-border)] hover:border-[var(--c-olive-bright)] text-[var(--c-bone)] hover:text-[var(--c-olive-bright)]"
            aria-label="Favoritos"
            title="Favoritos & Histórico"
          >
            <i className="fi-rr-shield-check" />
          </Link>
          <GlobalSearch />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center border border-[var(--c-border)] text-[var(--c-bone)]"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <i className={`fi-rr-${mobileOpen ? "skull" : "boxes"} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer (<md) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--c-border)] bg-[var(--c-bg)]/95 backdrop-blur-md max-h-[80vh] overflow-y-auto animate-fade">
          <div className="px-4 py-3 space-y-3">
            <div className="space-y-0.5">
              {PRIMARY.map((it) => {
                const active = pathname?.startsWith(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-2 py-2 px-3 ${
                      active ? "bg-[var(--c-olive)]/15 text-[var(--c-olive-bright)]" : "text-[var(--c-bone)]"
                    }`}
                  >
                    <i className={`fi-rr-${it.icon} text-xs`} />
                    <span className="font-stencil text-xs tracking-widest">
                      {it.label.toUpperCase()}
                    </span>
                  </Link>
                );
              })}
            </div>
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <div className="text-xs font-mono text-[var(--c-ash)] tracking-widest mb-1 px-3">
                  ◆ {s.title.toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  {s.items.map((sub) => {
                    const active = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`flex items-center gap-2 py-2 px-3 text-sm ${
                          active ? "bg-[var(--c-olive)]/15 text-[var(--c-olive-bright)]" : "text-[var(--c-bone-dim)]"
                        }`}
                      >
                        <i className={`fi-rr-${sub.icon} text-xs`} />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <Link
              href="/favoritos"
              className="flex items-center gap-2 py-2 px-3 text-[var(--c-bone)] border-t border-[var(--c-border)] mt-2 pt-3"
            >
              <i className="fi-rr-shield-check text-xs" />
              <span className="font-stencil text-xs tracking-widest">FAVORITOS & HISTÓRICO</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
