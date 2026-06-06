import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

export function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  function move(e: PointerEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    variant === "primary"
      ? "bg-aether text-primary-foreground hover:shadow-[0_18px_50px_-10px_var(--aether)]"
      : "bg-white/[0.04] text-foreground border border-white/10 hover:border-aether/50 hover:text-aether";

  return (
    <motion.button
      onPointerMove={move}
      onPointerLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${base} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
    </motion.button>
  );
}