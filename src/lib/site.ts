// İşletme bilgileri — gerçek bilgilerle güncelle
export const site = {
  name: "Özçam Pide",
  slogan: "Taş fırından sofranıza, geleneksel pide ve lahmacun.",
  address: ["Örnek Mah. Fırın Sok. No: 1", "Kadıköy / İstanbul"],
  phone: "0 (212) 000 00 00",
  email: "info@ozcampide.com",
  hours: ["Her gün 10:00 – 23:00"],
  mapsUrl: "https://maps.google.com/?q=Özçam+Pide",
  // Haritada gösterilecek yer; API anahtarı gerekmez. Şimdilik semt merkezi gösteriliyor —
  // işletme Google Maps'te çıkınca "q=" kısmına adını ya da tam adresini yaz (z = yakınlık).
  mapsEmbedUrl: "https://www.google.com/maps?q=Kadıköy,+İstanbul&z=15&output=embed",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    whatsapp: "https://wa.me/900000000000",
  },
};

// Hikâyemiz bölümü — yıl ve şehir işletmenin afişlerinden; isimler ÖRNEKTİR,
// yayından önce gerçekleriyle değiştir
export const story = {
  foundedYear: 1995,
  city: "Antalya",
  founder: "Hasan Usta",
  currentMaster: "Murat Usta",
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
