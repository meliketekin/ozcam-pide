import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const MENU_TAG = "menu";

/** Ziyaretçilere gösterilen menü — önbellekte tutulur, admin değişikliğinde yenilenir. */
export async function getPublicMenu() {
  "use cache";
  cacheLife("max");
  cacheTag(MENU_TAG);

  return db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
  });
}

/** Anasayfadaki "denemeniz gerekenler" bölümü için öne çıkan ürünler. */
export async function getFeaturedItems() {
  "use cache";
  cacheLife("max");
  cacheTag(MENU_TAG);

  return db.menuItem.findMany({
    where: { isFeatured: true, isAvailable: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    take: 3,
  });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(price);
}
