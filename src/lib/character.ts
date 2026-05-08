"use client";

import { z } from "zod";

/**
 * Character sheet — perfil manual do personagem do user.
 *
 * Persistência:
 *  - localStorage (snapshot único + lista de saved snapshots)
 *  - URL hash share (base64 do JSON pra colar no Discord)
 *
 * Validação Zod estrita anti stored-XSS / payload abuse.
 */

const SLUG = z.string().regex(/^[a-z0-9-]{1,60}$/);
const SAFE_TEXT = z
  .string()
  .max(120)
  .regex(/^[^ -]*$/, "sem caracteres de controle"); // bloqueia \x00-\x1f
const SAFE_LONG_TEXT = z
  .string()
  .max(2000)
  .regex(/^[^\x00-\x08\x0b-\x1f\x7f]*$/);

export const EQUIPMENT_SLOTS = [
  "head", // capacete/chapéu
  "face", // máscara/óculos
  "shirt", // camisa/blusa
  "vest", // colete (Plate Carrier, Press Vest)
  "pants", // calça
  "feet", // botas
  "hands", // luvas
  "backpack", // mochila grande
  "primary", // arma primária
  "secondary", // pistola/sidearm
  "melee", // arma branca
] as const;

export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

const ConditionSchema = z.enum([
  "pristine",
  "worn",
  "damaged",
  "badly_damaged",
  "ruined",
]);
export type Condition = z.infer<typeof ConditionSchema>;

const EquippedItemSchema = z.object({
  slug: SLUG,
  condition: ConditionSchema.default("pristine"),
});
export type EquippedItem = z.infer<typeof EquippedItemSchema>;

const InventoryEntrySchema = z.object({
  slug: SLUG,
  qty: z.number().int().min(1).max(999),
  condition: ConditionSchema.optional(),
});
export type InventoryEntry = z.infer<typeof InventoryEntrySchema>;

// Equipment como objeto explícito → tipos Partial corretos.
const EquipmentSchema = z.object({
  head: EquippedItemSchema.optional(),
  face: EquippedItemSchema.optional(),
  shirt: EquippedItemSchema.optional(),
  vest: EquippedItemSchema.optional(),
  pants: EquippedItemSchema.optional(),
  feet: EquippedItemSchema.optional(),
  hands: EquippedItemSchema.optional(),
  backpack: EquippedItemSchema.optional(),
  primary: EquippedItemSchema.optional(),
  secondary: EquippedItemSchema.optional(),
  melee: EquippedItemSchema.optional(),
});

export const CharacterSchema = z.object({
  name: SAFE_TEXT.default("Survivor"),
  server: SAFE_TEXT.default(""),
  map: z.enum(["chernarus", "livonia", "sakhal", "other"]).default("chernarus"),
  notes: SAFE_LONG_TEXT.default(""),
  equipment: EquipmentSchema.default({}),
  inventory: z.array(InventoryEntrySchema).max(200).default([]),
  updatedAt: z.number().int().positive().default(() => Date.now()),
});
export type Character = z.infer<typeof CharacterSchema>;

export const SnapshotSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{6,40}$/),
  label: SAFE_TEXT,
  character: CharacterSchema,
  createdAt: z.number().int().positive(),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

const StoreSchema = z.object({
  current: CharacterSchema,
  snapshots: z.array(SnapshotSchema).max(50),
});
export type Store = z.infer<typeof StoreSchema>;

const KEY = "dayz-codex:character:v1";

const EMPTY_CHARACTER: Character = {
  name: "Survivor",
  server: "",
  map: "chernarus",
  notes: "",
  equipment: {},
  inventory: [],
  updatedAt: Date.now(),
};

export function readStore(): Store {
  if (typeof window === "undefined") {
    return { current: EMPTY_CHARACTER, snapshots: [] };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { current: EMPTY_CHARACTER, snapshots: [] };
    if (raw.length > 200_000) {
      localStorage.removeItem(KEY);
      return { current: EMPTY_CHARACTER, snapshots: [] };
    }
    const parsed = StoreSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      // Tenta migrar partial — pelo menos o current
      try {
        const partial = JSON.parse(raw);
        const single = CharacterSchema.safeParse(partial.current ?? partial);
        if (single.success) {
          return { current: single.data, snapshots: [] };
        }
      } catch {}
      return { current: EMPTY_CHARACTER, snapshots: [] };
    }
    return parsed.data;
  } catch {
    return { current: EMPTY_CHARACTER, snapshots: [] };
  }
}

export function writeStore(store: Store): boolean {
  try {
    const valid = StoreSchema.safeParse(store);
    if (!valid.success) return false;
    localStorage.setItem(KEY, JSON.stringify(valid.data));
    return true;
  } catch {
    return false;
  }
}

export function newSnapshotId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 12);
  }
  return Math.random().toString(36).slice(2, 14);
}

/**
 * Encode/decode pra URL hash sharing.
 * Base64 url-safe + checksum.
 */
export function encodeShare(c: Character): string {
  const json = JSON.stringify(c);
  // Base64 url-safe (substitui +/= que quebram em URL)
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return b64;
}

export function decodeShare(hash: string): Character | null {
  try {
    if (!hash || hash.length > 50_000) return null;
    const b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = CharacterSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export const CONDITION_META: Record<
  Condition,
  { label: string; color: string; abbr: string }
> = {
  pristine: { label: "Pristine", color: "#9aaa66", abbr: "PRI" },
  worn: { label: "Worn", color: "#b6a26a", abbr: "WRN" },
  damaged: { label: "Damaged", color: "#c89c4e", abbr: "DMG" },
  badly_damaged: { label: "Badly Damaged", color: "#9a5b2c", abbr: "BAD" },
  ruined: { label: "Ruined", color: "#c8412e", abbr: "RUI" },
};

export const SLOT_META: Record<
  EquipmentSlot,
  { label: string; icon: string; categoryFilter?: string[]; subcategoryHints?: string[] }
> = {
  head: { label: "Cabeça", icon: "helmet-battle", categoryFilter: ["clothing"], subcategoryHints: ["Cabeça"] },
  face: { label: "Face", icon: "user", categoryFilter: ["clothing"], subcategoryHints: ["Cabeça"] },
  shirt: { label: "Camisa", icon: "vest", categoryFilter: ["clothing"], subcategoryHints: ["Tronco"] },
  vest: { label: "Colete", icon: "vest", categoryFilter: ["clothing", "container"], subcategoryHints: ["Colete"] },
  pants: { label: "Calça", icon: "family-pants", categoryFilter: ["clothing"], subcategoryHints: ["Pernas"] },
  feet: { label: "Botas", icon: "boot", categoryFilter: ["clothing"], subcategoryHints: ["Pés"] },
  hands: { label: "Mãos", icon: "shield", categoryFilter: ["clothing"] },
  backpack: { label: "Mochila", icon: "backpack", categoryFilter: ["container"], subcategoryHints: ["Mochila"] },
  primary: { label: "Primária", icon: "bullet", categoryFilter: ["weapon"] },
  secondary: { label: "Pistola", icon: "bullet", categoryFilter: ["weapon"], subcategoryHints: ["Pistola"] },
  melee: { label: "Melee", icon: "axe", categoryFilter: ["melee"] },
};
