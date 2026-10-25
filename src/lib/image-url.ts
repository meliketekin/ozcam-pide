// next.config.ts → images.remotePatterns ile aynı alan adı
const BLOB_HOST = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//;

/** Yerel (/images, /uploads) ve kendi Blob fotoğraflarımız optimize edilir; adminden girilen dış adresler olduğu gibi gösterilir. */
export function isUnoptimized(src: string) {
  return src.startsWith("http") && !BLOB_HOST.test(src);
}

/** Galeride fotoğraf yerine video (ör. /images/konum.mp4) gösterilecek mi? */
export function isVideo(src: string) {
  return /\.(mp4|webm)$/i.test(src);
}
