import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel panel--cut max-w-xl mx-auto mt-16">
      <div className="panel-header">
        <span className="panel-header__title">SINAL PERDIDO</span>
        <span className="panel-header__meta">404</span>
      </div>
      <div className="panel-body space-y-4 text-center py-10">
        <span className="stamp">EVAC NEGADA</span>
        <h2>Setor não localizado</h2>
        <p className="text-[var(--c-bone-dim)]">
          Esta rota não consta no manual. Volte ao QG e tente outra.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/" className="btn">
            <i className="fi-rr-home" /> QG
          </Link>
          <Link href="/itens" className="btn btn--ghost">
            <i className="fi-rr-boxes" /> Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
