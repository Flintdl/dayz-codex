#!/usr/bin/env node
/**
 * Otimiza imagens em /public/items/ para reduzir bandwidth em produção.
 *
 * Estratégias (em ordem de preferência):
 *  1. cwebp (libwebp-tools) — melhor qualidade/tamanho para webp
 *  2. ImageMagick `convert` — fallback genérico
 *  3. Skip — se nenhuma ferramenta disponível, lista o que faria
 *
 * Uso:
 *   node scripts/optimize-images.mjs            # otimiza tudo
 *   node scripts/optimize-images.mjs --dry-run  # só lista
 *
 * Reduz tipicamente 30-60% do tamanho mantendo qualidade visual.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const itemsDir = path.join(root, "public", "items");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const QUALITY = 78; // tradeoff: 70-85 é o sweet spot pra webp

function hasCmd(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const HAS_CWEBP = hasCmd("cwebp");
const HAS_CONVERT = hasCmd("convert");

if (!HAS_CWEBP && !HAS_CONVERT && !DRY_RUN) {
  console.log(">> Nenhuma ferramenta de otimização instalada.");
  console.log("   Instale uma destas:");
  console.log("     sudo apt install webp        # cwebp (recomendado)");
  console.log("     sudo apt install imagemagick # convert (fallback)");
  process.exit(1);
}

console.log(
  `>> Tools: cwebp=${HAS_CWEBP ? "✓" : "✗"} convert=${HAS_CONVERT ? "✓" : "✗"}`,
);

const files = (await fs.readdir(itemsDir)).filter((f) =>
  /\.(png|jpe?g|webp)$/i.test(f),
);
console.log(`>> ${files.length} imagens para processar.`);

let totalBefore = 0;
let totalAfter = 0;
let skipped = 0;

for (const f of files) {
  const inPath = path.join(itemsDir, f);
  const stat = await fs.stat(inPath);
  totalBefore += stat.size;

  // Já é pequeno? skip
  if (stat.size < 15_000) {
    totalAfter += stat.size;
    skipped++;
    continue;
  }

  const tempOut = path.join(itemsDir, `.tmp-${f}.webp`);
  const finalOut = path.join(itemsDir, f.replace(/\.(png|jpe?g|webp)$/i, ".webp"));

  if (DRY_RUN) {
    console.log(`   [dry] ${f} (${stat.size}b)`);
    totalAfter += stat.size;
    continue;
  }

  try {
    if (HAS_CWEBP) {
      execSync(
        `cwebp -q ${QUALITY} -m 6 -mt -quiet "${inPath}" -o "${tempOut}"`,
        { stdio: "pipe" },
      );
    } else if (HAS_CONVERT) {
      execSync(
        `convert "${inPath}" -quality ${QUALITY} -define webp:method=6 "${tempOut}"`,
        { stdio: "pipe" },
      );
    }

    const newStat = await fs.stat(tempOut);
    if (newStat.size < stat.size) {
      // Substitui se menor; senão mantém original
      if (inPath !== finalOut) await fs.unlink(inPath);
      await fs.rename(tempOut, finalOut);
      const saved = stat.size - newStat.size;
      const pct = Math.round((saved / stat.size) * 100);
      console.log(
        `   ${f.padEnd(35)} ${stat.size.toString().padStart(7)}b → ${newStat.size
          .toString()
          .padStart(7)}b (-${pct}%)`,
      );
      totalAfter += newStat.size;
    } else {
      await fs.unlink(tempOut);
      totalAfter += stat.size;
      skipped++;
    }
  } catch (e) {
    console.log(`   ${f}: ERRO ${e.message}`);
    totalAfter += stat.size;
  }
}

const savedTotal = totalBefore - totalAfter;
const pctTotal = totalBefore > 0 ? Math.round((savedTotal / totalBefore) * 100) : 0;
console.log("");
console.log(
  `>> Total: ${(totalBefore / 1024).toFixed(0)}KB → ${(totalAfter / 1024).toFixed(0)}KB (-${pctTotal}%, ${skipped} skipped)`,
);
