import Link from "next/link";
import { fetchDayZServers, type DayZServer } from "@/lib/battlemetrics";
import { ServerBrowser } from "@/components/ServerBrowser";

export const metadata = {
  title: "Servidores DayZ",
  description:
    "Browser ao vivo dos servidores DayZ via BattleMetrics — filtre por país, pop, oficial.",
};

// ISR: regenera a cada 5 min em prod; em dev cada request
export const revalidate = 300;

export default async function ServidoresPage() {
  const { servers } = await fetchDayZServers({ limit: 50, sort: "-players" });

  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">BROWSER · DADOS AO VIVO</span>
        <h1>Servidores DayZ</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Top 50 servidores online via BattleMetrics. Atualiza a cada 5 min.
          Busca client-side; clique no nome pra detalhes (mods, descrição, conectar).
        </p>
        <p className="text-xs text-[var(--c-ash)] mt-2">
          Fonte: <span className="font-mono">api.battlemetrics.com</span> · sem
          tracking de jogador, só metadados públicos do servidor.
        </p>
      </header>

      {servers.length === 0 ? (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-header__title">Indisponível</span>
          </div>
          <div className="panel-body">
            <p className="text-sm text-[var(--c-bone-dim)]">
              Não foi possível buscar dados de BattleMetrics agora. Pode ser
              rate-limit ou API offline. Tente em alguns minutos.
            </p>
          </div>
        </div>
      ) : (
        <ServerBrowser initialServers={servers} />
      )}

      <section className="panel panel--cut">
        <div className="panel-header">
          <span className="panel-header__title">Como conectar</span>
        </div>
        <div className="panel-body text-sm space-y-2 text-[var(--c-bone-dim)]">
          <p>
            Clique em <span className="font-mono text-[var(--c-olive-bright)]">CONECTAR</span> no
            card do servidor pra abrir o Steam direto. Steam precisa estar
            rodando e DayZ instalado.
          </p>
          <p>
            Servidores com cadeado <span className="font-mono">[PWD]</span> exigem senha — peça no
            Discord do server.
          </p>
        </div>
      </section>

      <div className="text-xs text-[var(--c-ash)] font-mono">
        ATUALIZADO {new Date().toISOString().slice(0, 16).replace("T", " · ")}
      </div>
    </div>
  );
}

export type { DayZServer };
