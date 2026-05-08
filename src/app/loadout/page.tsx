import { LoadoutCalculator } from "@/components/LoadoutCalculator";

export const metadata = {
  title: "Calculadora de Loadout",
};

export default function LoadoutPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">PESAGEM TÁTICA</span>
        <h1>Calculadora de Loadout</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Monte seu setup, veja peso total e tier de stamina. Salva no
          localStorage — recupere quando voltar.
        </p>
        <p className="text-xs text-[var(--c-ash)] mt-2 font-mono">
          ≤15kg = full sprint · 15-25kg = -25% regen · 25-40kg = -50% · 40+ = inviável
        </p>
      </header>
      <LoadoutCalculator />
    </div>
  );
}
