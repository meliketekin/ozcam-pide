import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { createReview, deleteReview, updateReview } from "../actions";
import { AdminShell } from "../admin-shell";
import { dangerButton, input, label, primaryButton } from "../styles";
import { AdminForm, DeleteButton } from "../toast";

export const metadata: Metadata = {
  title: "Yorumlar | Yönetim Paneli",
  robots: { index: false },
};

export default function ReviewsAdminPage() {
  return (
    <AdminShell>
      <Suspense fallback={<p className="text-muted">Yükleniyor…</p>}>
        <ReviewsPanel />
      </Suspense>
    </AdminShell>
  );
}

function RatingSelect({ defaultValue = 5 }: { defaultValue?: number }) {
  return (
    <select name="rating" defaultValue={defaultValue} className={input}>
      {[5, 4, 3, 2, 1].map((n) => (
        <option key={n} value={n}>
          {"★".repeat(n)}
        </option>
      ))}
    </select>
  );
}

async function ReviewsPanel() {
  await requireAdmin();
  const reviews = await db.review.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });

  return (
    <>
      <p className="eyebrow text-muted">Anasayfa</p>
      <h1 className="heading mt-3 text-5xl font-semibold">Müşteri Yorumları</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Google&apos;daki gerçek yorumlardan beğendiklerinizi buraya ekleyin. Hiç görünür yorum
        yoksa anasayfada yerine ustanın sözü gösterilir.
      </p>

      <AdminForm action={createReview} successMessage="Eklendi" className="mt-10 grid gap-4 bg-white p-5 shadow-sm md:grid-cols-[1fr_140px]">
        <div>
          <label className={label} htmlFor="new-author">
            Yorum sahibi
          </label>
          <input id="new-author" name="author" placeholder="Örn. Ayşe K." required className={input} />
        </div>
        <div>
          <label className={label}>Puan</label>
          <RatingSelect />
        </div>
        <div className="md:col-span-2">
          <label className={label} htmlFor="new-text">
            Yorum
          </label>
          <textarea id="new-text" name="text" rows={3} required className={input} />
        </div>
        <div>
          <button type="submit" className={primaryButton}>
            Yorum Ekle
          </button>
        </div>
      </AdminForm>

      <ul className="mt-10 space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className={`bg-white shadow-sm ${review.isVisible ? "" : "opacity-60"}`}>
            <AdminForm action={updateReview} className="grid gap-4 p-5 md:grid-cols-[1fr_140px_70px_auto] md:items-end">
              <input type="hidden" name="id" value={review.id} />
              <div>
                <label className={label}>Yorum sahibi</label>
                <input name="author" defaultValue={review.author} required className={input} />
              </div>
              <div>
                <label className={label}>Puan</label>
                <RatingSelect defaultValue={review.rating} />
              </div>
              <div>
                <label className={label}>Sıra</label>
                <input name="sortOrder" type="number" defaultValue={review.sortOrder} className={input} />
              </div>
              <label className="flex items-center gap-1.5 text-sm md:pb-2">
                <input
                  name="isVisible"
                  type="checkbox"
                  defaultChecked={review.isVisible}
                  className="size-4 accent-brand"
                />
                Sitede göster
              </label>
              <div className="md:col-span-3">
                <label className={label}>Yorum</label>
                <textarea name="text" defaultValue={review.text} rows={2} required className={input} />
              </div>
              <div className="flex gap-1">
                <button type="submit" className={primaryButton}>
                  Kaydet
                </button>
                <DeleteButton
                  formAction={deleteReview}
                  formNoValidate
                  title="Yorum silinsin mi?"
                  message={`${review.author} adlı kişinin yorumu kalıcı olarak silinecek.`}
                  className={dangerButton}
                >
                  Sil
                </DeleteButton>
              </div>
            </AdminForm>
          </li>
        ))}
      </ul>

      {reviews.length === 0 && <p className="mt-10 text-center text-muted">Henüz yorum yok.</p>}
    </>
  );
}
