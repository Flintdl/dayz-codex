import { NextResponse } from "next/server";
import { fetchDayZServer } from "@/lib/battlemetrics";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/**
 * GET /api/servers/[id]
 *
 * Detalhe de um servidor. ID validado contra regex numérica antes de qualquer
 * I/O. Rate-limit 30 req/min por IP.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, ctx: RouteContext) {
  const { id } = await ctx.params;

  // 1. Valida ID na borda — defesa antes de qualquer fetch
  if (typeof id !== "string" || !/^[0-9]{1,20}$/.test(id)) {
    return NextResponse.json(
      { error: "invalid_id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // 2. Rate-limit
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

  const server = await fetchDayZServer(id);
  if (!server) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { server },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    },
  );
}
