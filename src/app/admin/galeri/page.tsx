import type { Metadata } from "next";
import { Suspense } from "react";
import { ImageField } from "@/components/image-field";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { createGalleryImage, deleteGalleryImage, updateGalleryImage } from "../actions";
import { AdminShell } from "../admin-shell";
import { dangerButton, input, label, primaryButton } from "../styles";
import { AdminForm, DeleteButton } from "../toast";

export const metadata: Metadata = {
  title: "Galeri | Yönetim Paneli",
  robots: { index: false },
};

export default function GalleryAdminPage() {
  return (
    <AdminShell>
      <Suspense fallback={<p className="text-muted">Yükleniyor…</p>}>
        <GalleryPanel />
      </Suspense>
    </AdminShell>
  );
}

async function GalleryPanel() {
  await requireAdmin();
  const images = await db.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });

  return (
    <>
      <p className="eyebrow text-muted">Anasayfa</p>
      <h1 className="heading mt-3 text-5xl font-semibold">Galeri</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Fotoğraflar anasayfada dikey (3:4) karelerde gösterilir; en iyi sonuç için dikey fotoğraf yükleyin. Galeri boşsa bölüm sitede görünmez.
      </p>

      <AdminForm
        action={createGalleryImage}
        successMessage="Eklendi"
        className="mt-10 flex flex-wrap items-end gap-5 bg-white p-5 shadow-sm"
      >
        <ImageField size="lg" />
        <div className="min-w-48 flex-1">
          <label className={label} htmlFor="new-caption">
            Açıklama
          </label>
          <input id="new-caption" name="caption" placeholder="İsteğe bağlı, ör. Taş fırınımız" className={input} />
        </div>
        <button type="submit" className={primaryButton}>
          Fotoğraf Ekle
        </button>
      </AdminForm>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <li key={image.id} className="bg-white shadow-sm">
            <AdminForm action={updateGalleryImage} className="flex gap-4 p-4">
              <input type="hidden" name="id" value={image.id} />
              <ImageField key={image.imageUrl} defaultUrl={image.imageUrl} removable={false} />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div>
                  <label className={label}>Açıklama</label>
                  <input name="caption" defaultValue={image.caption ?? ""} className={input} />
                </div>
                <div className="w-20">
                  <label className={label}>Sıra</label>
                  <input name="sortOrder" type="number" defaultValue={image.sortOrder} className={input} />
                </div>
                <div className="flex gap-1">
                  <button type="submit" className={primaryButton}>
                    Kaydet
                  </button>
                  <DeleteButton
                    formAction={deleteGalleryImage}
                    formNoValidate
                    title="Fotoğraf silinsin mi?"
                    message="Bu fotoğraf galeriden kalıcı olarak silinecek."
                    className={dangerButton}
                  >
                    Sil
                  </DeleteButton>
                </div>
              </div>
            </AdminForm>
          </li>
        ))}
      </ul>

      {images.length === 0 && <p className="mt-10 text-center text-muted">Galeride henüz fotoğraf yok.</p>}
    </>
  );
}
