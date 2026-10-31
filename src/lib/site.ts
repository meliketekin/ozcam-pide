/**
 * Sitenin kalıcı adresi (canonical, sitemap, Open Graph). Özel alan adı bağlanınca
 * Vercel'de NEXT_PUBLIC_SITE_URL=https://alanadi.com tanımlanmalı; tanımlı değilse
 * Vercel'in üretim alan adı, o da yoksa localhost kullanılır.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// İşletme bilgileri — adres, saatler ve konum işletmenin Google / Restaurant Guru kaydından
export const site = {
  name: "Özçam Pide",
  // Arama sonuçlarında görünen başlık ve açıklama (başlık ~60, açıklama ~155 karakter)
  seoTitle: "Özçam Pide | Kepez Antalya Taş Fırın Pide, Lahmacun & Kebap",
  description:
    "1995'ten beri Antalya Kepez'de taş fırında el açması pide, lahmacun ve ocakbaşı kebap. Menü, fiyatlar, adres ve çalışma saatleri.",
  slogan: "Taş fırından sofranıza, geleneksel pide ve lahmacun.",
  address: ["Yeni Mah. Karatay Cad. No: 39/1", "07090 Kepez / Antalya"],
  phone: "0 (538) 300 03 20",
  email: "ozcampide.antalya@gmail.com",
  hours: ["Salı – Pazar 11:00 – 21:45", "Pazartesi kapalı"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Özçam+Pide+Kebap+Kepez+Antalya",
  // Haritada gösterilecek yer (restoranın konumu); API anahtarı gerekmez (z = yakınlık)
  mapsEmbedUrl: "https://www.google.com/maps?q=36.9231735,30.7074714&z=17&output=embed",
  social: {
    instagram: "https://instagram.com/ozcampideantalya",
  },
  // Yapılandırılmış veri (schema.org) için — yukarıdaki görünen bilgilerle tutarlı tutulmalı
  schema: {
    phone: "+905383000320",
    street: "Yeni Mah. Karatay Cad. No: 39/1",
    postalCode: "07090",
    district: "Kepez",
    city: "Antalya",
    geo: { lat: 36.9231735, lng: 30.7074714 },
    cuisine: ["Türk Mutfağı", "Pide", "Lahmacun", "Kebap"],
    priceRange: "₺₺",
    // Salı–Pazar 11:00–21:45, Pazartesi kapalı
    openDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "11:00",
    closes: "21:45",
  },
};

// Hikâyemiz bölümü — yıl ve şehir işletmenin afişlerinden
export const story = {
  foundedYear: 1995,
  city: "Antalya",
};

// `section`: anasayfadaki bölümün id'si ("top" = sayfanın başı)
export const navLinks = [
  { href: "/", label: "Anasayfa", section: "top" },
  { href: "/menu", label: "Menü" },
  { href: "/#hakkimizda", label: "Hakkımızda", section: "hakkimizda" },
  { href: "/#galeri", label: "Galeri", section: "galeri" },
  { href: "/#iletisim", label: "İletişim", section: "iletisim" },
];

export const homeSections = navLinks.flatMap((link) =>
  link.section && link.section !== "top" ? [link.section] : [],
);
