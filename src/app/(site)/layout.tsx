import { BackToTop } from "@/components/back-to-top";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { restaurantJsonLd } from "@/lib/structured-data";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={restaurantJsonLd()} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
