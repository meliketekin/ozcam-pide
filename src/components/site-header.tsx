"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Logo } from "@/components/logo";
import { homeSections, navLinks, site } from "@/lib/site";

type NavLink = (typeof navLinks)[number];

/** Ekranın üst %40'ındaki çizgiye denk gelen anasayfa bölümünü bulur. */
function findActiveSection() {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) return homeSections[homeSections.length - 1];

  const line = window.innerHeight * 0.4;
  for (const id of homeSections) {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top <= line && rect.bottom > line) return id;
  }
  return "top";
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  // Hero görseli olan sayfalarda header şeffaf başlar
  const solid = scrolled || !["/", "/menu"].includes(pathname);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (isHome) setActiveSection(findActiveSection());
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // Mobil menü açıkken sayfa kaymasın
  useLayoutEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (link: NavLink) =>
    isHome && link.section ? link.section === activeSection : link.href === pathname;

  const handleClick = (event: React.MouseEvent, link: NavLink) => {
    setOpen(false);
    // Başka sayfadan gelirken Next.js hash'e kendisi kaydırır
    if (!isHome || !link.section) return;

    // Anasayfadayken kaydırmayı kendimiz yaparız: aynı linke tekrar tıklanınca da çalışsın
    event.preventDefault();
    // Mobil menüyü hemen kapat ki sayfa kilidi kaydırmadan önce kalksın
    flushSync(() => setOpen(false));
    if (link.section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(link.section)?.scrollIntoView({ behavior: "smooth" });
    }
    window.history.replaceState(null, "", link.href);
    setActiveSection(link.section);
  };

  return (
    <header
      className={`header-in fixed inset-x-0 top-0 z-40 text-cream transition-all duration-500 ${
        solid && !open ? "bg-ink-deep/95 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 lg:px-14 ${
          solid ? "h-[72px]" : "h-24"
        }`}
      >
        <Logo className="relative z-50" />

        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleClick(e, link)}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[4px] after:origin-left after:border-y after:border-current after:transition-transform after:duration-300 hover:text-white ${
                      active ? "text-white after:scale-x-100" : "after:scale-x-0"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="hidden text-sand hover:text-white lg:block">
          {site.phone}
        </a>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="relative z-50 flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Sayfada ne kadar ilerlendiğini gösteren ince çizgi (yalnızca header doluyken) */}
      <span
        aria-hidden
        className={`scroll-progress absolute inset-x-0 bottom-0 h-0.5 bg-brand transition-opacity duration-500 ${
          solid && !open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Mobil tam ekran menü */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-ink-deep transition-opacity duration-500 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link)}
            aria-current={isActive(link) ? "page" : undefined}
            className={`title-section transition-colors hover:text-brand ${
              isActive(link) ? "text-brand" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="mt-6 text-sand">
          {site.phone}
        </a>
      </div>
    </header>
  );
}
