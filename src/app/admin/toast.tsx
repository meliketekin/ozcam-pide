"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps } from "react";
import { ConfirmButton } from "@/components/confirm-button";

type Toast = { id: number; text: string; error?: boolean };
type Action = (formData: FormData) => Promise<void>;

const ToastContext = createContext<(text: string, error?: boolean) => void>(() => {});

/** Panelin altında kısa süre görünen "Kaydedildi" bildirimi. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((text: string, error?: boolean) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), text, error });
    timer.current = setTimeout(() => setToast(null), error ? 5000 : 2500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <p
            key={toast.id}
            role={toast.error ? "alert" : "status"}
            className={`flex items-center gap-2.5 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-2xl animate-[dialog-in_200ms_ease-out] ${
              toast.error ? "bg-brand" : "bg-ink"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d={toast.error ? "M12 8v5M12 16.5v.5M12 3l10 18H2z" : "M5 12.5l4.5 4.5L19 7"} />
            </svg>
            {toast.text}
          </p>
        )}
      </div>
    </ToastContext>
  );
}

/** Server action'ı çalıştırıp sonucu bildirim olarak gösterir. */
function useToastAction(action: Action, successMessage: string): Action {
  const show = useContext(ToastContext);
  return async (formData) => {
    try {
      await action(formData);
      show(successMessage);
    } catch (error) {
      console.error(error);
      // Yayında sunucu hata metnini göndermez; geliştirmede asıl mesajı göster
      const detail = process.env.NODE_ENV === "development" && error instanceof Error ? `: ${error.message}` : "";
      show(`Kaydedilemedi, tekrar deneyin${detail}`, true);
    }
  };
}

/** Gönderilince "Kaydedildi" bildirimi gösteren panel formu. */
export function AdminForm({
  action,
  successMessage = "Kaydedildi",
  ...props
}: Omit<ComponentProps<"form">, "action"> & { action: Action; successMessage?: string }) {
  return <form {...props} action={useToastAction(action, successMessage)} />;
}

/** Onay penceresinden sonra silip "Silindi" bildirimi gösteren buton. */
export function DeleteButton({
  formAction,
  ...props
}: Omit<ComponentProps<typeof ConfirmButton>, "formAction"> & { formAction: Action }) {
  return <ConfirmButton {...props} formAction={useToastAction(formAction, "Silindi")} />;
}
