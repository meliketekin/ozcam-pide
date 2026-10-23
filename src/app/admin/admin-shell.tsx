"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { logout } from "./actions";
import { ToastProvider } from "./toast";

const tabs = [
  { href: "/admin", label: "Menü" },
  { href: "/admin/yorumlar", label: "Yorumlar" },
  { href: "/admin/galeri", label: "Galeri" },
];

/** Panel sayfalarının ortak çerçevesi: üst bar ve bölüm sekmeleri. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-cream">
      <header className="bg-ink-deep text-cream">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.12em] text-sand sm:block">
              Yönetim Paneli
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.12em]">
            <Link href="/" target="_blank" className="text-sand hover:text-white">
              Siteyi gör ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="font-bold uppercase tracking-[0.12em] text-sand hover:text-white"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-6">
          <ul className="flex gap-1">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                      active ? "bg-cream text-ink" : "text-sand hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <ToastProvider>
        <div className="mx-auto max-w-6xl px-6 py-12">{children}</div>
      </ToastProvider>
    </div>
  );
}
