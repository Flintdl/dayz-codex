import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDayZServer, steamConnectUrl } from "@/lib/battlemetrics";
import { ServerModRecommendations } from "@/components/ServerModRecommendations";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  // Não vaza ID inválido pro título — sanitize na borda
  if (!/^[0-9]{1,20}$/.test(id)) return { title: "Servidor" };
  const server = await fetchDayZServer(id);
  return {
    title: server ? `${server.name} · Servidor` : "Servidor",
  };
}

export default async function ServidorDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Defesa antes de qualquer fetch
  if (!/^[0-9]{1,20}$/.test(id)) notFound();

  const server = await fetchDayZServer(id);
  if (!server) notFound();

  const steamUrl = steamConnectUrl(server);
  const popPct = server.maxPlayers > 0 ? (server.players / server.maxPlayers) * 100 : 0;

  return (
    <div className="space-y-6">
      <nav className="text-xs font-mono text-[var(--c-ash)]">
        <Link href="/servidores" className="hover:text-[var(--c-olive-bright)]">
          ← BROWSER
        </Link>
      </nav>

      <header className="space-y-3">
        <span className="tape-label inline-block">SERVIDOR · ID {server.id}</span>
        <h1 className="text-[var(--c-bone)]">{server.name}</h1>
        <div className="flex flex-wrap gap-2">
          {server.official && <span className="badge badge--olive">OFICIAL</span>}
          {server.firstPersonOnly && <span className="badge">1PP HARDCORE</span>}
          {server.passworded && (
            <span className="badge" style={{ borderColor: "var(--c-brass)" }}>
              PASSWORD-PROTECTED
            </span>
          )}
          <span className="badge">{server.status.toUpperCase()}</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Visão Geral</span>
            </div>
            <div className="panel-body grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="JOGADORES" value={`${server.players}/${server.maxPlayers}`} />
              <Stat label="OCUPAÇÃO" value={`${popPct.toFixed(0)}%`} />
              <Stat label="MAPA" value={server.map} />
              <Stat label="HORA IN-GAME" value={server.time || "—"} />
              {server.country && <Stat label="PAÍS" value={server.country} />}
              {server.version && <Stat label="VERSÃO" value={server.version} />}
              {server.rank !== null && <Stat label="RANK BM" value={`#${server.rank}`} />}
            </div>
          </section>

          {server.description && (
            <section className="panel">
              <div className="panel-header">
                <span className="panel-header__title">Descrição</span>
                <span className="panel-header__meta">DO ADMIN</span>
              </div>
              <div className="panel-body">
                <p className="text-sm text-[var(--c-bone-dim)] whitespace-pre-line leading-relaxed">
                  {server.description}
                </p>
              </div>
            </section>
          )}

          {server.modNames.length > 0 && (
            <section className="panel">
              <div className="panel-header">
                <span className="panel-header__title">
                  Mods · {server.modNames.length}
                </span>
              </div>
              <div className="panel-body">
                <div className="flex flex-wrap gap-1.5">
                  {server.modNames.map((m, i) => (
                    <span
                      key={`${m}-${i}`}
                      className="text-xs font-mono px-2 py-1 border border-[var(--c-border)] text-[var(--c-bone-dim)]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {server.modNames.length > 0 && (
            <ServerModRecommendations modNames={server.modNames} />
          )}
        </div>

        <aside className="space-y-4">
          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Conectar</span>
            </div>
            <div className="panel-body space-y-3">
              {steamUrl ? (
                <>
                  <a
                    href={steamUrl}
                    rel="external nofollow"
                    className="btn h-10 w-full"
                  >
                    <i className="fi-rr-gamepad" />
                    ABRIR NO STEAM
                  </a>
                  <p className="text-xs text-[var(--c-bone-dim)] font-mono">
                    Endereço: <span className="text-[var(--c-bone)]">{server.connect}</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--c-bone-dim)] italic">
                  Servidor não expõe endpoint público de conexão direta. Procure
                  na busca interna do DayZ.
                </p>
              )}
              {server.passworded && (
                <p className="text-xs text-[var(--c-brass)] font-mono">
                  ⚠ Requer senha — peça no Discord oficial do server.
                </p>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="panel-header__title">Fonte</span>
            </div>
            <div className="panel-body text-xs text-[var(--c-bone-dim)] font-mono space-y-1">
              <p>BattleMetrics ID</p>
              <p className="text-[var(--c-bone)]">{server.id}</p>
              <a
                href={`https://www.battlemetrics.com/servers/dayz/${server.id}`}
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="text-[var(--c-olive-bright)] hover:underline block mt-2"
              >
                Abrir em BattleMetrics ↗
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[0.6rem] font-mono text-[var(--c-ash)] tracking-widest mb-1">
        {label}
      </div>
      <div className="text-[var(--c-bone)] font-stencil text-base tracking-wide">
        {value}
      </div>
    </div>
  );
}
