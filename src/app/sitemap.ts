import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
      images: [
        `${siteUrl}/images/hero-firin.jpg`,
        `${siteUrl}/images/afis-1995.jpg`,
        `${siteUrl}/images/afis-servis.jpg`,
      ],
    },
    {
      url: `${siteUrl}/menu`,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${siteUrl}/images/menu-kebap.jpg`],
    },
  ];
}
