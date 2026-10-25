"use client";

import { createContext, useContext, useState } from "react";

const CollapseContext = createContext<{ open: boolean; toggle: () => void }>({
  open: true,
  toggle: () => {},
});

/** Kategori kartı: ürün listesi başlıktaki butonla açılıp kapanır. Varsayılan kapalı, sayfa kısa kalsın. */
export function CategoryCollapse({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <CollapseContext value={{ open, toggle: () => setOpen((o) => !o) }}>
      <section className="bg-white shadow-sm">{children}</section>
    </CollapseContext>
  );
}

/** Başlıktaki "Ürünleri göster / gizle" butonu. */
export function CollapseToggle({ count, className }: { count: number; className: string }) {
  const { open, toggle } = useContext(CollapseContext);
  return (
    <button type="button" onClick={toggle} aria-expanded={open} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      {open ? "Ürünleri gizle" : `Ürünleri göster (${count})`}
    </button>
  );
}

/**
 * Kapalıyken gizlenen içerik; yüksekliği yumuşakça açılıp kapanır (grid satırı 0fr ↔ 1fr).
 * Formlar yerinde kalır, yazılanlar kaybolmaz; kapalıyken `inert` ile tıklanamaz ve odaklanamaz.
 */
export function CollapseBody({ children }: { children: React.ReactNode }) {
  const { open } = useContext(CollapseContext);
  return (
    <div
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
