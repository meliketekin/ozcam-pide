import { Photo } from "@/components/photo";

export function Hero({
  image,
  eyebrow,
  title,
  children,
  bottom,
  size = "full",
}: {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Hero'nun alt kenarına sabitlenen içerik */
  bottom?: React.ReactNode;
  size?: "full" | "compact";
}) {
  return (
    <section
      className={`hero-scroll relative flex items-center justify-center overflow-hidden bg-ink-deep text-center text-white ${
        size === "full" ? "min-h-svh" : "min-h-[60svh] pt-20"
      }`}
    >
      <Photo src={image} alt="" sizes="100vw" priority className="hero-bg scale-105" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

      <div className="hero-fade relative z-10 mx-auto max-w-4xl px-6 py-32">
        <p className="intro eyebrow justify-center text-peach" style={{ "--d": "0.2s" } as React.CSSProperties}>
          {eyebrow}
        </p>
        {/* Başlık bir maskenin arkasından yükselir */}
        <h1 className="title-hero mt-6">
          <span className="intro-mask block">
            <span className="block" style={{ "--d": "0.35s" } as React.CSSProperties}>
              {title}
            </span>
          </span>
        </h1>
        {children && (
          <div className="intro" style={{ "--d": "0.8s" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>

      {bottom && (
        <div className="hero-fade absolute inset-x-0 bottom-8 z-10 px-6">
          <div className="intro" style={{ "--d": "1.1s" } as React.CSSProperties}>
            {bottom}
          </div>
        </div>
      )}

    </section>
  );
}
