"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isUnoptimized } from "@/lib/image-url";

/**
 * Yerel ve Blob görsellerini optimize eder; adminden girilen dış adresleri olduğu gibi gösterir.
 * Fotoğraf yüklenince bulanıktan nete yumuşakça belirir (globals.css: .photo).
 */
export function Photo({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  // Öncelikli (ilk ekrandaki) görsel JavaScript'i beklemeden belirmeye başlasın
  const [loaded, setLoaded] = useState(Boolean(priority));

  // Tarayıcı önbelleğinden gelen görsel, React bağlanmadan yüklenmiş olabilir
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    // Animasyon bu katmanda: görselin kendi animasyonlarıyla (zoom, hover) çakışmasın
    <span className="photo absolute inset-0" data-loaded={loaded || undefined}>
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isUnoptimized(src)}
        onLoad={() => setLoaded(true)}
        className={`object-cover ${className ?? ""}`}
      />
    </span>
  );
}
