#!/usr/bin/env node
/**
 * Gera src/lib/imageManifest.ts com mapa { slug → extensão } das imagens
 * em /public/items/. Roda no prebuild — ItemImage usa pra escolher src
 * com a extensão correta (png/webp/jpg/...) sem fs no runtime.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const itemsDir = path.join(root, "public", "items");
const out = path.join(root, "src", "lib", "imageManifest.ts");

await fs.mkdir(path.dirname(out), { recursive: true });

const manifest = {};
try {
  const files = await fs.readdir(itemsDir);
  for (const f of files) {
    const m = f.match(/^(.+)\.(png|jpe?g|webp|gif|avif)$/i);
    if (!m) continue;
    const slug = m[1];
    const ext = m[2].toLowerCase() === "jpeg" ? "jpg" : m[2].toLowerCase();
    // Se o mesmo slug existe em múltiplos formatos, prefere ordem: png, webp, jpg, gif, avif
    const priority = { png: 0, webp: 1, jpg: 2, gif: 3, avif: 4 };
    if (!manifest[slug] || priority[ext] < priority[manifest[slug]]) {
      manifest[slug] = ext;
    }
  }
} catch {}

const sorted = Object.fromEntries(
  Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
);

const code = `// AUTO-GERADO por scripts/build-image-manifest.mjs — não edite à mão.
// Mapa de slug → extensão da imagem em /public/items/<slug>.<ext>
export const IMAGE_MANIFEST: Readonly<Record<string, string>> = ${JSON.stringify(
  sorted,
  null,
  2,
)};
`;

await fs.writeFile(out, code, "utf8");
console.log(
  `>> manifest: ${Object.keys(manifest).length} imagens (${
    Object.entries(
      Object.values(manifest).reduce((acc, ext) => {
        acc[ext] = (acc[ext] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .map(([k, v]) => `${v} ${k}`)
      .join(", ") || "vazio"
  })`,
);
