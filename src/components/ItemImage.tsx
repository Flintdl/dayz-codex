import { IMAGE_MANIFEST } from "@/lib/imageManifest";

/**
 * Renderiza a foto do item se existir em /public/items/<slug>.<ext>; caso
 * contrário, fallback para o ícone Flaticon. Manifest é gerado em build
 * (scripts/build-image-manifest.mjs) — zero fs no runtime, funciona em
 * client e server components.
 *
 * Após adicionar novas imagens em /public/items/, rode:
 *   node scripts/build-image-manifest.mjs
 * (e reinicie o dev server). O prebuild também regenera automaticamente.
 */

const SIZES = {
  sm: 48,
  md: 96,
  lg: 192,
} as const;
type SizeKey = keyof typeof SIZES;

interface Props {
  slug: string;
  icon: string;
  alt: string;
  size?: SizeKey;
  className?: string;
}

export function ItemImage({
  slug,
  icon,
  alt,
  size = "md",
  className = "",
}: Props) {
  const px = SIZES[size];
  const ext = IMAGE_MANIFEST[slug];

  if (ext) {
    return (
      // Usa <img> nativo (em vez de next/image) — imagens já estão dimensionadas
      // e passam pelo header de cache imutável de /fonts. Evita também o overhead
      // de otimização desnecessária pra ícones pequenos.
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: px, height: px }}
      >
        <img
          src={`/items/${slug}.${ext}`}
          alt={alt}
          width={px}
          height={px}
          loading="lazy"
          decoding="async"
          className="object-contain max-w-full max-h-full"
        />
      </div>
    );
  }

  // Fallback Flaticon
  const iconSize = Math.round(px * 0.55);
  return (
    <div
      className={`flex items-center justify-center bg-[var(--c-surface-2)] border border-[var(--c-border)] ${className}`}
      style={{ width: px, height: px }}
      aria-label={alt}
    >
      <i
        className={`fi-rr-${icon} text-[var(--c-olive-bright)]`}
        style={{ fontSize: iconSize }}
      />
    </div>
  );
}
