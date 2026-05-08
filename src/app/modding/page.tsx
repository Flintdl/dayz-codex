export const metadata = {
  title: "Modding Básico",
};

export default function ModdingPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">EXTENSÃO COMUNITÁRIA</span>
        <h1>Modding Básico</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          DayZ tem um dos ecossistemas de mod mais ricos. Como instalar
          (client+server), conflitos comuns, mods essenciais.
        </p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Steam Workshop (Client)</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-3">
          <ol className="bullet-mil space-y-2">
            <li>Steam → Library → DayZ → DayZ Launcher.</li>
            <li>Aba <strong>Mods</strong> → busca/subscribe. Workshop URL: <code className="font-mono">steamcommunity.com/app/221100/workshop/</code></li>
            <li>Subscribe → launcher baixa automaticamente em <code>steamapps/workshop/content/221100/&lt;modID&gt;</code></li>
            <li>Ao entrar em server modado, launcher detecta mods faltando e oferece subscribe automático.</li>
          </ol>
          <p className="text-xs">
            Mods grandes (Expansion, Namalsk) podem ter 1-3GB cada. Tenha SSD com espaço.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Mods Essenciais</span>
        </div>
        <div className="panel-body">
          <table className="field-table">
            <thead>
              <tr><th>Mod</th><th>O que faz</th><th>Tipo</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>CommunityFramework</strong></td>
                <td>Base API que outros mods dependem. Quase obrigatório.</td>
                <td>Library</td>
              </tr>
              <tr>
                <td><strong>DayZ-Expansion</strong></td>
                <td>Pacote gigante: helicópteros, traders, party, market, banco, missions.</td>
                <td>Total Conversion</td>
              </tr>
              <tr>
                <td><strong>BaseBuildingPlus (BBP)</strong></td>
                <td>Construções avançadas: paredes finas, portas, garagem, decoração.</td>
                <td>Base Building</td>
              </tr>
              <tr>
                <td><strong>CodeLock</strong></td>
                <td>Cadeados de código moderno (display real, não só combination guess).</td>
                <td>QoL</td>
              </tr>
              <tr>
                <td><strong>Trader</strong></td>
                <td>NPC trader com economia de moeda. Comprar/vender items.</td>
                <td>Economy</td>
              </tr>
              <tr>
                <td><strong>VPP Admin Tools</strong></td>
                <td>Painel admin com teleport, spawn item, ban, log viewer.</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td><strong>Namalsk Island</strong></td>
                <td>Mapa frio com mecânica anomalia/blowout. PvE intenso.</td>
                <td>Map</td>
              </tr>
              <tr>
                <td><strong>Deer Isle</strong></td>
                <td>Mapa custom 163 km², múltiplos biomas.</td>
                <td>Map</td>
              </tr>
              <tr>
                <td><strong>MMG Pouches</strong></td>
                <td>Pouches modulares pra Plate Carrier (military realism).</td>
                <td>Gear</td>
              </tr>
              <tr>
                <td><strong>RaG Bicycle Mod</strong></td>
                <td>Bicicletas — mobilidade silenciosa sem combustível.</td>
                <td>Vehicle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Server-side Mods</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-3">
          <p>
            Mods de server (não exigem download client) — ficam em <code>-servermod=</code>:
          </p>
          <ul className="bullet-mil space-y-1">
            <li><strong>VPPAdminTools</strong>: painel admin in-game.</li>
            <li><strong>BasicMap</strong>: marcador de mapa para players.</li>
            <li><strong>Custom types.xml mod</strong>: economia tunada sem reupload.</li>
          </ul>
          <p className="text-xs">
            Convenção: client mods em <code>-mod=</code>, server-only em <code>-servermod=</code>. Lista separada por <code>;</code>.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Conflitos Comuns</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-3">
          <ul className="bullet-mil space-y-1">
            <li>2 mods que sobrescrevem mesmo arquivo (config.cpp, scripts) → último carrega vence + crash.</li>
            <li>Mod desatualizado depois de update vanilla → crash no startup.</li>
            <li>Versão mod cliente ≠ versão server → connection refused com erro de signatures.</li>
            <li>Limite de classnames (~5000) — mods muito gordos somados estouram.</li>
            <li>Mods de UI conflitando → HUD invisível ou duplicado.</li>
          </ul>
          <p className="text-xs text-[var(--c-blood-bright)]">
            Solução universal: ler <code>scripts.log</code> em <code>profiles/</code> — mostra
            classname duplicada / arquivo conflitante.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Workshop Loops & Best Practices</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-2">
          <ul className="bullet-mil space-y-1">
            <li>Use launcher pra atualizar — não baixe manualmente do GitHub.</li>
            <li>Crie modlist de presets no launcher pra trocar entre servers.</li>
            <li>Servers sérios publicam <code>modlist.html</code> com versões pinadas.</li>
            <li>Antes de update vanilla: backup de mods + servidor stop. Re-test após.</li>
            <li>Modders usam <strong>Workbench Tools</strong> (Bohemia tools, free) pra desenvolver.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
