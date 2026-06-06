import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { TypeBadge } from "@/components/TypeBadge";
import { TYPE_COLORS, type PokeType } from "@/lib/pokemon";

export const Route = createFileRoute("/types")({
  head: () => ({
    meta: [
      { title: "Elemental Types â€” Lumina Suite" },
      { name: "description", content: "Eighteen elemental affinities of the living archive." },
    ],
  }),
  component: Types,
});

const TYPES = Object.keys(TYPE_COLORS) as PokeType[];

function Types() {
  return (
    <div className="relative mx-auto max-w-[1440px] px-5 py-12 md:px-16">
      <Reveal>
        <div className="label-caps text-lumina">Elemental Spectrum</div>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,5rem)] font-extrabold tracking-[-0.02em]">Eighteen frequencies.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Every specimen is bound to one or two elemental affinities â€” a living grid of advantages and vulnerabilities.</p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {TYPES.map((t, i) => {
          const c = TYPE_COLORS[t];
          return (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/browse" className="block">
                <div className="glass-strong group relative overflow-hidden rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-80" style={{ background: c.glow }} />
                  <TypeBadge type={t} />
                  <div className="mt-4 text-4xl font-extrabold capitalize" style={{ color: c.fg }}>{t}</div>
                  <div className="mt-2 font-mono text-xs text-foreground/50">{Math.round(Math.random() * 80) + 20} specimens</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}