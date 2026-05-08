export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--c-border)] bg-[var(--c-bg)]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-stencil tracking-[0.2em] text-[var(--c-bone)] mb-2">
            DAYZ CODEX
          </div>
          <p className="text-[var(--c-bone-dim)] leading-relaxed">
            Guia de campo offline para sobreviventes de Chernarus, Livonia e
            Sakhal. Itens, crafting, mecânicas de saúde, base building e
            zonas de loot — uma única referência.
          </p>
        </div>
        <div>
          <div className="font-stencil text-xs tracking-[0.2em] text-[var(--c-ash)] mb-3">
            REFERÊNCIAS
          </div>
          <ul className="space-y-1.5 text-[var(--c-bone-dim)]">
            <li>
              <i className="fi-rr-circle-small mr-2 text-[var(--c-olive)]" />
              DayZ vanilla 1.27
            </li>
            <li>
              <i className="fi-rr-circle-small mr-2 text-[var(--c-olive)]" />
              Bohemia Interactive (jogo)
            </li>
            <li>
              <i className="fi-rr-circle-small mr-2 text-[var(--c-olive)]" />
              Comunidade DayZ Wiki / iZurvive
            </li>
          </ul>
        </div>
        <div>
          <div className="font-stencil text-xs tracking-[0.2em] text-[var(--c-ash)] mb-3">
            STATUS DO MANUAL
          </div>
          <div className="space-y-2 text-[var(--c-bone-dim)] font-mono text-xs">
            <div className="flex justify-between">
              <span>VERSÃO</span>
              <span className="text-[var(--c-bone)]">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>BUILD</span>
              <span className="text-[var(--c-bone)]">CAMPO-PROTOTIPO</span>
            </div>
            <div className="flex justify-between">
              <span>CLASSIF.</span>
              <span className="text-[var(--c-blood-bright)]">RESTRITO</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--c-border)] py-3 text-center text-[var(--c-ash)] text-xs font-mono tracking-widest">
        // STAY FROSTY //
      </div>
    </footer>
  );
}
