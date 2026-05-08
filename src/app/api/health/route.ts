import { NextResponse } from "next/server";

/**
 * Health check endpoint para Docker/Kubernetes liveness probes.
 * Retorna 200 OK + JSON com versão e uptime.
 *
 * GET /api/health
 */
export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "dayz-codex",
      version: process.env.npm_package_version ?? "unknown",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
