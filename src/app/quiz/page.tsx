import { QuizApp } from "@/components/QuizApp";

export const metadata = {
  title: "Quiz de Sobrevivência",
};

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tape-label mb-3 inline-block">TESTE DE CAMPO</span>
        <h1>Quiz de Sobrevivência</h1>
        <p className="text-[var(--c-bone-dim)] mt-3 max-w-2xl">
          Cenários reais — escolha sua resposta e veja a explicação detalhada
          do porquê. Boa pra polir reflexos antes de entrar no server.
        </p>
      </header>
      <QuizApp />
    </div>
  );
}
