import { site } from "@/lib/site";

const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  ),
};

export function SocialIcons() {
  return (
    <ul className="flex justify-center gap-2">
      {(Object.keys(icons) as (keyof typeof icons)[]).map((name) => (
        <li key={name}>
          <a
            href={site.social[name]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="flex size-11 items-center justify-center rounded-full border border-white/15 text-cream transition-colors hover:border-brand hover:bg-brand"
          >
            {icons[name]}
          </a>
        </li>
      ))}
    </ul>
  );
}
