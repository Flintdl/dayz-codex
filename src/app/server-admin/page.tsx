export const metadata = {
  title: "Server Admin",
};

export default function ServerAdminPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="tape-label mb-3 inline-block">PROTOCOLO ADMIN</span>
        <h1>Server Admin Pack</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Configuração básica de server vanilla self-hosted — types.xml, events.xml,
          serverDZ.cfg, command-line params. Foco no essencial.
        </p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">types.xml — Loot Economy</span>
        </div>
        <div className="panel-body space-y-3 text-sm text-[var(--c-bone-dim)]">
          <p>
            Define cada item: nominal (alvo no mapa), min (pra spawnar mais),
            lifetime (quando despawna), restrict (server config).
          </p>
          <pre className="bg-[var(--c-bg)] border border-[var(--c-border)] p-3 overflow-x-auto text-xs font-mono leading-relaxed text-[var(--c-bone)]">
{`<type name="M4-A1">
    <nominal>5</nominal>          <!-- alvo no map -->
    <lifetime>14400</lifetime>    <!-- 4h até despawn -->
    <restock>1800</restock>       <!-- 30min entre respawn -->
    <min>3</min>                  <!-- abaixo disso, força spawn -->
    <quantmin>-1</quantmin>
    <quantmax>-1</quantmax>
    <cost>100</cost>
    <flags count_in_cargo="0" count_in_hoarder="0"
           count_in_map="1" count_in_player="0"
           crafted="0" deloot="0" />
    <category name="weapons"/>
    <usage name="Military"/>
    <value name="Tier3"/>
    <value name="Tier4"/>
</type>`}
          </pre>
          <p className="text-xs">
            Aumentar nominal → mais items no mapa. Reduzir lifetime → loot rota mais
            rápido. Tier define em qual zona spawna (Tier3 = NWAF, Tier4 = Tisy).
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">serverDZ.cfg</span>
        </div>
        <div className="panel-body">
          <pre className="bg-[var(--c-bg)] border border-[var(--c-border)] p-3 overflow-x-auto text-xs font-mono leading-relaxed text-[var(--c-bone)]">
{`hostname     = "Meu Server DayZ Vanilla";
password     = "";          // sem senha = público
passwordAdmin = "MUDAR-AQUI"; // senha de RCon
maxPlayers   = 60;
verifySignatures = 2;       // anti-cheat sigs
disableVoN   = 0;            // 0 = voice on
vonCodecQuality = 30;
disable3rdPerson = 0;        // 1 = hardcore (1PP)
disableCrosshair = 0;
serverTime  = "SystemTime";
serverTimeAcceleration = 16; // 16:1 daycycle (default)
serverNightTimeAcceleration = 1;
serverTimePersistent = 1;
guaranteedUpdates = 1;
loginQueueConcurrentPlayers = 5;
loginQueueMaxPlayers = 500;
instanceId = 1;              // 1=Public Hive, >1 = Private
storageAutoFix = 1;
respawnTime = 5;
class Missions {
    class DayZ {
        template = "dayzOffline.chernarusplus"; // ou .enoch (Livonia), .sakhal
    };
};`}
          </pre>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Command-Line Params</span>
        </div>
        <div className="panel-body">
          <pre className="bg-[var(--c-bg)] border border-[var(--c-border)] p-3 overflow-x-auto text-xs font-mono text-[var(--c-bone)]">
{`./DayZServer \\
  -config=serverDZ.cfg \\
  -port=2302 \\
  -profiles=profiles \\
  -dologs -adminlog -netlog \\
  -freezecheck \\
  -BEpath=battleye \\
  -mod=@CommunityFramework;@MyMod`}
          </pre>
          <ul className="bullet-mil text-sm text-[var(--c-bone-dim)] mt-3 space-y-1">
            <li><code className="font-mono text-[var(--c-bone)]">-port</code>: porta do server (default 2302). Firewall TCP+UDP.</li>
            <li><code className="font-mono text-[var(--c-bone)]">-profiles</code>: pasta com logs.</li>
            <li><code className="font-mono text-[var(--c-bone)]">-dologs -adminlog</code>: gera scripts.log + admin.log essencial.</li>
            <li><code className="font-mono text-[var(--c-bone)]">-mod=</code>: lista de mods server-side (separados por <code>;</code>).</li>
            <li><code className="font-mono text-[var(--c-bone)]">-servermod=</code>: mods só no server (admin tools).</li>
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">events.xml — Dynamic Events</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-3">
          <p>Controla heli crashes, contamination zones, infected hordes.</p>
          <pre className="bg-[var(--c-bg)] border border-[var(--c-border)] p-3 overflow-x-auto text-xs font-mono text-[var(--c-bone)]">
{`<event name="StaticHeliCrash">
    <nominal>3</nominal>
    <min>2</min>
    <max>4</max>
    <lifetime>900</lifetime>     <!-- 15min até despawn loot -->
    <restock>0</restock>
    <saferadius>1500</saferadius>
    <distanceradius>1000</distanceradius>
    <cleanupradius>50</cleanupradius>
    <position>fixed</position>
</event>`}
          </pre>
          <p className="text-xs">
            Aumentar nominal/max → mais helis simultâneos. Reduzir saferadius → spawn
            perto de cidades.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Persistence</span>
        </div>
        <div className="panel-body text-sm text-[var(--c-bone-dim)] space-y-2">
          <ul className="bullet-mil space-y-1">
            <li>Itens em containers (tents, crates): lifetime 30 dias se interagidos.</li>
            <li>Veículos: lifetime se driver/passageiro entrou recente.</li>
            <li>Builds (fences, watchtowers): lifetime 45 dias após interação.</li>
            <li>Lock pra forçar reset: <code>storage_*</code> backup em <code>profiles/storage_1/</code>.</li>
          </ul>
          <p className="text-xs text-[var(--c-blood-bright)]">
            ATENÇÃO: deletar <code>storage_1/</code> apaga TODA persistência. Faça backup.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Hardware Recommended</span>
        </div>
        <div className="panel-body">
          <table className="field-table">
            <thead>
              <tr><th>Players</th><th>CPU</th><th>RAM</th><th>Storage</th></tr>
            </thead>
            <tbody>
              <tr><td>1-20 (PvE casual)</td><td>4 cores 3.5GHz+</td><td>8GB</td><td>40GB SSD</td></tr>
              <tr><td>20-40</td><td>6 cores 4.0GHz+</td><td>16GB</td><td>80GB SSD</td></tr>
              <tr><td>40-60 (vanilla limit)</td><td>8 cores 4.5GHz+</td><td>32GB</td><td>120GB NVMe</td></tr>
              <tr><td>60-100 (modded)</td><td>10 cores 5GHz+</td><td>64GB</td><td>200GB NVMe</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-[var(--c-bone-dim)] mt-3">
            DayZ é single-thread heavy — clock speed importa mais que cores.
            Latência server ≤30ms ideal pra PvP responsivo.
          </p>
        </div>
      </section>
    </div>
  );
}
