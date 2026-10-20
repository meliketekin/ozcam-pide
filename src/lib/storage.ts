import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

// Vercel Blob bağlıysa oraya, değilse projedeki uploads/ klasörüne kaydeder.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const LOCAL_PREFIX = "/uploads/";
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Yüklenen fotoğrafı kaydeder ve sitede kullanılacak adresini döner. */
export async function saveImage(file: File) {
  const ext = EXTENSIONS[file.type];
  if (!ext) throw new Error("Sadece JPG, PNG, WebP veya AVIF yüklenebilir.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Fotoğraf 4 MB'tan büyük olamaz.");

  const name = `${randomUUID()}.${ext}`;

  if (useBlob) {
    const blob = await put(`menu/${name}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `${LOCAL_PREFIX}${name}`;
}

/** Yalnızca bizim yüklediğimiz fotoğrafları siler; /images/... gibi sabit görsellere dokunmaz. */
export async function deleteImage(url: string | null | undefined) {
  if (!url) return;
  try {
    if (url.startsWith(LOCAL_PREFIX)) {
      await unlink(path.join(UPLOAD_DIR, path.basename(url)));
    } else if (useBlob && url.includes(".blob.vercel-storage.com/")) {
      await del(url);
    }
  } catch (error) {
    // Dosya zaten yoksa kaydı yine de güncelleyebilelim
    console.error("Görsel silinemedi:", url, error);
  }
}
