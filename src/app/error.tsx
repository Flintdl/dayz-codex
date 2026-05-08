"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="panel panel--cut max-w-xl mx-auto mt-16">
      <div className="panel-header">
        <span className="panel-header__title">FALHA DE SISTEMA</span>
        <span className="panel-header__meta">{error.digest ?? "ERR"}</span>
      </div>
      <div className="panel-body space-y-4 text-center py-10">
        <span className="stamp">SINAL CORROMPIDO</span>
        <h2>Erro inesperado</h2>
        <p className="text-[var(--c-bone-dim)] text-sm">
          {error.message || "Ocorreu uma falha. Tente novamente."}
        </p>
        <button onClick={reset} className="btn">
          <i className="fi-rr-refresh" /> Reconectar
        </button>
      </div>
    </div>
  );
}
