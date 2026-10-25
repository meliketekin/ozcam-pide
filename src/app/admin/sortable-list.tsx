"use client";

import { createContext, useContext, useId, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { errorText, useToast } from "./toast";

type Row = { id: number; content: React.ReactNode };

type RowContext = {
  index: number;
  count: number;
  move: (from: number, to: number) => void;
  /** Sürükleme tutamağı: useSortable'ın bağlandığı satırda oluşturulur */
  handle: React.ReactNode;
};

const RowContext = createContext<RowContext | null>(null);

/**
 * Sürükle-bırak ya da yukarı/aşağı oklarla sıralanan liste. Sıra değişince `onReorder` yeni id
 * dizisiyle çağrılır (sunucu sıra numaralarını 0, 1, 2… diye baştan yazar, tekrar olmaz).
 * Satırların içinde <SortControls /> tutamak ve okları gösterir.
 */
export function SortableList({
  rows,
  onReorder,
  className,
  itemClassName,
}: {
  rows: Row[];
  onReorder: (ids: number[]) => Promise<void>;
  className?: string;
  itemClassName?: string;
}) {
  const ids = rows.map((row) => row.id);
  const [order, setOrder] = useState(ids);
  // Sunucudan yeni liste gelirse (ekleme, silme, kaydedilen sıra) yerel sırayı ona eşitle
  const [synced, setSynced] = useState(ids.join());
  if (ids.join() !== synced) {
    setSynced(ids.join());
    setOrder(ids);
  }

  const [, startTransition] = useTransition();
  const show = useToast();
  const contents = new Map(rows.map((row) => [row.id, row.content]));
  const visible = order.filter((id) => contents.has(id));

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= visible.length) return;
    const previous = visible;
    const next = arrayMove(visible, from, to);
    setOrder(next);
    startTransition(async () => {
      try {
        await onReorder(next);
        show("Sıralama kaydedildi");
      } catch (error) {
        setOrder(previous);
        show(errorText(error), { error: true });
      }
    });
  }

  const sensors = useSensors(
    // 5px kıpırdamadan sürükleme başlamasın: tutamağa tıklamak yanlışlıkla sürüklemesin
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (over) move(visible.indexOf(Number(active.id)), visible.indexOf(Number(over.id)));
  }

  return (
    <DndContext
      // Sabit id: sunucu ve tarayıcıdaki erişilebilirlik id'leri aynı olsun (hydration uyarısı çıkmasın)
      id={useId()}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Taşımak için boşluk tuşuna basın, yukarı/aşağı oklarla yerini seçin, bırakmak için tekrar boşluk tuşuna basın.",
        },
        announcements: {
          onDragStart: () => "Taşınıyor.",
          onDragOver: ({ over }) => (over ? `${visible.indexOf(Number(over.id)) + 1}. sıraya gelecek.` : ""),
          onDragEnd: ({ over }) =>
            over ? `${visible.indexOf(Number(over.id)) + 1}. sıraya taşındı.` : "Taşıma iptal edildi.",
          onDragCancel: () => "Taşıma iptal edildi.",
        },
      }}
    >
      <SortableContext items={visible} strategy={verticalListSortingStrategy}>
        <ul className={className}>
          {visible.map((id, index) => (
            <SortableRow
              key={id}
              id={id}
              index={index}
              count={visible.length}
              move={move}
              className={itemClassName}
            >
              {contents.get(id)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  index,
  count,
  move,
  className,
  children,
}: {
  id: number;
  index: number;
  count: number;
  move: RowContext["move"];
  className?: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({
      id,
      // Oklarla taşırken de satırlar kayarak yer değiştirsin (varsayılan yalnızca sürüklerken)
      animateLayoutChanges: () => true,
      transition: { duration: 350, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`relative ${isDragging ? "z-20 shadow-2xl ring-2 ring-brand/40" : ""} ${className ?? ""}`}
    >
      <RowContext
        value={{
          index,
          count,
          move,
          handle: (
            <button
              type="button"
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              aria-label="Sürükleyerek sırala"
              // touch-none: dokunmatikte tutamaktan sürüklerken sayfa kaymasın
              className={`${controlButton} cursor-grab touch-none active:cursor-grabbing`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
                {[6, 12, 18].flatMap((y) =>
                  [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />),
                )}
              </svg>
            </button>
          ),
        }}
      >
        {children}
      </RowContext>
    </li>
  );
}

/** Satırın sıralama kontrolleri: yukarı ok, sürükleme tutamağı, aşağı ok. */
export function SortControls({ dark = false }: { dark?: boolean }) {
  const row = useContext(RowContext);
  if (!row) return null;
  const { index, count, move, handle } = row;

  return (
    // Renkler kapsayıcıdan: koyu başlıkta açık, beyaz satırda koyu
    <div
      className={`flex shrink-0 flex-col items-center gap-0.5 self-center ${
        dark
          ? "text-sand [&_button:hover]:bg-white/10 [&_button:hover]:text-white"
          : "text-stone [&_button:hover]:bg-ink/5 [&_button:hover]:text-ink"
      }`}
    >
      <button
        type="button"
        onClick={() => move(index, index - 1)}
        disabled={index === 0}
        aria-label="Yukarı taşı"
        className={controlButton}
      >
        <Chevron path="M6 15l6-6 6 6" />
      </button>
      {handle}
      <button
        type="button"
        onClick={() => move(index, index + 1)}
        disabled={index === count - 1}
        aria-label="Aşağı taşı"
        className={controlButton}
      >
        <Chevron path="M6 9l6 6 6-6" />
      </button>
    </div>
  );
}

const controlButton =
  "flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-25";

function Chevron({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-4"
    >
      <path d={path} />
    </svg>
  );
}
