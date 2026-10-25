import { site } from "@/lib/site";

/** Telefon ikonu + numara; tıklayınca arar. Görünüm (flex / inline-flex, renk) className'den gelir. */
export function PhoneLink({ className }: { className?: string }) {
  return (
    <a href={`tel:${site.phone.replace(/\D/g, "")}`} className={`items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-4 shrink-0"
      >
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
      </svg>
      {site.phone}
    </a>
  );
}
