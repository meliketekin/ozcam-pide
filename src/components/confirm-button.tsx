"use client";

import { useRef, type ComponentProps } from "react";

/** Gönderimden önce sitenin tasarımında bir onay penceresi açan submit butonu. */
export function ConfirmButton({
  title,
  message,
  confirmLabel = "Evet, sil",
  ...props
}: ComponentProps<"button"> & { title: string; message: string; confirmLabel?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmed = useRef(false);

  function confirm() {
    confirmed.current = true;
    dialogRef.current?.close();
    // Formu bu butonla gönder ki butonun formAction'ı (ör. silme) çalışsın
    buttonRef.current?.form?.requestSubmit(buttonRef.current);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="submit"
        {...props}
        onClick={(event) => {
          if (confirmed.current) {
            confirmed.current = false;
            return;
          }
          event.preventDefault();
          dialogRef.current?.showModal();
        }}
      />

      <dialog
        ref={dialogRef}
        // Pencere dışına (arka plana) tıklayınca kapansın
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md bg-transparent p-0 backdrop:bg-ink-deep/70 backdrop:backdrop-blur-sm open:animate-[dialog-in_200ms_ease-out]"
      >
        <div className="rounded-2xl bg-white p-8 text-center text-ink shadow-2xl">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
            </svg>
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold">{title}</h2>
          <p className="mt-2 leading-relaxed text-muted">{message}</p>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="btn rounded-lg border border-border px-8 text-ink hover:border-ink"
            >
              Vazgeç
            </button>
            <button type="button" onClick={confirm} className="btn-primary rounded-lg px-8">
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
