/**
 * Rate limiter em memória (sliding window) — bom o suficiente pra single-instance.
 *
 * Para multi-instance (Vercel edge + multiple regions) trocar por Upstash/KV.
 * Aqui é defesa contra burst, não DDoS — o CDN/edge é a 1ª linha.
 *
 * Decisões:
 *  - Map com cleanup periódico (a cada 5 min) pra não vazar memória
 *  - Key padrão = IP do cliente (header `x-forwarded-for` primeira entrada,
 *    fallback x-real-ip, fallback "unknown" — bloqueia "unknown" no agregado)
 *  - Limite default: 30 req/min por IP nas rotas BM
 */

type Window = { count: number; reset: number };
const STORE = new Map<string, Window>();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

let cleanupHandle: ReturnType<typeof setInterval> | null = null;
function ensureCleanup() {
  if (cleanupHandle) return;
  // Só inicia em runtime Node; Edge runtime não tem setInterval persistente
  if (typeof setInterval !== "function") return;
  cleanupHandle = setInterval(() => {
    const now = Date.now();
    for (const [k, w] of STORE) {
      if (w.reset < now) STORE.delete(k);
    }
  }, CLEANUP_INTERVAL_MS);
  // Não impede process.exit
  if (cleanupHandle && typeof cleanupHandle.unref === "function") {
    cleanupHandle.unref();
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Quanto falta pro reset (ms) */
  retryAfterMs: number;
  remaining: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  ensureCleanup();
  if (!key || typeof key !== "string") {
    return { ok: false, retryAfterMs: windowMs, remaining: 0 };
  }
  const now = Date.now();
  const safeKey = key.slice(0, 80);
  const cur = STORE.get(safeKey);
  if (!cur || cur.reset < now) {
    STORE.set(safeKey, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfterMs: 0, remaining: limit - 1 };
  }
  if (cur.count >= limit) {
    return { ok: false, retryAfterMs: cur.reset - now, remaining: 0 };
  }
  cur.count += 1;
  return { ok: true, retryAfterMs: 0, remaining: limit - cur.count };
}

/**
 * Extrai IP cliente de headers. Em Vercel/Cloudflare, `x-forwarded-for` é
 * a fonte autoritativa (o edge garante que não pode ser spoofado pelo cliente).
 * Em self-host atrás de reverse proxy, configure o proxy pra setar este header.
 */
export function clientKey(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && /^[0-9a-fA-F.:]{3,45}$/.test(first)) return `ip:${first}`;
  }
  const real = headers.get("x-real-ip");
  if (real && /^[0-9a-fA-F.:]{3,45}$/.test(real)) return `ip:${real}`;
  // Sem IP confiável — agregamos em bucket "unknown" pra não dar bypass
  return "ip:unknown";
}
