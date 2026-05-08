import { InteractiveMap } from "@/components/InteractiveMap";

export const metadata = {
  title: "Mapa Interativo",
};

export default function InteractiveMapPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">RECONHECIMENTO TÁTICO</span>
        <h1>Mapa Interativo</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Marcadores pré-carregados de zonas de loot, polícia, hospital e
          contaminação. Clique no mapa para adicionar seus próprios spots
          (stashes, bases, pontos de encontro). Tudo salvo localmente no seu
          browser — sem servidor, sem sincronização externa.
        </p>
      </header>
      <InteractiveMap />
    </div>
  );
}
