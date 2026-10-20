import { cacheLife } from "next/cache";
import { Logo } from "@/components/logo";
import { SocialIcons } from "@/components/social-icons";
import { site } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function Column({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  return (
    <div className="reveal stagger" style={{ "--i": index } as React.CSSProperties}>
      <h3 className="title-card mb-5 text-white">{title}</h3>
      <div className="space-y-1 text-sand">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep text-center text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-24 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-5">
          <Logo className="text-white" />
          <p className="text-sand">{site.slogan}</p>
        </div>
        <Column title="Adres" index={1}>
          {site.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="pt-4">
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
          </p>
        </Column>
        <Column title="Saatler" index={2}>
          {site.hours.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="pt-4">
            <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="hover:text-white">
              {site.phone}
            </a>
          </p>
        </Column>
        <Column title="Sosyal Medya" index={3}>
          <SocialIcons />
        </Column>
      </div>

      <div className="mx-auto max-w-6xl border-t border-white/10 px-6 py-8 text-sand">
        <p>
          {site.name} © <CurrentYear />. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
