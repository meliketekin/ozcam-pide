import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Vercel'den çekilen .env.local önce gelir
config({ path: [".env.local", ".env"], quiet: true });

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

type SeedItem = {
  name: string;
  description: string | null;
  price: number;
  imageUrl?: string;
  isFeatured?: boolean;
};

const menu: { name: string; imageUrl?: string; items: SeedItem[] }[] = [
  {
    name: "Pideler",
    imageUrl: "/images/kategori-pideler.jpg",
    items: [
      { name: "Kıymalı Pide", description: "Özel baharatlı dana kıyma, domates, biber", price: 220, imageUrl: "/images/kiymali-pide.jpg", isFeatured: true },
      { name: "Kuşbaşılı Pide", description: "Dana kuşbaşı, domates, biber", price: 280, imageUrl: "/images/kusbasili-pide.jpg" },
      { name: "Kaşarlı Pide", description: "Bol kaşar peyniri", price: 200 },
      { name: "Karışık Pide", description: "Kıyma, kaşar, sucuk, yumurta", price: 300, imageUrl: "/images/karisik-pide.jpg", isFeatured: true },
    ],
  },
  {
    name: "Lahmacun & Dürüm",
    imageUrl: "/images/kategori-lahmacun.jpg",
    items: [
      { name: "Lahmacun", description: "İnce hamur, maydanoz ve limon ile", price: 90, imageUrl: "/images/kategori-lahmacun.jpg" },
      { name: "Tavuk Dürüm", description: "Lavaş, ızgara tavuk, yeşillik", price: 160 },
    ],
  },
  {
    name: "Tatlılar",
    imageUrl: "/images/kategori-tatlilar.jpg",
    items: [
      { name: "Künefe", description: "Hatay peyniri, şerbet ve antep fıstığı", price: 180, imageUrl: "/images/kategori-tatlilar.jpg", isFeatured: true },
    ],
  },
  {
    name: "İçecekler",
    items: [
      { name: "Ayran", description: "Bakır bardakta, köpüklü", price: 30 },
      { name: "Şalgam", description: null, price: 35 },
      { name: "Çay", description: null, price: 15 },
    ],
  },
];

// İşletmenin kendi afişleri
const gallery = [
  { imageUrl: "/images/afis-1995.jpg", caption: "1995'ten bugüne Özçam Pide & Kebap" },
  { imageUrl: "/images/afis-odun-atesi.jpg", caption: "Odun ateşinde gerçek lezzet" },
  { imageUrl: "/images/afis-kebap.jpg", caption: "Kebapta ustalık" },
  { imageUrl: "/images/afis-kiymali-pide.jpg", caption: "İmza ürünümüz: kıymalı pide" },
  { imageUrl: "/images/afis-servis.jpg", caption: "Sıcağı sıcağına servis" },
  { imageUrl: "/images/afis-antalya.jpg", caption: "Antalya'da lezzetin adresi" },
];

// Var olan kayıtları ezmez: eksik kategori/ürünleri ekler, boş görselleri doldurur.
async function main() {
  for (const [i, category] of menu.entries()) {
    let row = await db.category.findFirst({ where: { name: category.name } });
    if (!row) {
      row = await db.category.create({
        data: { name: category.name, imageUrl: category.imageUrl, sortOrder: i },
      });
    } else if (!row.imageUrl && category.imageUrl) {
      await db.category.update({ where: { id: row.id }, data: { imageUrl: category.imageUrl } });
    }

    for (const [j, item] of category.items.entries()) {
      const existing = await db.menuItem.findFirst({
        where: { name: item.name, categoryId: row.id },
      });
      if (!existing) {
        await db.menuItem.create({ data: { ...item, categoryId: row.id, sortOrder: j } });
      } else if (!existing.imageUrl && item.imageUrl) {
        await db.menuItem.update({
          where: { id: existing.id },
          data: { imageUrl: item.imageUrl, isFeatured: item.isFeatured ?? existing.isFeatured },
        });
      }
    }
  }

  // Galeri yalnızca boşken doldurulur
  if ((await db.galleryImage.count()) === 0) {
    await db.galleryImage.createMany({
      data: gallery.map((image, i) => ({ ...image, sortOrder: i })),
    });
  }
  console.log("Örnek menü ve galeri hazır.");
}

main().finally(() => db.$disconnect());
