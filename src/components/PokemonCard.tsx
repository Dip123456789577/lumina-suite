import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { PokemonSummary } from "@/lib/pokemon";
import { TYPE_COLORS } from "@/lib/pokemon";
import { TypeBadge } from "./TypeBadge";
import { TiltCard } from "./TiltCard";

export function PokemonCard({ p, index = 0 }: { p: PokemonSummary; index?: number }) {
  const tcol = TYPE_COLORS[p.types[0]];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="[perspective:1200px]"
    >
      <TiltCard className="rounded-[24px]" intensity={10}>
        <Link
          to="/pokemon/$name"
          params={{ name: p.name }}
          className="glass-strong relative block overflow-hidden rounded-[24px] p-5 transition-shadow duration-500"
          style={{ boxShadow: `0 20px 60px -40px ${tcol.glow}` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 50% 0%, ${tcol.bg}, transparent 65%)` }}
          />
          <div className="relative flex items-center justify-between">
            <span className="label-caps text-foreground/50">#{String(p.id).padStart(4, "0")}</span>
            <span className="label-caps text-foreground/40">BST Â· {p.total}</span>
          </div>

          <div className="relative mt-2 grid h-44 place-items-center md:h-52" style={{ transform: "translateZ(40px)" }}>
            <div
              className="absolute inset-x-6 bottom-3 h-6 rounded-full blur-xl"
              style={{ background: tcol.glow, opacity: 0.55 }}
            />
            <motion.img
              src={p.artwork}
              alt={p.name}
              loading="lazy"
              className="relative h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]"
              whileHover={{ scale: 1.08, y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
            />
          </div>

          <div className="relative mt-2 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-2xl font-extrabold capitalize tracking-tight">{p.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, (p.total / 720) * 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${tcol.fg}, var(--lumina))`, boxShadow: `0 0 12px ${tcol.glow}` }}
            />
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}