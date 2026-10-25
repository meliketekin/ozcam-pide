"use client";

import { useEffect, useRef, useState } from "react";
import { isVideo } from "@/lib/image-url";

const MAX_SIDE = 1600;
const MAX_BYTES = 4 * 1024 * 1024;

/** Fotoğrafı tarayıcıda küçültür; telefon fotoğrafları birkaç yüz KB'a iner. */
async function compress(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const toBlob = (type: string) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
    // WebP desteklemeyen tarayıcılarda JPEG'e düş
    let blob = await toBlob("image/webp");
    if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg");
    if (!blob) return file;

    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `foto.${ext}`, { type: blob.type });
  } catch {
    // Tarayıcı çözemediyse (ör. bazı HEIC dosyaları) orijinali gönder, sunucu kontrol eder
    return file;
  }
}

export function ImageField({
  defaultUrl,
  size = "md",
  removable = true,
}: {
  defaultUrl?: string | null;
  size?: "md" | "lg";
  /** false: kayıtlı fotoğraf kaldırılamaz, sadece değiştirilir (ör. galeri) */
  removable?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form gönderildikten sonra React formu sıfırlar; seçimi de temizle
  useEffect(() => {
    const form = fileRef.current?.form;
    if (!form) return;
    const onReset = () => {
      setPreview(null);
      setUrl(defaultUrl ?? "");
      setError(null);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultUrl]);

  // Önizleme adresini işi bitince serbest bırak
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const original = input.files?.[0];
    if (!original) return;

    setError(null);
    setBusy(true);
    const file = await compress(original);
    setBusy(false);

    if (file.size > MAX_BYTES) {
      input.value = "";
      setError("Fotoğraf çok büyük (en fazla 4 MB).");
      return;
    }

    // Küçültülmüş dosyayı forma koy
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    setPreview(URL.createObjectURL(file));
  }

  function clearSelection() {
    if (fileRef.current) fileRef.current.value = "";
    setPreview(null);
  }

  const shown = preview ?? url;
  const box = size === "lg" ? "size-28" : "size-24";
  const linkButton =
    "text-[10px] font-bold uppercase tracking-[0.1em] text-stone transition-colors hover:text-brand";

  return (
    <div className="flex flex-col items-start gap-2">
      <input type="hidden" name="imageUrl" value={url} />
      <input
        ref={fileRef}
        type="file"
        name="image"
        // HEIC listede yok: iPhone bu durumda fotoğrafı otomatik JPEG'e çevirir
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={onChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={`group relative ${box} overflow-hidden rounded-xl border border-dashed border-sand bg-cream text-muted transition-colors hover:border-ink ${
          shown ? "border-transparent" : ""
        }`}
        aria-label={shown ? "Fotoğrafı değiştir" : "Fotoğraf seç"}
      >
        {shown && isVideo(shown) ? (
          <video src={shown} muted playsInline preload="metadata" className="size-full object-cover" />
        ) : shown ? (
          // Önizleme blob: adresi olabilir, next/image ile gösterilemez
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="11" r="2" />
              <path d="m21 16-5-5-8 8" />
            </svg>
            Fotoğraf
          </span>
        )}
        {shown && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-[10px] font-bold uppercase tracking-[0.1em] text-white opacity-0 transition-opacity group-hover:opacity-100">
            Değiştir
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-[10px] font-bold uppercase">
            Hazırlanıyor…
          </span>
        )}
      </button>

      {/* Duruma göre tek işlem: yeni seçimi bırak, kayıtlıyı kaldır ya da kaldırmayı geri al */}
      {preview ? (
        <button type="button" onClick={clearSelection} className={linkButton}>
          Vazgeç
        </button>
      ) : url ? (
        removable && (
          <button type="button" onClick={() => setUrl("")} className={linkButton}>
            Kaldır
          </button>
        )
      ) : defaultUrl ? (
        <button type="button" onClick={() => setUrl(defaultUrl)} className={linkButton}>
          Geri al
        </button>
      ) : null}
      {error && <span className="max-w-28 text-xs text-brand">{error}</span>}
    </div>
  );
}
