"use client";

import { useEffect, useRef, useState } from "react";

// Bu çizginin üstüne gelen bölüm aktif sayılır (header + bu çubuk + biraz pay)
const ACTIVE_LINE = 200;

/** Menü sayfasında yapışkan kategori çubuğu: kaydırdıkça aktif kategoriyi işaretler. */
export function MenuNav({ categories }: { categories: { id: number; name: string }[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(categories[0]?.id);
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = categories[0]?.id;
      for (const category of categories) {
        const section = document.getElementById(`kategori-${category.id}`);
        if (section && section.getBoundingClientRect().top <= ACTIVE_LINE) current = category.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [categories]);

  // Alttaki çizgiyi aktif kategoriye kaydır; mobilde aktif kategoriyi ortala
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;

    const measure = () => setBar({ left: link.offsetLeft, width: link.offsetWidth });
    measure();
    // Yazı tipi geç yüklenirse genişlikler değişir
    document.fonts.ready.then(measure);
    list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <nav className="sticky top-[72px] z-30 border-b border-border bg-white/90 backdrop-blur">
      <ul
        ref={listRef}
        className="relative mx-auto flex max-w-6xl gap-8 overflow-x-auto px-6 whitespace-nowrap [scrollbar-width:none]"
      >
        {categories.map((category) => (
          <li key={category.id}>
            <a
              href={`#kategori-${category.id}`}
              data-id={category.id}
              aria-current={active === category.id ? "true" : undefined}
              className={`block py-4 transition-colors duration-300 hover:text-brand ${
                active === category.id ? "text-ink" : "text-muted"
              }`}
            >
              {category.name}
            </a>
          </li>
        ))}
        <span
          aria-hidden
          className="absolute bottom-0 h-0.5 bg-brand transition-all duration-500 ease-out"
          style={{ left: bar.left, width: bar.width }}
        />
      </ul>
    </nav>
  );
}
