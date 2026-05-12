import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchDayZServers } from "@/lib/battlemetrics";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/**
 * GET /api/servers
 *
 * Proxy seguro pra BattleMetrics. Validação Zod estrita, rate-limit por IP,
 * resposta cacheável (CDN amigável).
 *
 * Query params permitidos:
 *  - q (busca, 0-40 chars, letras/números/espaço/-_.)
 *  - country (ISO alpha-2)
 *  - limit (1-100)
 *  - sort (-players|players|rank|-rank|name)
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const QuerySchema = z.object({
  q: z.string().max(40).optional(),
  country: z.string().length(2).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(["-players", "players", "rank", "-rank", "name"]).optional(),
});

export async function GET(request: Request) {
  // 1. Rate-limit por IP (30 req/min)
  const limit = rateLimit(clientKey(request.headers), 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  // 2. Validação Zod do query
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_query", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // 3. Fetch validado e sanitizado
  const { servers, nextPage } = await fetchDayZServers(parsed.data);

  return NextResponse.json(
    { servers, nextPage, count: servers.length },
    {
      status: 200,
      headers: {
        // Cache no edge/CDN — 5min fresh, 60s stale-while-revalidate
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    },
  );
}
