"use client";

import { useState, useTransition } from "react";
import { setItemFlag } from "./actions";
import { errorText, useToast } from "./toast";

type Flag = "isAvailable" | "isFeatured";

// Bildirim metinleri: [açılınca, kapanınca]
const messages: Record<Flag, [string, string]> = {
  isFeatured: ["öne çıkarıldı", "öne çıkanlardan kaldırıldı"],
  isAvailable: ["satışa açıldı", "satıştan kaldırıldı"],
};

/**
 * Ürünün "Satışta" / "Öne çıkan" anahtarı. Tıklanınca Kaydet'i beklemeden anında kaydedilir,
 * bildirimdeki "Geri al" ile eski haline döner. Formun içinde kaldığı için Kaydet de aynı değeri gönderir.
 */
export function FlagSwitch({
  itemId,
  itemName,
  flag,
  defaultChecked,
  children,
}: {
  itemId: number;
  itemName: string;
  flag: Flag;
  defaultChecked: boolean;
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [pending, startTransition] = useTransition();
  const show = useToast();

  function save(value: boolean, undo: boolean) {
    setChecked(value);
    startTransition(async () => {
      try {
        await setItemFlag(itemId, flag, value);
        if (undo) {
          show("Geri alındı");
        } else {
          show(`${itemName} ${messages[flag][value ? 0 : 1]}`, {
            action: { label: "Geri al", onClick: () => save(!value, true) },
          });
        }
      } catch (error) {
        setChecked(!value);
        show(errorText(error), { error: true });
      }
    });
  }

  return (
    <label className={`flex cursor-pointer items-center gap-2 ${pending ? "opacity-60" : ""}`}>
      <input
        name={flag}
        type="checkbox"
        role="switch"
        checked={checked}
        // disabled değil: devre dışı kutu forma eklenmez, o an Kaydet'e basılırsa değer kapalı giderdi
        aria-disabled={pending}
        onChange={(event) => !pending && save(event.target.checked, false)}
        className="peer sr-only"
      />
      {/* Anahtar görünümü: tıklayınca anında kaydedildiği belli olsun */}
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 rounded-full bg-sand transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4"
      />
      {children}
    </label>
  );
}
