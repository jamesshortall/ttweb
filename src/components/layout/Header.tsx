"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/content/navigation";
import { cn } from "@/lib/utils";

/**
 * Site header with accessible disclosure-pattern mobile navigation.
 * The consultation CTA stays visible at every breakpoint.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Menu closes on link click (see closeMenu below) and on Escape.
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-lagoon-100 bg-white/95 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Travel Technician home">
          <Image
            src="/images/brand/logo-horizontal.svg"
            alt=""
            width={200}
            height={38}
            priority
            className="h-8 w-auto"
          />
          <span className="sr-only">Travel Technician</span>
        </Link>

        <ul className="ml-auto hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-lagoon-50 text-lagoon-900"
                    : "text-ink/80 hover:bg-lagoon-50 hover:text-lagoon-900",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact?topic=free-consultation"
          className="ml-auto hidden shrink-0 rounded-full bg-sunset-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sunset-600/20 transition-colors hover:bg-sunset-700 sm:inline-flex xl:ml-2"
        >
          Schedule a Free Consultation
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg text-lagoon-950 hover:bg-lagoon-50 sm:ml-0 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="h-6 w-6"
          >
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="border-t border-lagoon-100 bg-white xl:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-4 py-3 font-medium",
                    isActive(item.href)
                      ? "bg-lagoon-50 text-lagoon-900"
                      : "text-ink/85 hover:bg-lagoon-50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-lagoon-100 pt-4">
            <Link
              href="/contact?topic=free-consultation"
              onClick={closeMenu}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-sunset-600 px-6 font-semibold text-white"
            >
              Schedule a Free Consultation
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_CARDMASTER_URL ?? "https://cardmaster.traveltechnician.info"}
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-lagoon-800 px-6 font-semibold text-lagoon-900"
            >
              Start Using CardMaster
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
