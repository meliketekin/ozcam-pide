// İşletme bilgileri — adres, saatler ve konum işletmenin Google / Restaurant Guru kaydından
export const site = {
  name: "Özçam Pide",
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
