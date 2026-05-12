import { z } from "zod";

/**
 * Cliente BattleMetrics — SERVER-ONLY.
 *
 * Decisões de segurança:
 *  - API key (opcional) lida só de process.env; nunca exposta ao client.
 *  - Zod valida TODA resposta antes de propagar — protege contra mudança
 *    de schema da API e contra payload malicioso (controle chars, strings
 *    gigantes que estouram render).
 *  - Strings de texto livre (server name, description) passam por sanitize
 *    que tira control chars + clipa tamanho.
 *  - fetch usa revalidate 300s + AbortController com timeout 8s.
 *  - User-Agent identifica o serviço (best practice; alguns proxies bloqueiam
 *    UA vazio).
 *  - Limites: máx 100 itens por listagem, máx 20 chars no search query.
 */

const BM_BASE = "https://api.battlemetrics.com";
const UA = "DayZ-Codex/0.5 (+https://github.com/dayz-codex)";
const REQUEST_TIMEOUT_MS = 8000;
const REVALIDATE_SEC = 300;

// ─── Sanitização ────────────────────────────────────────────────────────────

/**
 * Limpa string de fonte externa: tira control chars, normaliza whitespace,
 * clipa em N caracteres. Defesa contra log spoofing, XSS via control chars
 * e payloads excessivos. React já escapa HTML em render — não tentamos
 * "stripar tags" (anti-pattern). Só garantimos texto plano + bounded.
 */
function sanitizeText(input: unknown, maxLen: number): string {
  if (typeof input !== "string") return "";
  // \x00-\x1f exceto \t \n; \x7f DEL; replacement char U+FFFD
  const cleaned = input
    .replace(/[\x00-\x08\x0b-\x1f\x7f�]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, maxLen);
}

// ─── Schemas Zod (validação de resposta) ────────────────────────────────────

const ServerAttributesSchema = z
  .object({
    id: z.string().max(40).optional(),
    name: z.string().max(500).optional(),
    address: z.string().max(255).nullable().optional(),
    ip: z.string().max(45).nullable().optional(),
    port: z.number().int().min(0).max(65535).nullable().optional(),
    players: z.number().int().min(0).max(10_000).optional(),
    maxPlayers: z.number().int().min(0).max(10_000).optional(),
    rank: z.number().int().min(0).optional(),
    status: z.string().max(40).optional(),
    country: z.string().length(2).optional(),
    details: z
      .object({
        map: z.string().max(120).optional(),
        time: z.string().max(40).optional(),
        version: z.string().max(40).optional(),
        modIds: z.array(z.number().int().nonnegative()).max(200).optional(),
        modNames: z.array(z.string().max(120)).max(200).optional(),
        description: z.string().max(5000).optional(),
        official: z.boolean().optional(),
        passworded: z.boolean().optional(),
        firstPersonOnly: z.boolean().optional(),
        thirdPerson: z.boolean().optional(),
      })
      .partial()
      .optional(),
  })
  .passthrough(); // Aceita campos extras sem quebrar (API evolui)

const ServerEntrySchema = z.object({
  type: z.string().max(40),
  id: z.string().max(40),
  attributes: ServerAttributesSchema,
});

const ServerListResponseSchema = z.object({
  data: z.array(ServerEntrySchema).max(200),
  links: z
    .object({
      prev: z.string().url().optional(),
      next: z.string().url().optional(),
    })
    .partial()
    .optional(),
});

const ServerDetailResponseSchema = z.object({
  data: ServerEntrySchema,
});

// ─── Tipos públicos (saneados) ──────────────────────────────────────────────

export interface DayZServer {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  map: string;
  time: string;
  country: string | null;
  passworded: boolean;
  firstPersonOnly: boolean;
  official: boolean;
  rank: number | null;
  /** "ip:port" se BM expor; null caso contrário (sem leak de IPv4 cru). */
  connect: string | null;
  modNames: string[];
  description: string;
  version: string;
  status: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalize(entry: z.infer<typeof ServerEntrySchema>): DayZServer {
  const a = entry.attributes;
  const d = a.details ?? {};
  // Validação extra de IP/port pra steam:// link seguro
  const ip = typeof a.ip === "string" ? a.ip : null;
  const port = typeof a.port === "number" ? a.port : null;
  const safeConnect =
    ip && port && /^[0-9.:a-fA-F]+$/.test(ip) && port > 0 && port < 65536
      ? `${ip}:${port}`
      : null;

  return {
    id: sanitizeText(entry.id, 40),
    name: sanitizeText(a.name, 120) || "Unnamed Server",
    players: a.players ?? 0,
    maxPlayers: a.maxPlayers ?? 0,
    map: sanitizeText(d.map, 80) || "Unknown",
    time: sanitizeText(d.time, 20),
    country: a.country ? sanitizeText(a.country, 2).toUpperCase() : null,
    passworded: Boolean(d.passworded),
    firstPersonOnly: Boolean(d.firstPersonOnly),
    official: Boolean(d.official),
    rank: a.rank ?? null,
    connect: safeConnect,
    modNames: (d.modNames ?? []).slice(0, 50).map((m) => sanitizeText(m, 80)),
    description: sanitizeText(d.description, 1500),
    version: sanitizeText(d.version, 30),
    status: sanitizeText(a.status, 30) || "unknown",
  };
}

function authHeaders(): Record<string, string> {
  const key = process.env.BATTLEMETRICS_API_KEY;
  const headers: Record<string, string> = {
    "User-Agent": UA,
    Accept: "application/vnd.api+json",
  };
  if (key && /^[A-Za-z0-9_-]{20,128}$/.test(key)) {
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

async function bmFetch(url: string): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: authHeaders(),
      signal: ctrl.signal,
      // Next.js fetch cache — re-valida automaticamente
      next: { revalidate: REVALIDATE_SEC, tags: ["battlemetrics"] },
    });
    if (!res.ok) {
      throw new Error(`BattleMetrics ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ─── API pública ────────────────────────────────────────────────────────────

export interface ServerListFilters {
  /** Search query — só [\w\s-], máx 40 chars; pass-through pro BM. */
  q?: string;
  /** Country ISO 3166-1 alpha-2 (BR, US, etc). */
  country?: string;
  /** Page size (1-100). */
  limit?: number;
  /** Sort by "-players" (default, mais jogadores), "rank", etc. */
  sort?: "-players" | "players" | "rank" | "-rank" | "name";
}

const QueryFiltersSchema = z.object({
  q: z
    .string()
    .max(40)
    .regex(/^[\p{L}\p{N}\s\-_.]*$/u, "search inválida")
    .optional(),
  country: z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/)
    .optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sort: z
    .enum(["-players", "players", "rank", "-rank", "name"])
    .optional(),
});

export async function fetchDayZServers(
  filters: ServerListFilters = {},
): Promise<{ servers: DayZServer[]; nextPage: boolean }> {
  const valid = QueryFiltersSchema.safeParse(filters);
  if (!valid.success) {
    return { servers: [], nextPage: false };
  }

  const params = new URLSearchParams();
  params.set("filter[game]", "dayz");
  params.set("filter[status]", "online");
  params.set("page[size]", String(valid.data.limit ?? 50));
  params.set("sort", valid.data.sort ?? "-players");
  if (valid.data.q) params.set("filter[search]", valid.data.q);
  if (valid.data.country) params.set("filter[countries][0]", valid.data.country);

  let parsed;
  try {
    const raw = await bmFetch(`${BM_BASE}/servers?${params.toString()}`);
    parsed = ServerListResponseSchema.safeParse(raw);
  } catch {
    return { servers: [], nextPage: false };
  }
  if (!parsed.success) return { servers: [], nextPage: false };

  return {
    servers: parsed.data.data.map(normalize),
    nextPage: Boolean(parsed.data.links?.next),
  };
}

export async function fetchDayZServer(id: string): Promise<DayZServer | null> {
  // ID deve ser numérico inteiro string-formado (defesa antes de chamar API)
  if (!/^[0-9]{1,20}$/.test(id)) return null;

  let parsed;
  try {
    const raw = await bmFetch(`${BM_BASE}/servers/${id}`);
    parsed = ServerDetailResponseSchema.safeParse(raw);
  } catch {
    return null;
  }
  if (!parsed.success) return null;

  return normalize(parsed.data.data);
}

/**
 * Constrói URL steam://connect/ — só se IP+port passaram validação numérica
 * em normalize(). Nunca aceitar string crua do usuário aqui.
 */
export function steamConnectUrl(server: Pick<DayZServer, "connect">): string | null {
  if (!server.connect) return null;
  if (!/^[0-9.]+:[0-9]+$/.test(server.connect)) return null;
  return `steam://connect/${server.connect}`;
}
