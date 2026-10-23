"use client";

import Image from "next/image";
import { isUnoptimized } from "@/lib/image-url";
import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/photo";

type GalleryImage = { id: number; imageUrl: string; caption: string | null };

const arrowButton =
  "absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand";

/** Fotoğraf ızgarası; tıklanan fotoğraf tam ekran açılır, ok tuşlarıyla gezilir. */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : images[index];

  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length));

  useEffect(() => {
    if (index === null) return;
    dialogRef.current?.showModal();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // step yalnızca setIndex kullanır, her render'da yeniden bağlamaya gerek yok
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <>
      {/* Dikey (3:4) kareler — afiş tarzı fotoğrafların yazıları kırpılmaz */}
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {images.map((image, i) => (
          <li
            key={image.id}
            className="reveal stagger aspect-[3/4]"
            style={{ "--i": i % 3 } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              // Masaüstünde orta sütun farklı hızda kayar
              className={`group relative size-full overflow-hidden bg-cream ${i % 3 === 1 ? "lg-parallax" : ""}`}
              aria-label={image.caption ? `Büyüt: ${image.caption}` : "Fotoğrafı büyüt"}
            >
              <Photo
                src={image.imageUrl}
                alt={image.caption ?? ""}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25" />
              {image.caption && (
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-left text-sm text-white transition-transform duration-500 group-hover:translate-y-0">
                  {image.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        // Fotoğrafın dışına tıklayınca kapansın
        onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
        className="m-0 size-full max-h-none max-w-none bg-ink-deep/95 p-0 text-white backdrop:bg-transparent open:animate-[dialog-in_200ms_ease-out]"
      >
        {current && (
          <div
            className="relative flex size-full flex-col items-center justify-center px-4 py-16 sm:px-20"
            onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
          >
            <figure className="relative h-full w-full">
              <Image
                src={current.imageUrl}
                alt={current.caption ?? ""}
                fill
                sizes="100vw"
                unoptimized={isUnoptimized(current.imageUrl)}
                className="object-contain"
              />
            </figure>
            <p className="mt-4 min-h-6 text-center text-sm text-sand">
              {current.caption}
              <span className="ml-3 text-stone">
                {index! + 1} / {images.length}
              </span>
            </p>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Kapat"
              className="absolute top-4 right-4 flex size-12 items-center justify-center text-3xl text-sand hover:text-white"
            >
              ×
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Önceki" className={`${arrowButton} left-4 hidden sm:flex`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Sonraki" className={`${arrowButton} right-4 hidden sm:flex`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Mobilde oklar altta */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 sm:hidden">
                  <button type="button" onClick={() => step(-1)} className="px-4 py-2 text-sm text-sand">
                    ← Önceki
                  </button>
                  <button type="button" onClick={() => step(1)} className="px-4 py-2 text-sm text-sand">
                    Sonraki →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
