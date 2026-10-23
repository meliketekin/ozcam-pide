import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Admin panelinden Vercel Blob'a yüklenen fotoğraflar da optimize edilip önbellekten sunulsun
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    // Yüklenen dosya adları benzersiz, içerik değişmez: optimize edilmiş hali uzun süre önbellekte kalsın
    minimumCacheTTL: 2678400,
  },
  experimental: {
    serverActions: {
      // Admin panelinden fotoğraf yükleme (Vercel'in 4,5 MB istek sınırının altında)
      bodySizeLimit: "4mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
