import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ResenasBanner } from "@/components/resenas-banner";
import { WhatsappFloatingButton } from "@/components/whatsapp-floating-button";
import { Toaster } from "@/components/ui/toast";
import { VersionGuard } from "@/components/version-guard";
import { SITE_URL } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nombreSitio = process.env.NEXT_PUBLIC_SITE_NAME ?? "Titus Cars";

const titulo = `${nombreSitio} — Autos usados y 0km en Córdoba`;
const descripcion =
  "Catálogo de autos usados y 0km en Córdoba. Peritados, con garantía y consigna virtual.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: titulo,
  description: descripcion,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png" }],
  },
  openGraph: {
    title: titulo,
    description: descripcion,
    type: "website",
    images: [{ url: "/brand/logo-horizontal@2x.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <ResenasBanner />
        <SiteFooter />
        <WhatsappFloatingButton />
        <Toaster />
        <VersionGuard />
      </body>
    </html>
  );
}
