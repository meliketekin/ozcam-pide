/** Yapılandırılmış veriyi sayfaya gömer; `<` kaçırılır ki veri içinden script kapatılamasın. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
