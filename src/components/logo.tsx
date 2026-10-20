import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label="Özçam Pide anasayfa">
      <span className="font-display text-[28px] leading-none font-bold italic">Özçam</span>
      <span className="h-7 w-0.5 bg-brand" />
      <span className="text-[13px] font-bold uppercase tracking-[0.3em]">Pide</span>
    </Link>
  );
}
