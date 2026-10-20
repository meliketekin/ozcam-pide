"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, deleteSession, requireAdmin } from "@/lib/auth";
import { GALLERY_TAG, REVIEWS_TAG } from "@/lib/content";
import { db } from "@/lib/db";
import { MENU_TAG } from "@/lib/menu";
import { deleteImage, saveImage } from "@/lib/storage";

// --- Giriş / çıkış ---

export async function login(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Şifre hatalı." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// --- Yardımcılar ---

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readRequired(formData: FormData, key: string) {
  const value = readText(formData, key);
  if (!value) throw new Error(`"${key}" alanı boş olamaz.`);
  return value;
}

function readImageUrl(formData: FormData) {
  const value = readText(formData, "imageUrl");
  if (!value) return null;
  if (!value.startsWith("/") && !/^https?:\/\//.test(value)) {
    throw new Error("Görsel adresi / veya http(s):// ile başlamalı.");
  }
  return value;
}

/** Yeni fotoğraf seçildiyse yükler; değilse formdaki mevcut adresi (ya da kaldırıldıysa null) döner. */
async function resolveImage(formData: FormData) {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) return saveImage(file);
  return readImageUrl(formData);
}

/** Kayıt güncellendikten sonra artık kullanılmayan eski fotoğrafı siler. */
async function cleanupImage(previous: string | null, current: string | null) {
  if (previous && previous !== current) await deleteImage(previous);
}

function readInt(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  if (!Number.isInteger(value)) throw new Error(`"${key}" geçersiz.`);
  return value;
}

function readPrice(formData: FormData) {
  // "250,50" gibi Türkçe yazımı da kabul et
  const value = Number(readText(formData, "price").replace(",", "."));
  if (!Number.isFinite(value) || value < 0) throw new Error("Fiyat geçersiz.");
  return value;
}

// --- Kategoriler ---

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = readRequired(formData, "name");
  const last = await db.category.findFirst({ orderBy: { sortOrder: "desc" } });
  await db.category.create({
    data: {
      name,
      imageUrl: await resolveImage(formData),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  updateTag(MENU_TAG);
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = readInt(formData, "id");
  const data = {
    name: readRequired(formData, "name"),
    sortOrder: readInt(formData, "sortOrder"),
  };
  const previous = await db.category.findUniqueOrThrow({ where: { id } });
  const imageUrl = await resolveImage(formData);
  await db.category.update({ where: { id }, data: { ...data, imageUrl } });
  await cleanupImage(previous.imageUrl, imageUrl);
  updateTag(MENU_TAG);
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = readInt(formData, "id");
  const items = await db.menuItem.findMany({ where: { categoryId: id }, select: { imageUrl: true } });
  // Kategorideki ürünler de silinir (onDelete: Cascade)
  const category = await db.category.delete({ where: { id } });
  for (const url of [category.imageUrl, ...items.map((item) => item.imageUrl)]) {
    await deleteImage(url);
  }
  updateTag(MENU_TAG);
}

// --- Ürünler ---

export async function createItem(formData: FormData) {
  await requireAdmin();
  const categoryId = readInt(formData, "categoryId");
  const data = {
    categoryId,
    name: readRequired(formData, "name"),
    description: readText(formData, "description") || null,
    price: readPrice(formData),
  };
  const last = await db.menuItem.findFirst({
    where: { categoryId },
    orderBy: { sortOrder: "desc" },
  });
  await db.menuItem.create({
    data: {
      ...data,
      imageUrl: await resolveImage(formData),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  updateTag(MENU_TAG);
}

export async function updateItem(formData: FormData) {
  await requireAdmin();
  const id = readInt(formData, "id");
  const data = {
    name: readRequired(formData, "name"),
    description: readText(formData, "description") || null,
    price: readPrice(formData),
    sortOrder: readInt(formData, "sortOrder"),
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };
  const previous = await db.menuItem.findUniqueOrThrow({ where: { id } });
  const imageUrl = await resolveImage(formData);
  await db.menuItem.update({ where: { id }, data: { ...data, imageUrl } });
  await cleanupImage(previous.imageUrl, imageUrl);
  updateTag(MENU_TAG);
}

export async function deleteItem(formData: FormData) {
  await requireAdmin();
  const item = await db.menuItem.delete({ where: { id: readInt(formData, "id") } });
  await deleteImage(item.imageUrl);
  updateTag(MENU_TAG);
}

// --- Yorumlar ---

function readReview(formData: FormData) {
  const rating = readInt(formData, "rating");
  if (rating < 1 || rating > 5) throw new Error("Puan 1 ile 5 arasında olmalı.");
  return {
    author: readRequired(formData, "author"),
    text: readRequired(formData, "text"),
    rating,
  };
}

export async function createReview(formData: FormData) {
  await requireAdmin();
  const last = await db.review.findFirst({ orderBy: { sortOrder: "desc" } });
  await db.review.create({
    data: { ...readReview(formData), sortOrder: (last?.sortOrder ?? -1) + 1 },
  });
  updateTag(REVIEWS_TAG);
}

export async function updateReview(formData: FormData) {
  await requireAdmin();
  await db.review.update({
    where: { id: readInt(formData, "id") },
    data: {
      ...readReview(formData),
      sortOrder: readInt(formData, "sortOrder"),
      isVisible: formData.get("isVisible") === "on",
    },
  });
  updateTag(REVIEWS_TAG);
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  await db.review.delete({ where: { id: readInt(formData, "id") } });
  updateTag(REVIEWS_TAG);
}

// --- Galeri ---

export async function createGalleryImage(formData: FormData) {
  await requireAdmin();
  const imageUrl = await resolveImage(formData);
  if (!imageUrl) throw new Error("Fotoğraf seçilmedi.");
  const last = await db.galleryImage.findFirst({ orderBy: { sortOrder: "desc" } });
  await db.galleryImage.create({
    data: {
      imageUrl,
      caption: readText(formData, "caption") || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  updateTag(GALLERY_TAG);
}

export async function updateGalleryImage(formData: FormData) {
  await requireAdmin();
  const id = readInt(formData, "id");
  const previous = await db.galleryImage.findUniqueOrThrow({ where: { id } });
  // Galeride fotoğrafsız kayıt olmaz: kaldırıldıysa eskisi kalır
  const imageUrl = (await resolveImage(formData)) ?? previous.imageUrl;
  await db.galleryImage.update({
    where: { id },
    data: {
      imageUrl,
      caption: readText(formData, "caption") || null,
      sortOrder: readInt(formData, "sortOrder"),
    },
  });
  await cleanupImage(previous.imageUrl, imageUrl);
  updateTag(GALLERY_TAG);
}

export async function deleteGalleryImage(formData: FormData) {
  await requireAdmin();
  const image = await db.galleryImage.delete({ where: { id: readInt(formData, "id") } });
  await deleteImage(image.imageUrl);
  updateTag(GALLERY_TAG);
}
