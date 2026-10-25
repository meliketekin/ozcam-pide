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
  reorderCategories,
  reorderItems,
  updateCategory,
  updateItem,
} from "./actions";
import { AdminShell } from "./admin-shell";
import { CategoryCollapse, CollapseBody, CollapseToggle } from "./category-collapse";
import { FlagSwitch } from "./flag-switch";
import { SortableList, SortControls } from "./sortable-list";
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
          <input id="new-category" name="name" placeholder="Örn. Çorbalar" required className={input} />
        </div>
        <button type="submit" className={primaryButton}>
          Kategori Ekle
        </button>
      </AdminForm>

      <SortableList
        onReorder={reorderCategories}
        className="mt-10 space-y-10"
        rows={categories.map((category) => ({
          id: category.id,
          content: (
            <CategoryCollapse>
              <AdminForm
                action={updateCategory}
                className="relative flex flex-wrap items-end gap-5 border-b border-border bg-ink p-5 text-white"
              >
                <input type="hidden" name="id" value={category.id} />
                <SortControls dark />
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
                <CollapseToggle
                  count={category.items.length}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-sand hover:bg-white/10 hover:text-white"
                />
              </AdminForm>

              <CollapseBody>
                <SortableList
                  onReorder={reorderItems.bind(null, category.id)}
                  className="divide-y divide-border"
                  itemClassName="bg-white"
                  rows={category.items.map((item) => ({
                    id: item.id,
                    content: (
                      <div className="flex gap-3 py-5 pr-5 pl-2">
                        <SortControls />
                        <AdminForm action={updateItem} className="flex flex-1 flex-col gap-5 sm:flex-row">
                          <input type="hidden" name="id" value={item.id} />
                          <ImageField key={item.imageUrl ?? ""} defaultUrl={item.imageUrl} />
                          <div className="grid flex-1 gap-3 md:grid-cols-[2fr_110px_1fr] md:items-end">
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
                            <div className="flex items-center gap-4 text-sm md:pb-2">
                              <FlagSwitch
                                itemId={item.id}
                                itemName={item.name}
                                flag="isAvailable"
                                defaultChecked={item.isAvailable}
                              >
                                Satışta
                              </FlagSwitch>
                              <FlagSwitch
                                itemId={item.id}
                                itemName={item.name}
                                flag="isFeatured"
                                defaultChecked={item.isFeatured}
                              >
                                Öne çıkan
                              </FlagSwitch>
                            </div>

                            <div className="md:col-span-2">
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
                      </div>
                    ),
                  }))}
                />

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
                      <input name="price" placeholder="0" inputMode="decimal" required className={input} />
                    </div>
                    <button type="submit" className={primaryButton}>
                      Ürün Ekle
                    </button>
                  </div>
                </AdminForm>
              </CollapseBody>
            </CategoryCollapse>
          ),
        }))}
      />

      {categories.length === 0 && (
        <p className="mt-10 text-center text-muted">Henüz kategori yok. Yukarıdan ekleyebilirsin.</p>
      )}
    </>
  );
}
