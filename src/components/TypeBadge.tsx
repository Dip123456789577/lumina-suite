import { TYPE_COLORS, type PokeType } from "@/lib/pokemon";

export function TypeBadge({ type, size = "md" }: { type: PokeType; size?: "sm" | "md" }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.16em] ${
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]"
      }`}
      style={{
        backgroundColor: c.bg,
        borderColor: `color-mix(in oklab, ${c.fg} 45%, transparent)`,
        color: c.fg,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${c.fg} 12%, transparent), 0 0 18px -6px ${c.glow}`,
      }}
    >
      {type}
    </span>
  );
}