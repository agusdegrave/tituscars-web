"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkWhatsapp } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/autos", label: "Catálogo" },
  { href: "/consigna", label: "Consigná tu auto" },
  { href: "/financiacion", label: "Financiación" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

function esActivo(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-brand">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/logo-horizontal-blanco.svg"
            alt="Titus Cars"
            width={136}
            height={40}
            priority
            className="h-8 w-auto lg:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={esActivo(pathname, link.href) ? "page" : undefined}
              className="text-sm font-medium text-white decoration-white decoration-2 underline-offset-8 transition-colors hover:text-white/80 aria-[current=page]:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            className="bg-white text-brand hover:bg-white/90"
            nativeButton={false}
            render={
              <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" />
            }
          >
            WhatsApp
          </Button>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {abierto && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button
            className="mt-2 w-full"
            nativeButton={false}
            render={
              <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" />
            }
          >
            WhatsApp
          </Button>
        </nav>
      )}
    </header>
  );
}
