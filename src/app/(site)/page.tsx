import Link from "next/link";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Photo } from "@/components/photo";
import { getGalleryImages, getPublicReviews } from "@/lib/content";
import { formatPrice, getFeaturedItems, getPublicMenu } from "@/lib/menu";
import { site, story } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero
        image="/images/hero-firin.jpg"
        // CC BY 2.0 lisansı atıf istiyor
        credit={{
          text: "Fotoğraf: William Neuheisel, CC BY 2.0",
          href: "https://commons.wikimedia.org/wiki/File:Pide_(6377363891).jpg",
        }}
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
            <a href="#hakkimizda" aria-label="Aşağı kaydır" className="mb-3 hover:text-white">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor">
                <path d="M1 1h20L11 17z" />
              </svg>
            </a>
            <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="hover:text-white">
              {site.phone}
            </a>
            <p className="hidden sm:block">{site.address.join(", ")}</p>
          </div>
        }
      >
        <Link href="/menu" className="btn-primary mt-10">
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
                {story.founder}, {story.foundedYear}&apos;te {story.city}&apos;daki ilk dükkânını tek bir
                taş fırın ve birkaç masayla açtı. Tarif basitti: her sabah yeniden açılan hamur,
                dükkânda çekilen kıyma ve odun ateşi. Zamanla fırının yanına ocakbaşı da eklendi.
              </span>
            </p>
            <p>
              <span className="text-fill fill-dark">
                Bugün fırının başında {story.currentMaster} var. Hamur hâlâ sabahın erken saatinde
                elde yoğruluyor, pideler hâlâ siparişle açılıp kürekle fırına veriliyor. Değişen
                tek şey, sofraya oturanların artık müşterimiz değil komşumuz olması.
              </span>
            </p>
          </div>

          <div className="reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/menu" className="btn-primary">
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
          <Link href="/menu" className="btn-primary">
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
      <h2 className="title-section reveal-title mx-auto max-w-4xl text-center text-brand">
        Mutlaka <em>tadına bakmanız</em> gerekenler
      </h2>

      <div className="mx-auto mt-16 grid max-w-6xl gap-14 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="reveal stagger group text-center"
            style={{ "--i": index } as React.CSSProperties}
          >
            <div className="relative mx-auto aspect-square w-full max-w-[280px]">
              <span
                className="parallax-up absolute -top-8 -right-8 size-20 rounded-full bg-cream"
                style={{ "--parallax": "30px" } as React.CSSProperties}
              />
              <div className="tilt-in relative size-full overflow-hidden rounded-2xl bg-cream">
                {item.imageUrl && (
                  <Photo
                    src={item.imageUrl}
                    alt={item.name}
                    sizes="280px"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
            </div>
            <h3 className="title-card mt-8">{item.name}</h3>
            <p className="mt-1 text-brand">Denediniz mi?</p>
            <p className="lead mt-2 text-stone">{formatPrice(item.price)}</p>
          </div>
        ))}
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

  return (
    <section
      id="yorumlar"
      className={`band-scroll ${quoteBandClass} py-12 lg:py-16`}
      style={{ backgroundImage: "url(/images/bant-firin.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative w-full max-w-6xl text-white">
        <p className="eyebrow reveal justify-center text-peach">Misafirlerimiz ne diyor?</p>
        <h2 className="title-section reveal-title mt-3 text-center">
          Sofradan <em>Kalanlar</em>
        </h2>

        {/* Yorum çoksa yana kaydırılır */}
        <ul
          className={`-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:thin] lg:gap-5 ${
            reviews.length < 3 ? "sm:justify-center" : ""
          }`}
        >
          {reviews.map((review, index) => (
            <li
              key={review.id}
              style={{ "--i": Math.min(index, 3) } as React.CSSProperties}
              className="band-item flex shrink-0 basis-[85%] snap-center flex-col bg-white/[0.07] p-6 backdrop-blur-sm sm:basis-[calc(50%-8px)] lg:basis-[calc((100%-40px)/3)]"
            >
              <Stars rating={review.rating} />
              <blockquote className="mt-3 flex-1 text-base leading-[1.5]">
                “{review.text}”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-sand">
                {review.author}
              </p>
            </li>
          ))}
        </ul>
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
            className="reveal text-brand hover:text-ink"
          >
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
        <div className="clip-side relative aspect-[4/3] bg-sand/40 shadow-2xl shadow-ink/10">
          <iframe
            src={site.mapsEmbedUrl}
            title={`${site.name} harita konumu`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0"
          />
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
              <dt className="title-card text-ink">Adres</dt>
              <dd className="mt-3 text-muted">
                {site.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div className="reveal stagger" style={{ "--i": 1 } as React.CSSProperties}>
              <dt className="title-card text-ink">Saatler</dt>
              <dd className="mt-3 text-muted">
                {site.hours.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="mt-1 block hover:text-brand">
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary reveal mt-10">
            Yol Tarifi Al
          </a>
        </div>
      </div>
    </section>
  );
}
