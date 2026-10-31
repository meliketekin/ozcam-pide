import { site, siteUrl, story } from "@/lib/site";

// schema.org yapılandırılmış verisi: Google'ın işletme bilgi kartı, harita ve menü
// sonuçları için. Doğrulama: https://search.google.com/test/rich-results

const restaurantId = `${siteUrl}/#restaurant`;

/** Görsel yolu tam adrese çevrilir (yerel /images yolları ve Blob adresleri). */
export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

export function restaurantJsonLd() {
  const s = site.schema;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        inLanguage: "tr-TR",
        publisher: { "@id": restaurantId },
      },
      {
        "@type": "Restaurant",
        "@id": restaurantId,
        name: site.name,
        alternateName: "Özçam Pide & Kebap",
        description: site.description,
        url: siteUrl,
        image: [
          absoluteUrl("/images/hero-firin.jpg"),
          absoluteUrl("/images/afis-1995.jpg"),
          absoluteUrl("/images/afis-servis.jpg"),
        ],
        logo: absoluteUrl("/icon.png"),
        telephone: s.phone,
        email: site.email,
        priceRange: s.priceRange,
        servesCuisine: s.cuisine,
        foundingDate: String(story.foundedYear),
        currenciesAccepted: "TRY",
        hasMenu: `${siteUrl}/menu`,
        address: {
          "@type": "PostalAddress",
          streetAddress: s.street,
          addressLocality: s.district,
          addressRegion: s.city,
          postalCode: s.postalCode,
          addressCountry: "TR",
        },
        geo: { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng },
        hasMap: site.mapsUrl,
        areaServed: { "@type": "City", name: s.city },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: s.openDays,
            opens: s.opens,
            closes: s.closes,
          },
        ],
        sameAs: Object.values(site.social),
      },
    ],
  };
}

type MenuCategory = {
  id: number;
  name: string;
  items: { name: string; description: string | null; price: number; imageUrl: string | null }[];
};

export function menuJsonLd(categories: MenuCategory[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Menu",
        "@id": `${siteUrl}/menu#menu`,
        name: `${site.name} Menüsü`,
        url: `${siteUrl}/menu`,
        inLanguage: "tr-TR",
        provider: { "@id": restaurantId },
        hasMenuSection: categories.map((category) => ({
          "@type": "MenuSection",
          name: category.name,
          url: `${siteUrl}/menu#kategori-${category.id}`,
          hasMenuItem: category.items.map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            ...(item.description && { description: item.description }),
            ...(item.imageUrl && { image: absoluteUrl(item.imageUrl) }),
            offers: {
              "@type": "Offer",
              price: item.price.toFixed(2),
              priceCurrency: "TRY",
            },
          })),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Anasayfa", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Menü", item: `${siteUrl}/menu` },
        ],
      },
    ],
  };
}
