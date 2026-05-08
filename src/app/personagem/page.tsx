import { CharacterSheet } from "@/components/CharacterSheet";

export const metadata = {
  title: "Meu Personagem",
};

export default function CharacterPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">FICHA OPERACIONAL</span>
        <h1>Meu Personagem</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Ficha manual do seu personagem — equipamento por slot, inventário,
          notas, snapshots datados. Salvo no seu browser. Compartilhe via
          link.
        </p>
        <p className="text-xs text-[var(--c-ash)] mt-2">
          Update manual após cada sessão. Por enquanto não tem auto-import — DayZ não expõe API pública.
        </p>
      </header>
      <CharacterSheet />
    </div>
  );
}
