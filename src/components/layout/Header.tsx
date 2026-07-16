"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { learnMenu, mobileNav, primaryNav } from "@/content/navigation";
import { useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Premium site header.
 *
 * - Transparent over the (always-dark) page hero at the top of the page with
 *   the reversed/white logo, then transitions to a frosted white bar with the
 *   navy logo once scrolled — a well-built, legible menu on every page.
 * - Educational pages live in an accessible "Learn" dropdown to keep the
 *   first-level bar short.
 * - Mobile uses an animated slide-in drawer with a backdrop, Escape-to-close,
 *   and body scroll lock.
 */
export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(24);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const learnRef = useRef<HTMLLIElement>(null);
  const learnMenuId = useId();

  const solid = scrolled || drawerOpen;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const learnActive = learnMenu.some((item) => isActive(item.href));

  const closeMenus = () => {
    setDrawerOpen(false);
    setLearnOpen(false);
  };

  // Escape closes whichever menu is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setLearnOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close the Learn dropdown on outside click.
  useEffect(() => {
    if (!learnOpen) return;
    const onClick = (event: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setLearnOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [learnOpen]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const linkTone = solid
    ? "text-navy-800 hover:text-teal-700"
    : "text-white/90 hover:text-white";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solid
            ? "border-b border-navy-100/70 bg-porcelain-50/85 shadow-[0_8px_30px_rgba(7,26,46,0.06)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
      <nav aria-label="Main" className="mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="relative flex shrink-0 items-center" aria-label="Travel Technician — home">
          <span className="relative block h-11 w-[188px]">
            <Image
              src="/images/brand/logo-horizontal.png"
              alt="Travel Technician"
              fill
              priority
              sizes="188px"
              className={cn(
                "object-contain object-left transition-opacity duration-300",
                solid ? "opacity-100" : "opacity-0",
              )}
            />
            <Image
              src="/images/brand/logo-light.png"
              alt=""
              fill
              priority
              sizes="188px"
              className={cn(
                "object-contain object-left transition-opacity duration-300",
                solid ? "opacity-0" : "opacity-100",
              )}
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          <li ref={learnRef} className="relative">
            <button
              type="button"
              aria-expanded={learnOpen}
              aria-controls={learnMenuId}
              onClick={() => setLearnOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                linkTone,
                learnActive && (solid ? "text-teal-700" : "text-white"),
              )}
            >
              Learn
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
                className={cn("h-3.5 w-3.5 transition-transform", learnOpen && "rotate-180")}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {learnOpen ? (
              <div
                id={learnMenuId}
                className="absolute left-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-2xl shadow-navy-950/15"
              >
                {learnMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className="block rounded-xl px-4 py-3 transition-colors hover:bg-porcelain-100"
                  >
                    <span className="block font-semibold text-navy-900">{item.label}</span>
                    <span className="mt-0.5 block text-sm text-ink/60">{item.description}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </li>

          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  linkTone,
                  isActive(item.href) && (solid ? "text-teal-700" : "text-white"),
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li className="ml-2">
            <Link
              href="/contact?topic=free-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/25 transition-all hover:bg-gold-400 hover:shadow-gold-500/40"
            >
              Book a Free Consultation
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          className={cn(
            "ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden",
            solid ? "text-navy-900 hover:bg-navy-50" : "text-white hover:bg-white/10",
          )}
        >
          <span className="sr-only">{drawerOpen ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-6 w-6">
            {drawerOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>
      </header>

      {/* Mobile drawer — rendered as a sibling of <header> so the header's
          backdrop-blur containing block doesn't trap this fixed element.
          When closed it is both aria-hidden (removed from the a11y tree) and
          inert (its links are removed from the tab order), so no focusable
          content is ever left hidden behind aria-hidden. */}
      <div className="lg:hidden" aria-hidden={!drawerOpen} inert={!drawerOpen}>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          id="mobile-drawer"
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-porcelain-50 shadow-2xl transition-transform duration-300 ease-out",
            drawerOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
            <Image src="/images/brand/logo-horizontal.png" alt="Travel Technician" width={170} height={40} className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-900 hover:bg-navy-50"
            >
              <span className="sr-only">Close menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-6 w-6">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="flex flex-col">
              {mobileNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenus}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-xl px-4 py-3.5 text-lg font-medium transition-colors",
                      isActive(item.href) ? "bg-navy-50 text-teal-700" : "text-navy-900 hover:bg-navy-50",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-navy-100 p-4">
            <Link
              href="/contact?topic=free-consultation"
              onClick={closeMenus}
              className="flex min-h-12 items-center justify-center rounded-full bg-gold-500 px-6 font-semibold text-navy-950 shadow-lg shadow-gold-500/25"
            >
              Book a Free Consultation
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_CARDMASTER_URL ?? "https://cardmaster.traveltechnician.info"}
              onClick={closeMenus}
              rel="noopener noreferrer"
              className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-navy-300 px-6 font-semibold text-navy-900"
            >
              Launch CardMaster
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
