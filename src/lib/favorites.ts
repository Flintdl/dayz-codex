"use client";

import { z } from "zod";

const FavoritesSchema = z.array(z.string().regex(/^[a-z0-9-]{1,60}$/)).max(500);

const KEY = "dayz-codex:favorites:v1";

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    if (raw.length > 50_000) {
      localStorage.removeItem(KEY);
      return [];
    }
    const parsed = FavoritesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function writeFavorites(slugs: string[]): boolean {
  try {
    const valid = FavoritesSchema.safeParse(slugs);
    if (!valid.success) return false;
    localStorage.setItem(KEY, JSON.stringify(valid.data));
    return true;
  } catch {
    return false;
  }
}

export function toggleFavorite(slug: string): string[] {
  const list = readFavorites();
  const idx = list.indexOf(slug);
  const next = idx >= 0 ? list.filter((s) => s !== slug) : [...list, slug];
  writeFavorites(next);
  return next;
}

export function isFavorite(slug: string): boolean {
  return readFavorites().includes(slug);
}
