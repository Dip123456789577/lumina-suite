import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { TypeBadge } from "@/components/TypeBadge";
import { MagneticButton } from "@/components/MagneticButton";
import { fetchPokemon, TYPE_COLORS } from "@/lib/pokemon";

export const Route = createFileRoute("/pokemon/$name")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.name.toUpperCase()} — Aether Dex` },
      { name: "description", content: `Detailed biological scan, stats, evolutions and moves for ${params.name}.` },
    ],
  }),
  component: PokemonPage,
});

const STAT_KEYS = [
  ["hp", "HP"],
  ["attack", "Attack"],
  ["defense", "Defense"],
  ["spAtk", "Sp. Atk"],
  ["spDef", "Sp. Def"],
  ["speed", "Speed"],
] as const;

function PokemonPage() {
  const { name } = Route.useParams();
  const { data: p } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemon(name),
    staleTime: Infinity,
  });

  if (!p) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-[1440px] place-items-center px-5">
        <div className="glass-strong rounded-3xl p-10 text-center">
          <div className="label-caps text-aether">Scanning…</div>
          <div className="mt-3 text-xl font-semibold">Linking neural archive</div>
        </div>
      </div>
    );
  }

  const tcol = TYPE_COLORS[p.types[0]];
  return (
    <div className="relative mx-auto max-w-[1440px] px-5 py-12 md:px-16">
      <Reveal>
        <Link to="/browse" className="inline-flex items-center gap-2 label-caps text-foreground/60 hover:text-aether">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
          Back to Archive
        </Link>
      </Reveal>

      {/* HERO */}
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <Reveal>
          <div className="glass-strong relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 30%, ${tcol.bg}, transparent 60%)` }} />
            <div className="pointer-events-none absolute -bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-60" style={{ background: tcol.glow }} />
            <motion.img
              src={p.artwork}
              alt={p.name}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
            />
            <div className="absolute left-6 top-6 label-caps text-foreground/60">NO. {String(p.id).padStart(4, "0")}</div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              {p.types.map((t) => <TypeBadge key={t} type={t} />)}
              <span className="label-caps text-foreground/50">{p.genus}</span>
            </div>
            <h1 className="mt-6 text-[clamp(3rem,8vw,6rem)] font-extrabold capitalize leading-[1] tracking-[-0.03em]">
              {p.name}
            </h1>
            <p className="mt-6 max-w-prose text-base text-muted-foreground md:text-lg">{p.flavor}</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-5">
                <div className="label-caps text-foreground/60">Height</div>
                <div className="mt-2 font-mono text-2xl">{p.height.toFixed(1)} m</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="label-caps text-foreground/60">Weight</div>
                <div className="mt-2 font-mono text-2xl">{p.weight.toFixed(1)} kg</div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link to="/compare"><MagneticButton>Add to Comparator</MagneticButton></Link>
              <Link to="/browse"><MagneticButton variant="ghost">Continue Archive</MagneticButton></Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* STATS + ABILITIES */}
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <Reveal className="md:col-span-2">
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold tracking-tight">Base Stats</h3>
              <div className="label-caps text-foreground/50">Total · {p.total}</div>
            </div>
            <div className="mt-6 space-y-4">
              {STAT_KEYS.map(([k, label], i) => {
                const v = p.stats[k];
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="label-caps text-foreground/60">{label}</span>
                      <span className="font-mono text-foreground">{v}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (v / 180) * 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.05 * i }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${tcol.fg}, var(--aether))`, boxShadow: `0 0 10px ${tcol.glow}` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-strong h-full rounded-3xl p-8">
            <h3 className="text-2xl font-extrabold tracking-tight">Abilities</h3>
            <ul className="mt-6 space-y-4">
              {p.abilities.map((a) => (
                <li key={a.name} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold capitalize">{a.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Biological signature</div>
                  </div>
                  {a.hidden && (
                    <span className="rounded-full border border-aether/40 bg-aether/10 px-2 py-0.5 label-caps text-aether">hidden</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* MOVES */}
      <Reveal>
        <div className="mt-16">
          <h3 className="text-2xl font-extrabold tracking-tight">Neural Tech-Moves</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.moves.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="label-caps text-foreground/60">Move · {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-2 text-lg font-semibold capitalize">{m.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}