import { IzurviveEmbed } from "@/components/IzurviveEmbed";

export const metadata = {
  title: "Mapa Oficial (iZurvive)",
};

export default function OfficialMapPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">FONTE PRIMÁRIA</span>
        <h1>Mapa Oficial · iZurvive</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-3xl">
          Mapa interativo da comunidade com dados reais do jogo: cada spawn de
          loot (armas, médico, militar, veículos), zonas de contaminação,
          missões dinâmicas e mais. Mantido pela comunidade DayZ desde 2014.
        </p>
        <p className="text-[var(--c-bone-dim)] mt-2 max-w-3xl text-sm">
          Para o seu manual personalizado com markers próprios e cadeia de
          loot por tier, use{" "}
          <a href="/mapa-interativo" className="text-[var(--c-olive-bright)] hover:underline">
            /mapa-interativo
          </a>
          .
        </p>
      </header>
      <IzurviveEmbed />
    </div>
  );
}
