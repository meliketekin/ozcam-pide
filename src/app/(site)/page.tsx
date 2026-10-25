import Link from "next/link";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Icon } from "@/components/icon";
import { PhoneLink } from "@/components/phone-link";
import { NoImage } from "@/components/no-image";
import { Photo } from "@/components/photo";
import { getGalleryImages, getPublicReviews } from "@/lib/content";
import { getFeaturedItems, getPublicMenu } from "@/lib/menu";
import { site, story } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero
        image="/images/hero-firin.jpg"
        eyebrow="Taş fırından"
        title={
          <>
            Değişmeyen Tarif,
            <br />
            <em>Sıcacık</em> Lezzet
          </>
        }
        bottom={
          <div className="flex flex-col items-center gap-1.5 text-cream/80">
            {/* İki ok sırayla aşağı akar (globals.css: .scroll-arrow) */}
            <a href="#hakkimizda" aria-label="Aşağı kaydır" className="mb-2 flex flex-col items-center hover:text-white">
              {[0, 1].map((i) => (
                <svg
                  key={i}
                  width="26"
                  height="14"
                  viewBox="0 0 26 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="scroll-arrow -mt-1 first:mt-0"
                  style={{ "--d": `${i * 0.2}s` } as React.CSSProperties}
                >
                  <path d="M2 2l11 10L24 2" />
                </svg>
              ))}
            </a>
            <PhoneLink className="inline-flex hover:text-white" />
            <p className="hidden sm:block">{site.address.join(", ")}</p>
          </div>
        }
      >
        <Link href="/menu" className="btn-primary mt-10 gap-2.5">
          <Icon name="menu" className="size-5" />
          Menüyü İncele
        </Link>
      </Hero>

      <About />
      <Categories />
      <Featured />
      <Reviews />
      <GallerySection />
      <Visit />
    </>
  );
}

function About() {
  const yearBadge = `TAŞ FIRIN • EL AÇMASI • ${story.foundedYear}'TEN BERİ • `;

  // overflow-hidden değil overflow-clip: hidden bölümü kaydırma alanı yapar ve içindeki
  // kaydırma animasyonları (view()) donar
  return (
    <section id="hakkimizda" className="scroll-mt-20 overflow-x-clip py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-12">
        {/* Farklı boyutlarda üst üste binen iki fotoğraf ve dönen rozet; metne yer kalsın diye dar */}
        <div className="relative mx-auto w-full max-w-md pt-10 pr-8 pb-16 sm:pr-12 lg:col-span-5 lg:max-w-none lg:pb-20">
          {/* Afişlerin oranı 3:4; üzerlerindeki yazılar kırpılmasın */}
          <div className="clip-reveal relative aspect-[3/4] w-[82%] overflow-clip bg-ink">
            <Photo
              src="/images/afis-1995.jpg"
              alt="Özçam Pide & Kebap'ın akşam ışıklarında dükkân cephesi — 1995'ten bugüne"
              sizes="(min-width: 1024px) 30vw, 82vw"
              className="zoom-settle"
            />
          </div>

          <div className="parallax-up absolute right-0 bottom-0 aspect-[3/4] w-[46%] border-[10px] border-white bg-white shadow-2xl shadow-ink/20">
            <div className="relative size-full overflow-hidden">
              <Photo
                src="/images/afis-servis.jpg"
                alt="Fırından yeni çıkmış sucuklu pide servis tabağında — sıcağı sıcağına servis"
                sizes="(min-width: 1024px) 17vw, 46vw"
              />
            </div>
          </div>

          {/* Büyük fotoğrafın sağ üst köşesine yapışık etiket; afişin yazılarını kapatmaz */}
          <div className="absolute top-0 left-[82%] flex size-24 -translate-x-1/2 items-center justify-center rounded-full bg-brand text-white shadow-xl sm:size-28">
            <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 size-full" aria-hidden>
              <defs>
                <path id="rozet-cember" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-current font-sans text-[8px] font-semibold uppercase">
                <textPath href="#rozet-cember" textLength="230" lengthAdjust="spacing">
                  {yearBadge}
                </textPath>
              </text>
            </svg>
            <span className="font-display text-xl leading-none font-bold italic sm:text-2xl">
              {story.foundedYear}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <p className="eyebrow reveal text-muted">Hikâyemiz</p>
          <h2 className="title-section reveal-title mt-5">
            Aynı fırın, aynı <em>tarif</em>, {story.foundedYear}&apos;ten beri
          </h2>

          <div className="lead reveal mt-8 space-y-5 text-muted">
            <p>
              <span className="text-fill fill-dark">
                {story.foundedYear}&apos;te {story.city}&apos;da tek bir taş fırın ve birkaç masayla
                açıldık. Tarif basitti: her sabah yeniden açılan hamur, dükkânda çekilen kıyma ve
                odun ateşi. Zamanla fırının yanına ocakbaşı da eklendi.
              </span>
            </p>
            <p>
              <span className="text-fill fill-dark">
                Bugün hamur hâlâ sabahın erken saatinde elde yoğruluyor, pideler hâlâ siparişle
                açılıp kürekle fırına veriliyor. Değişen tek şey, sofraya oturanların artık
                müşterimiz değil komşumuz olması.
              </span>
            </p>
          </div>

          <div className="reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/menu" className="btn-primary gap-2.5">
              <Icon name="menu" className="size-5" />
              Menüyü İncele
            </Link>
            <Link href="/#iletisim" className="text-ink underline decoration-brand underline-offset-8 hover:text-brand">
              Bizi ziyaret edin
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

async function Categories() {
  const categories = (await getPublicMenu()).filter((c) => c.items.length > 0);
  if (categories.length === 0) return null;

  return (
    <section className="bg-cream px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow reveal justify-center text-muted">Soframızdan</p>
        <h2 className="title-section reveal-title mt-4 text-center">
          Özçam Pide <em>Menüsü</em>
        </h2>

        {/* Masaüstünde kategori sayısı kadar sütun: 5-6 kategori tek sıraya sığar */}
        <ul
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-16 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-x-6"
          style={{ "--cols": categories.length } as React.CSSProperties}
        >
          {categories.map((category, index) => (
            <li
              key={category.id}
              className="reveal stagger"
              style={{ "--i": index } as React.CSSProperties}
            >
              <Link href={`/menu#kategori-${category.id}`} className="group block">
                {/* Üzerine gelince fotoğraf aşağı doğru uzar (Luxdin'deki gibi) */}
                <div className="clip-reveal relative aspect-[29/30] overflow-hidden bg-ink transition-[aspect-ratio] duration-500 ease-out group-hover:aspect-[29/35]">
                  {category.imageUrl ? (
                    <Photo
                      src={category.imageUrl}
                      alt={category.name}
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-display text-8xl font-bold text-white/10">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="title-card transition-colors group-hover:text-brand">{category.name}</h3>
                  <span className="shrink-0 text-stone">{category.items.length} çeşit</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="reveal mt-14 text-center">
          <Link href="/menu" className="btn-primary gap-2.5">
            <Icon name="menu" className="size-5" />
            Tüm Menü
          </Link>
        </p>
      </div>
    </section>
  );
}

async function Featured() {
  const items = await getFeaturedItems();
  if (items.length === 0) return null;

  return (
    <section className="px-6 pt-24 pb-28 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow reveal text-muted">Şefin önerileri</p>
            <h2 className="title-section reveal-title mt-4 max-w-2xl">
              Mutlaka <em className="text-brand">tadına bakmanız</em> gerekenler
            </h2>
          </div>
          <Link href="/menu" className="reveal text-brand hover:text-ink">
            Menünün tamamı →
          </Link>
        </div>

        {/* Kompakt yatay kartlar: solda küçük fotoğraf, sağda ad ve açıklama */}
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((item, index) => (
            // Sırayla belirme gecikmesi satır içindeki sütuna göre: kart çoğalınca sondakiler geç kalmasın
            <li key={item.id} className="reveal stagger" style={{ "--i": index % 3 } as React.CSSProperties}>
              <Link
                href={`/menu#kategori-${item.categoryId}`}
                className="group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-border bg-cream/60 p-3 pr-5 transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-xl hover:shadow-ink/10"
              >
                {/* Arkada soluk, büyük sıra numarası */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -bottom-6 font-display text-[7rem] leading-none font-bold text-ink/[0.04] transition-colors duration-500 group-hover:text-brand/10"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-ink sm:size-28">
                  {item.imageUrl ? (
                    <Photo
                      src={item.imageUrl}
                      alt={item.name}
                      sizes="112px"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <NoImage />
                  )}
                </span>

                <span className="relative min-w-0 flex-1">
                  <span className="title-card block transition-colors duration-300 group-hover:text-brand">
                    {item.name}
                  </span>
                  {item.description && (
                    <span className="mt-1 line-clamp-2 block text-sm leading-snug text-muted">{item.description}</span>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand">
                    Menüde gör
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      aria-hidden
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const quoteBandClass =
  "relative flex items-center justify-center bg-ink-deep bg-cover bg-center px-6 md:bg-fixed";

/** Müşteri yorumları; panelde yorum yoksa yerine ustanın sözü görünür. */
async function Reviews() {
  const reviews = await getPublicReviews();

  if (reviews.length === 0) {
    return (
      <section
        className={`${quoteBandClass} min-h-[70vh]`}
        style={{ backgroundImage: "url(/images/bant-firin.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="reveal relative max-w-3xl text-center text-white">
          <p className="eyebrow justify-center text-peach">Usta işi</p>
          <p className="title-section mt-6 leading-[1.1] italic">
            <span className="text-fill fill-light">
              “Odun ateşi, el açması hamur ve sabır. Bizim tarifimizin sırrı bu kadar.”
            </span>
          </p>
        </div>
      </section>
    );
  }

  // Şerit geniş ekranı da doldursun diye az yorum varsa liste tekrarlanır (en az 6 kart),
  // sonra kesintisiz döngü için bu set iki kez art arda dizilir: -%50 kayınca başa sarar
  const set = Array.from({ length: Math.ceil(6 / reviews.length) }, () => reviews).flat();
  const track = [...set, ...set];

  return (
    <section
      id="yorumlar"
      className={`${quoteBandClass} py-12 lg:py-16`}
      style={{ backgroundImage: "url(/images/bant-firin.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative w-full max-w-6xl text-white">
        <p className="eyebrow reveal justify-center text-peach">Misafirlerimiz ne diyor?</p>
        <h2 className="title-section reveal-title mt-3 text-center">
          Sofradan <em>Kalanlar</em>
        </h2>

        {/* Sola doğru sonsuz kayan şerit; üzerine gelince durur. Hareket azaltılmışsa elle kaydırılır. */}
        <div className="marquee-wrap -mx-6 mt-8 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-safe:overflow-hidden">
          <ul className="marquee flex w-max" style={{ "--duration": `${set.length * 7}s` } as React.CSSProperties}>
            {track.map((review, index) => (
              <li
                key={index}
                // Ekran okuyucu her yorumu bir kez okusun
                aria-hidden={index >= reviews.length || undefined}
                // Kartlar arası boşluk padding ile: -%50 tam bir set genişliğine denk gelsin
                className="flex w-72 shrink-0 pr-4 sm:w-80 lg:w-96 lg:pr-5"
              >
                <div className="flex w-full flex-col bg-white/20 p-6 backdrop-blur-sm">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-3 flex-1 text-base leading-[1.5]">
                    “{review.text}”
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold text-sand">{review.author}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-peach" role="img" aria-label={`5 üzerinden ${rating} yıldız`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </div>
  );
}

async function GallerySection() {
  const images = await getGalleryImages();
  if (images.length === 0) return null;

  return (
    <section id="galeri" className="scroll-mt-20 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow reveal text-muted">Galeri</p>
            <h2 className="title-section reveal-title mt-4">
              Fırından, Sofradan <em>Kareler</em>
            </h2>
          </div>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal inline-flex items-center gap-2 text-brand hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
              className="size-5 shrink-0"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
            Instagram&apos;da takip edin →
          </a>
        </div>
        <div className="mt-12">
          <Gallery images={images} />
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="iletisim" className="scroll-mt-20 bg-cream px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* İnce çerçeve: beyaz paspartu + ince kenar çizgisi */}
        <div className="clip-side border border-ink/15 bg-white p-2 shadow-2xl shadow-ink/10">
          <div className="relative aspect-[4/3] bg-sand/40">
            <iframe
              src={site.mapsEmbedUrl}
              title={`${site.name} harita konumu`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
            {/* Sol üstteki bilgi kartı (Google'ın koordinat kutusunu da örter) */}
            <div className="absolute top-2 left-2 max-w-[calc(100%-1rem)] space-y-1 bg-white px-3 py-2.5 text-xs leading-snug text-muted shadow-lg sm:max-w-56">
              <p className="font-display text-base font-bold text-ink">{site.name}</p>
              <p className="hidden sm:block">{site.address.join(", ")}</p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block pt-0.5 font-bold text-brand hover:text-ink"
              >
                Yol tarifi al →
              </a>
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow reveal text-muted">Bizi ziyaret edin</p>
          <h2 className="title-section reveal-title mt-5 text-brand">
            Sıcak Bir Sofra, <em>Samimi</em> Bir Ortam
          </h2>
          <p className="lead reveal mt-6 text-muted">
            Ailenizle, dostlarınızla ya da öğle arasında tek başınıza… Fırından yeni çıkmış
            pidenizi sıcak sıcak sofranızda servis ediyoruz.
          </p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="reveal stagger">
              <dt className="title-card flex items-center gap-2 text-ink">
                <Icon name="pin" className="size-5 text-brand" />
                Adres
              </dt>
              <dd className="mt-3 text-muted">
                {site.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div className="reveal stagger" style={{ "--i": 1 } as React.CSSProperties}>
              <dt className="title-card flex items-center gap-2 text-ink">
                <Icon name="clock" className="size-5 text-brand" />
                Saatler
              </dt>
              <dd className="mt-3 text-muted">
                {site.hours.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <PhoneLink className="mt-1 flex hover:text-brand" />
              </dd>
            </div>
          </dl>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary reveal mt-10 gap-2.5">
            <Icon name="directions" className="size-5" />
            Yol Tarifi Al
          </a>
        </div>
      </div>
    </section>
  );
}
