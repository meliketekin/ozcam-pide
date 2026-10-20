import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const REVIEWS_TAG = "reviews";
export const GALLERY_TAG = "gallery";

/** Anasayfada gösterilen müşteri yorumları — admin değişikliğinde yenilenir. */
export async function getPublicReviews() {
  "use cache";
  cacheLife("max");
  cacheTag(REVIEWS_TAG);

  return db.review.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}

export async function getGalleryImages() {
  "use cache";
  cacheLife("max");
  cacheTag(GALLERY_TAG);

  return db.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}
