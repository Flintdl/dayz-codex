import { DamageCalculator } from "@/components/DamageCalculator";

export const metadata = {
  title: "Calculadora de Dano",
};

export default function DamagePage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">BALÍSTICA</span>
        <h1>Calculadora de Dano</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Quantos tiros pra matar (TTK) baseado em arma + zona de impacto +
          armadura do alvo. Ranking comparativo no painel lateral.
        </p>
      </header>
      <DamageCalculator />
    </div>
  );
}
