"use client";

import { z } from "zod";

const HistorySchema = z
  .array(
    z.object({
      slug: z.string().regex(/^[a-z0-9-]{1,60}$/),
      visitedAt: z.number().int().positive(),
    }),
  )
  .max(50);

const KEY = "dayz-codex:history:v1";

export interface HistoryEntry {
  slug: string;
  visitedAt: number;
}

export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    if (raw.length > 50_000) {
      localStorage.removeItem(KEY);
      return [];
    }
    const parsed = HistorySchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function recordVisit(slug: string): void {
  if (typeof window === "undefined") return;
  if (!/^[a-z0-9-]{1,60}$/.test(slug)) return;
  const list = readHistory().filter((h) => h.slug !== slug);
  list.unshift({ slug, visitedAt: Date.now() });
  const trimmed = list.slice(0, 30);
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
