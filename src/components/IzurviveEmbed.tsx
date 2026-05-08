"use client";

import { useState } from "react";

/**
 * Embed do iZurvive — referência oficial da comunidade DayZ com TODOS os
 * spawn points reais (M4, AKM, Plate Carrier, veículos, animals, etc).
 * iZurvive não envia X-Frame-Options nem CSP frame-ancestors, então o
 * iframe carrega normalmente.
 *
 * Nota: nossa CSP de produção em /next.config.ts permite frame-ancestors
 * só do nosso origin — não bloqueia frames pra fora. Já o iZurvive precisa
 * permitir ser embedded; eles permitem (sem X-Frame).
 */

const MAPS = [
  { slug: "chernarusplus", name: "Chernarus +" },
  { slug: "chernarusplussatmap", name: "Chernarus + (Satélite)" },
  { slug: "livonia", name: "Livonia" },
  { slug: "sakhal", name: "Sakhal" },
  { slug: "namalsk", name: "Namalsk (mod)" },
  { slug: "deer-isle", name: "Deer Isle (mod)" },
  { slug: "esseker", name: "Esseker (mod)" },
] as const;

type MapSlug = (typeof MAPS)[number]["slug"];

export function IzurviveEmbed() {
  const [active, setActive] = useState<MapSlug>("chernarusplus");

  return (
    <div className="space-y-4">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-header__title">iZurvive · Mapa Oficial</span>
          <span className="panel-header__meta">FONTE: izurvive.com</span>
        </div>
        <div className="panel-body space-y-3">
          <p className="text-sm text-[var(--c-bone-dim)] leading-relaxed">
            Mapa interativo da comunidade com <strong>todos os spawn points</strong> reais
            (loot, veículos, animais, contaminação, marker custom). Use o painel do iZurvive
            (canto superior esquerdo) pra filtrar categorias e o ícone <em>Settings</em>
            pra escolher idioma e densidade.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-xs text-[var(--c-ash)] tracking-widest mr-2 self-center">
              MAPA:
            </span>
            {MAPS.map((m) => (
              <button
                key={m.slug}
                onClick={() => setActive(m.slug)}
                className={`badge cursor-pointer ${active === m.slug ? "badge--olive" : ""}`}
              >
                {m.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="border border-[var(--c-border)] bg-[var(--c-bg-deep)] relative overflow-hidden"
        style={{ height: "80vh", minHeight: 600, isolation: "isolate" }}
      >
        <iframe
          key={active}
          src={`https://www.izurvive.com/${active}/`}
          title={`iZurvive ${active}`}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
          // sandbox restritivo — bloqueia top navigation, popups, downloads
          // mas permite scripts (necessário pra map viewer) e same-origin
          // (necessário pra app interna deles)
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups-to-escape-sandbox"
        />
      </div>

      <p className="text-xs text-[var(--c-ash)] text-center">
        iZurvive é um projeto da comunidade. Use a versão oficial em{" "}
        <a
          href={`https://www.izurvive.com/${active}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--c-olive-bright)] hover:underline"
        >
          izurvive.com/{active}
        </a>{" "}
        se preferir.
      </p>
    </div>
  );
}
