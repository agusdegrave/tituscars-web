import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFloatingButton } from "@/components/whatsapp-floating-button";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nombreSitio = process.env.NEXT_PUBLIC_SITE_NAME ?? "Titus Cars";

export const metadata: Metadata = {
  title: `${nombreSitio} — Autos usados y 0km en Córdoba`,
  description:
    "Catálogo de autos usados y 0km en Córdoba. Peritados, con garantía y consigna virtual.",
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
        <SiteFooter />
        <WhatsappFloatingButton />
        <Toaster />
      </body>
    </html>
  );
}
