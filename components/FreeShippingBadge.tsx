type FreeShippingBadgeProps = {
  compact?: boolean;
  dark?: boolean;
};

export default function FreeShippingBadge({ compact = false, dark = false }: FreeShippingBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 font-black shadow-sm ${
        dark
          ? "border-green-400/50 bg-green-500/15 text-green-300"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
      aria-label="Darmowa dostawa na terenie Polski"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${compact ? "h-6 w-6" : "h-8 w-8"} shrink-0 fill-none stroke-current`} strokeWidth="1.9">
        <path d="M3 6h11v10H3zM14 9h3.5L21 12.5V16h-7z" />
        <path d="M6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </svg>
      <span className={compact ? "text-xs leading-tight" : "text-sm leading-tight sm:text-base"}>
        Darmowa dostawa
        <span className="block font-semibold">na terenie Polski</span>
      </span>
    </div>
  );
}
