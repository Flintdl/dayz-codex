export const metadata = {
  title: "Hosting de Server",
};

export default function HostingPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">INFRA</span>
        <h1>Hosting de Server DayZ</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Como subir um server vanilla ou modded — preço por jogador, hardware,
          troubleshooting comum.
        </p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Opções de Hosting</span>
        </div>
        <div className="panel-body">
          <table className="field-table">
            <thead>
              <tr><th>Opção</th><th>Custo/mês</th><th>Pros</th><th>Contras</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>VPS Self-managed</strong> (Hetzner, OVH, Vultr)</td>
                <td>R$ 60-300</td>
                <td>Total controle, modlist livre, custo baixo</td>
                <td>Você administra Linux/Windows, configura firewall, atualiza</td>
              </tr>
              <tr>
                <td><strong>Game Server Provider</strong> (Nitrado, Host Havoc, GTXGaming)</td>
                <td>R$ 100-400</td>
                <td>1-click install, painel web, suporte oficial Bohemia</td>
                <td>Caro por slot, modlist limitada, lock-in</td>
              </tr>
              <tr>
                <td><strong>Home server</strong> (PC dedicado)</td>
                <td>R$ 30-100 (luz)</td>
                <td>Hardware potente acessível, sem mensalidade</td>
                <td>Internet residencial = ping ruim, IP dinâmico, downtime</td>
              </tr>
              <tr>
                <td><strong>Cloud (AWS/GCP)</strong></td>
                <td>R$ 200-800</td>
                <td>Escala instantânea, regiões globais</td>
                <td>Caríssimo pra game server. Egress bandwidth sangra preço.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Setup Linux (recomendado)</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-3">
          <ol className="bullet-mil space-y-2">
            <li>VPS Ubuntu 22.04+ com 4 vCPU, 8GB RAM, 80GB SSD.</li>
            <li>Instale SteamCMD: <code>apt install steamcmd</code>.</li>
            <li>Login anônimo, baixe DayZ Server: <code>app_update 223350</code>.</li>
            <li>Crie user dedicado <code>dayz</code> sem sudo (least privilege).</li>
            <li>Configure firewall (ufw): porta TCP+UDP 2302-2305.</li>
            <li>Crie systemd service pra auto-restart.</li>
            <li>Logs em <code>/home/dayz/profiles/</code> via journalctl.</li>
          </ol>
          <pre className="bg-[var(--c-bg)] border border-[var(--c-border)] p-3 overflow-x-auto text-xs font-mono text-[var(--c-bone)]">
{`# /etc/systemd/system/dayzserver.service
[Unit]
Description=DayZ Server
After=network.target

[Service]
Type=simple
User=dayz
WorkingDirectory=/home/dayz/server
ExecStart=/home/dayz/server/DayZServer \\
  -config=serverDZ.cfg -port=2302 \\
  -profiles=profiles -dologs -adminlog -netlog
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`}
          </pre>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Custos Reais (60 slots Brasil)</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-2">
          <ul className="bullet-mil">
            <li>VPS Hetzner CPX31 (4vCPU/8GB/160GB): <strong>~R$ 90/mês</strong></li>
            <li>VPS OVH Game Sao Paulo (8vCPU/16GB): <strong>~R$ 250/mês</strong></li>
            <li>Nitrado 60 slots Brasil: <strong>~R$ 380/mês</strong></li>
            <li>Hospedagem Brasil tier 3 (Locaweb): <strong>~R$ 200/mês</strong></li>
          </ul>
          <p className="text-xs">
            Servers competitivos têm múltiplas instâncias (pop high). Considere
            ainda licença BattlEye + RCon panel (gratuitos com instalação manual).
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Anti-Cheat & Segurança</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-2">
          <ul className="bullet-mil">
            <li><strong>BattlEye</strong>: oficial Bohemia. Filters em <code>battleye/scripts.txt</code>.</li>
            <li><strong>InfiSTAR</strong>: anti-cheat advanced (pago). Detecta script kiddies.</li>
            <li><strong>RCon</strong>: BERCon ou painel Web (DZSALauncher).</li>
            <li>Rate limit conexões via firewall. SSH chave-only.</li>
            <li>Backup persistence (storage_*) cada 6h.</li>
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Troubleshooting Comum</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)]">
          <table className="field-table">
            <thead>
              <tr><th>Sintoma</th><th>Causa</th><th>Solução</th></tr>
            </thead>
            <tbody>
              <tr><td>Server cai a cada ~2h</td><td>Memory leak / zumbi count</td><td>Restart auto cada 4h via cron</td></tr>
              <tr><td>Desync players</td><td>CPU saturada</td><td>Reduzir slots ou upgrade CPU</td></tr>
              <tr><td>Mod não carrega</td><td>Versão desatualizada</td><td>Update via launcher / manual</td></tr>
              <tr><td>Players kicked random</td><td>BattlEye filter agressivo</td><td>Whitelist em scripts.txt</td></tr>
              <tr><td>Loot não spawna</td><td>types.xml malformado</td><td>Validar XML; verificar scripts.log</td></tr>
              <tr><td>Persistence reset</td><td>storage_* corrompido</td><td>Restore backup + reduzir tickrate</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
