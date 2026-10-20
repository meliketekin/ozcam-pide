# Özçam Pide

Tanıtım sitesi + menü yönetim paneli. Next.js 16, Prisma 7, SQLite, Tailwind CSS.

Tasarım: Cormorant Garamond (başlıklar) + Inter (metin). Yazı ölçeği (`title-hero`, `title-section`, `title-card`, `lead` vb.) ve renkler `src/app/globals.css` içinde tanımlı.

## Kurulum

Node.js 20.9 veya üstü gerekir.

```bash
npm install          # Prisma client da otomatik üretilir
npm run db:migrate   # veritabanını oluşturur (prisma/dev.db)
npm run db:seed      # örnek menüyü ekler
npm run dev
```

- Site: http://localhost:3000
- Menü: http://localhost:3000/menu
- Yönetim paneli: http://localhost:3000/admin (şifre `.env` içindeki `ADMIN_PASSWORD`)

## Ortam değişkenleri (`.env`)

| Değişken         | Açıklama                                   |
| ---------------- | ------------------------------------------ |
| `DATABASE_URL`   | SQLite dosya yolu (`file:./prisma/dev.db`) |
| `ADMIN_PASSWORD` | `/admin` giriş şifresi                     |
| `SESSION_SECRET` | Oturum çerezini imzalayan gizli anahtar    |

## Yapı

```
prisma/schema.prisma        Category, MenuItem, Review ve GalleryImage tabloları
src/app/(site)/             Ziyaretçi sayfaları (ana sayfa, /menu)
src/app/admin/              Yönetim paneli (Menü / Yorumlar / Galeri sekmeleri), giriş ve server action'lar
src/lib/auth.ts             Şifre kontrolü ve imzalı oturum çerezi
src/lib/menu.ts             Önbellekli menü sorguları
src/lib/content.ts          Önbellekli yorum ve galeri sorguları
src/lib/site.ts             Adres, telefon, saatler, harita, sosyal medya, hikâye bilgileri
src/components/             Header, footer, hero vb.
src/lib/storage.ts          Fotoğraf yükleme (yerelde uploads/, Vercel'de Vercel Blob)
public/images/              Sitenin sabit görselleri
src/proxy.ts                /admin için giriş yönlendirmesi
```

Menü sayfaları önbellekten sunulur; panelde yapılan her değişiklik önbelleği anında yeniler.

Veritabanını tarayıcıda görmek için: `npm run db:studio`

## Fotoğraf yükleme

Admin panelinde her kategori ve ürünün solundaki kutuya tıklayıp fotoğraf seçilir. Fotoğraf tarayıcıda en fazla 1600 px'e küçültülüp WebP'ye çevrilir (telefon fotoğrafı ~3 MB → ~200 KB), sonra **Kaydet** ile yüklenir. Fotoğraf değiştirilince ya da ürün silinince eski dosya da silinir.

- **Yerelde:** dosyalar proje kökündeki `uploads/` klasörüne kaydedilir (git'e eklenmez).
- **Vercel'de:** sunucu diski kalıcı olmadığı için Vercel Blob kullanılır. Vercel projesinde *Storage → Blob → Create* ile **public** bir store oluşturup projeye bağlamak yeterli; `BLOB_READ_WRITE_TOKEN` (veya `BLOB_STORE_ID`) tanımlı olduğunda kod otomatik olarak Blob'a yükler.

## Görseller

`public/images` altındaki `afis-*.jpg` dosyaları işletmenin kendi afişleridir (galeri ve Hikâyemiz bölümünde olduğu gibi gösterilir). `hero-pide`, `bant-firin`, `menu-kebap` ve ürün/kategori görselleri bu afişlerin yazısız kısımlarından kırpılmıştır.

`kategori-lahmacun.jpg` ve `kategori-tatlilar.jpg` Wikimedia Commons'tan alınmış CC0 (kamu malı) görsellerdir; atıf gerektirmez.

`hero-firin.jpg` (anasayfa hero) Wikimedia Commons'tan, CC BY 2.0 lisanslıdır (William Neuheisel). Lisans gereği hero'nun sağ alt köşesinde atıf satırı gösterilir; fotoğraf değiştirilirse `credit` da kaldırılmalı. Başka bir atıf gerektiren görsel eklenirse aynı şekilde atıf verilmeli.
