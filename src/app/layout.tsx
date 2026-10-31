import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // Canonical, Open Graph ve görsel adresleri bu adrese göre tam URL'ye çevrilir
  metadataBase: new URL(siteUrl),
  title: {
    default: site.seoTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  category: "restaurant",
  keywords: [
    "Özçam Pide",
    "Kepez pide",
    "Antalya pide",
    "taş fırın pide",
    "lahmacun Antalya",
    "Kepez lahmacun",
    "kebap Kepez",
    "pideci Antalya",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: site.name,
    title: site.seoTitle,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Google Search Console doğrulaması: Vercel'de GOOGLE_SITE_VERIFICATION tanımlanınca eklenir
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    // Yerel arama için konum sinyali
    "geo.region": "TR-07",
    "geo.placename": `${site.schema.district}, ${site.schema.city}`,
    "geo.position": `${site.schema.geo.lat};${site.schema.geo.lng}`,
    ICBM: `${site.schema.geo.lat}, ${site.schema.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#22150d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-base leading-[1.4]">{children}</body>
    </html>
  );
}
