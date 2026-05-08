import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DayZ Codex — Manual de Campo",
    template: "%s · DayZ Codex",
  },
  description:
    "Guia completo de DayZ: itens vanilla, crafting, mecânicas de sobrevivência, base building e mapas. Cadeia tipo dataminer entre itens.",
  applicationName: "DayZ Codex",
  authors: [{ name: "DayZ Codex" }],
  keywords: [
    "DayZ",
    "guia",
    "wiki",
    "itens",
    "crafting",
    "sobrevivência",
    "base building",
    "Chernarus",
    "Livonia",
    "Sakhal",
  ],
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "DayZ Codex",
    title: "DayZ Codex — Manual de Campo",
    description:
      "Manual de campo de DayZ — itens, crafting, sobrevivência, base building e mapas.",
  },
  twitter: {
    card: "summary",
    title: "DayZ Codex",
    description: "Manual de campo de DayZ.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080a" },
    { media: "(prefers-color-scheme: light)", color: "#07080a" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect a fontes externas — economiza ~150ms na primeira pintura */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Subset reduzido: pesos efetivamente usados, não a família inteira.
            Display swap evita FOIT (texto invisível) durante carregamento. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Black+Ops+One&family=Special+Elite&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
        <link rel="stylesheet" href="/fonts/uicons/uicons.css" />
        <link
          rel="preload"
          href="/fonts/uicons/uicons-regular-rounded.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="app-shell">
          <Header />
          <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-10">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
