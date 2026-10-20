import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/storage";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

// Yerelde yüklenen fotoğrafları sunar (Vercel Blob kullanılırken devreye girmez)
export async function GET(_request: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;

  // Sadece bizim ürettiğimiz dosya adlarına izin ver (klasör dışına çıkılamasın)
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp|avif)$/.test(file)) {
    return new Response("Bulunamadı", { status: 404 });
  }

  try {
    const data = await readFile(path.join(UPLOAD_DIR, file));
    return new Response(data, {
      headers: {
        "Content-Type": CONTENT_TYPES[path.extname(file)],
        // Dosya adları benzersiz, içerik hiç değişmez
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Bulunamadı", { status: 404 });
  }
}
