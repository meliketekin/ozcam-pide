import type { Metadata } from "next";
import { Suspense } from "react";
import { ImageField } from "@/components/image-field";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  updateCategory,
  updateItem,
} from "./actions";
import { AdminShell } from "./admin-shell";
import { dangerButton, input, label, labelOnDark, primaryButton } from "./styles";
import { AdminForm, DeleteButton } from "./toast";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <AdminShell>
      <Suspense fallback={<p className="text-muted">Yükleniyor…</p>}>
        <AdminPanel />
      </Suspense>
    </AdminShell>
  );
}

async function AdminPanel() {
  await requireAdmin();

  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { items: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
  });

  return (
    <>
      <p className="eyebrow text-muted">Menü yönetimi</p>
      <h1 className="heading mt-3 text-5xl font-semibold">Kategoriler ve Ürünler</h1>

      <AdminForm
        action={createCategory}
        successMessage="Eklendi"
        className="mt-10 flex flex-wrap items-end gap-5 bg-white p-5 shadow-sm"
      >
        <ImageField />
        <div className="min-w-48 flex-1">
          <label className={label} htmlFor="new-category">
            Yeni kategori
          </label>
          <input
            id="new-category"
            name="name"
            placeholder="Örn. Çorbalar"
            required
            className={input}
          />
        </div>
        <button type="submit" className={primaryButton}>
          Kategori Ekle
        </button>
      </AdminForm>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <section key={category.id} className="bg-white shadow-sm">
            <AdminForm
              action={updateCategory}
              className="flex flex-wrap items-end gap-5 border-b border-border bg-ink p-5 text-white"
            >
              <input type="hidden" name="id" value={category.id} />
              <ImageField key={category.imageUrl ?? ""} defaultUrl={category.imageUrl} size="lg" />
              <div className="min-w-48 flex-1">
                <label className={labelOnDark}>Kategori adı</label>
                <input
                  name="name"
                  defaultValue={category.name}
                  required
                  className={`${input} font-display text-xl font-bold text-ink`}
                />
              </div>
              <div className="w-20">
                <label className={labelOnDark}>Sıra</label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={category.sortOrder}
                  className={`${input} text-ink`}
                />
              </div>
              <div className="flex gap-1">
                <button type="submit" className={primaryButton}>
                  Kaydet
                </button>
                <DeleteButton
                  formAction={deleteCategory}
                  formNoValidate
                  title="Kategori silinsin mi?"
                  message={`"${category.name}" kategorisi ve içindeki ${category.items.length} ürün kalıcı olarak silinecek.`}
                  className={`${dangerButton} text-peach hover:bg-white/10`}
                >
                  Sil
                </DeleteButton>
              </div>
            </AdminForm>

            <ul className="divide-y divide-border">
              {category.items.map((item) => (
                <li key={item.id}>
                  <AdminForm action={updateItem} className="flex flex-col gap-5 p-5 sm:flex-row">
                    <input type="hidden" name="id" value={item.id} />
                    <ImageField key={item.imageUrl ?? ""} defaultUrl={item.imageUrl} />
                    <div className="grid flex-1 gap-3 md:grid-cols-[2fr_110px_70px_1fr] md:items-end">
                      <div>
                        <label className={label}>Ürün</label>
                        <input name="name" defaultValue={item.name} required className={input} />
                      </div>
                      <div>
                        <label className={label}>Fiyat (₺)</label>
                        <input
                          name="price"
                          inputMode="decimal"
                          defaultValue={item.price}
                          required
                          className={input}
                        />
                      </div>
                      <div>
                        <label className={label}>Sıra</label>
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={item.sortOrder}
                          className={input}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-sm md:pb-2">
                        <label className="flex items-center gap-1.5">
                          <input
                            name="isAvailable"
                            type="checkbox"
                            defaultChecked={item.isAvailable}
                            className="size-4 accent-brand"
                          />
                          Satışta
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            name="isFeatured"
                            type="checkbox"
                            defaultChecked={item.isFeatured}
                            className="size-4 accent-brand"
                          />
                          Öne çıkan
                        </label>
                      </div>

                      <div className="md:col-span-3">
                        <label className={label}>Açıklama</label>
                        <input
                          name="description"
                          defaultValue={item.description ?? ""}
                          className={input}
                        />
                      </div>
                      <div className="flex gap-1">
                        <button type="submit" className={primaryButton}>
                          Kaydet
                        </button>
                        <DeleteButton
                          formAction={deleteItem}
                          formNoValidate
                          title="Ürün silinsin mi?"
                          message={`"${item.name}" menüden kalıcı olarak silinecek.`}
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

            <AdminForm
              action={createItem}
              successMessage="Eklendi"
              className="flex flex-col gap-5 border-t border-dashed border-sand bg-cream/50 p-5 sm:flex-row sm:items-end"
            >
              <input type="hidden" name="categoryId" value={category.id} />
              <ImageField />
              <div className="grid flex-1 gap-3 md:grid-cols-[2fr_3fr_110px_auto] md:items-end">
                <div>
                  <label className={label}>Yeni ürün</label>
                  <input name="name" placeholder="Ürün adı" required className={input} />
                </div>
                <div>
                  <label className={label}>Açıklama</label>
                  <input name="description" placeholder="İsteğe bağlı" className={input} />
                </div>
                <div>
                  <label className={label}>Fiyat (₺)</label>
                  <input
                    name="price"
                    placeholder="0"
                    inputMode="decimal"
                    required
                    className={input}
                  />
                </div>
                <button type="submit" className={primaryButton}>
                  Ürün Ekle
                </button>
              </div>
            </AdminForm>
          </section>
        ))}

        {categories.length === 0 && (
          <p className="text-center text-muted">Henüz kategori yok. Yukarıdan ekleyebilirsin.</p>
        )}
      </div>
    </>
  );
}
