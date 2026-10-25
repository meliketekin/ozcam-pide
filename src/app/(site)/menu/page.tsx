import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { MenuNav } from "@/components/menu-nav";
import { NoImage } from "@/components/no-image";
import { Photo } from "@/components/photo";
import { formatPrice, getPublicMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menü",
};

export default function MenuPage() {
  return (
    <>
      <Hero image="/images/menu-kebap.jpg" eyebrow="Soframızdan" title="Menümüz" size="compact">
        <p className="lead mx-auto mt-6 max-w-xl text-cream/80">
          Taş fırından sofranıza; her gün taze hazırlanan lezzetler.
        </p>
      </Hero>
      <MenuSections />
    </>
  );
}

async function MenuSections() {
  const categories = (await getPublicMenu()).filter((c) => c.items.length > 0);

  if (categories.length === 0) {
    return <p className="py-32 text-center text-muted">Menü yakında burada olacak.</p>;
  }

  return (
    <>
      <MenuNav categories={categories.map(({ id, name }) => ({ id, name }))} />

      {categories.map((category, index) => (
        <section
          key={category.id}
          id={`kategori-${category.id}`}
          className={`scroll-mt-36 px-6 py-20 lg:py-28 ${index % 2 === 1 ? "bg-cream" : ""}`}
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-6">
              <div>
                <p className="eyebrow reveal text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="title-section reveal-title mt-4">{category.name}</h2>
              </div>
              <p className="reveal shrink-0 text-stone">{category.items.length} çeşit</p>
            </div>

            <ul className="grid gap-x-16 md:grid-cols-2">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  className="reveal group flex gap-5 border-b border-border py-6 md:-mx-4 md:px-4 transition-colors duration-300 hover:bg-ink/[0.03]"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-ink sm:size-24">
                    {item.imageUrl ? (
                      <Photo
                        src={item.imageUrl}
                        alt={item.name}
                        sizes="96px"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <NoImage />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 self-center">
                    <div className="flex items-baseline gap-3">
                      <h3 className="title-card transition-colors duration-300 group-hover:text-brand">
                        {item.name}
                      </h3>
                      <span className="draw-line flex-1 translate-y-[-4px] border-b border-dashed border-sand" />
                      <span className="lead shrink-0 text-brand">{formatPrice(item.price)}</span>
                    </div>
                    {item.description && <p className="mt-1.5 text-muted">{item.description}</p>}
                    {item.isFeatured && (
                      <span className="mt-3 inline-block bg-brand/10 px-2.5 py-1 text-xs tracking-[0.2em] text-brand uppercase">
                        Şefin önerisi
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
