import { WeaponCompare } from "@/components/WeaponCompare";

export const metadata = {
  title: "Comparar Armas",
};

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">ANÁLISE COMPARATIVA</span>
        <h1>Comparador de Armas</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Selecione até 4 armas e veja stats lado a lado. Vencedor de cada
          métrica destacado em verde.
        </p>
      </header>
      <WeaponCompare />
    </div>
  );
}
