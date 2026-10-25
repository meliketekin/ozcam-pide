/**
 * Fotoğrafı eklenmemiş ürünler için yer tutucu: bulunduğu kutuyu doldurur (kutu `relative` olmalı).
 * Şeftali zemin, sayfanın hem beyaz hem krem bölümlerinden ayrışır.
 */
export function NoImage({ label = false }: { label?: boolean }) {
  return (
    <span
      role="img"
      aria-label="Fotoğraf yok"
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-peach/60 text-brand/70"
    >
      {/* Servis kapağı (cloche) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={label ? "size-14" : "size-8"}
      >
        <path d="M3 18h18M4.5 18a7.5 7.5 0 0 1 15 0M12 10.5V9M10.5 9h3" />
      </svg>
      {label && <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Fotoğraf yok</span>}
    </span>
  );
}
