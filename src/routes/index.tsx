import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { MagneticButton } from "@/components/MagneticButton";
import { PokemonCard } from "@/components/PokemonCard";
import { TypeBadge } from "@/components/TypeBadge";
import { TiltCard } from "@/components/TiltCard";
import { fetchPokemon, FEATURED_IDS, TRENDING_IDS, TYPE_COLORS, type PokeType } from "@/lib/pokemon";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aether Dex — Premium Biological Archive" },
      { name: "description", content: "A cinematic Pokédex experience. Explore 1025+ specimens with luxury data visualization." },
      { property: "og:title", content: "Aether Dex — Premium Biological Archive" },
      { property: "og:description", content: "A cinematic Pokédex experience. Explore 1025+ specimens with luxury data visualization." },
    ],
  }),
  component: Index,
});

const TYPES: PokeType[] = ["fire","water","grass","electric","psychic","ghost","dragon","fairy","dark","steel","ice","fighting"];

function Index() {
  return (
    <div className="relative">
      <Hero />
      <Featured />
      <SearchBand />
      <Stats />
      <TypesShowcase />
      <Trending />
      <CTA />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative mx-auto flex min-h-[88vh] max-w-[1440px] flex-col items-center justify-center px-5 pt-16 text-center md:px-16">
      <motion.div style={{ y, opacity }} className="relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 label-caps text-foreground/70"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aether shadow-[0_0_10px_var(--aether)]" />
          Aether Link · v1.0 · Live
        </motion.div>

        <h1 className="mx-auto mt-8 max-w-[14ch] text-[clamp(2.6rem,8vw,6.5rem)] font-extrabold leading-[1] tracking-[-0.03em]">
          {"The encyclopedia of\u00A0".split(" ").map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mr-3 inline-block"
            >
              {w}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block bg-gradient-to-br from-aether via-secondary to-ember bg-clip-text text-transparent"
          >
            living things.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
        >
          A cinematic, real-time biological archive. Cross-reference 1025+ specimens, evolutions and elemental affinities — rendered in liquid glass.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/browse">
            <MagneticButton>
              Enter Archive
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </MagneticButton>
          </Link>
          <Link to="/compare">
            <MagneticButton variant="ghost">Open Compare</MagneticButton>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 label-caps text-foreground/40">
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block h-6 w-px bg-white/30"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Featured() {
  const { data } = useQuery({
    queryKey: ["featured"],
    queryFn: () => Promise.all(FEATURED_IDS.slice(0, 3).map((id) => fetchPokemon(id))),
    staleTime: Infinity,
  });

  return (
    <section className="relative mx-auto max-w-[1440px] px-5 py-32 md:px-16">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="label-caps text-aether">Featured Specimens</div>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight">
              Hand-picked from the<br />neural archive.
            </h2>
          </div>
          <Link to="/browse" className="hidden items-center gap-2 label-caps text-foreground/60 transition hover:text-aether md:inline-flex">
            View All Data
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {(data ?? Array.from({ length: 3 })).map((p, i) =>
          p ? <PokemonCard key={p.id} p={p} index={i} /> : <SkeletonCard key={i} />,
        )}
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-strong h-[420px] animate-pulse rounded-[24px]" />
  );
}

function SearchBand() {
  return (
    <section className="relative mx-auto max-w-[1100px] px-5 md:px-16">
      <Reveal>
        <div className="glass-strong relative flex items-center gap-3 rounded-full p-2 pl-6">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground/60" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            placeholder="Search by name, type, or Pokédex number…"
            className="h-12 flex-1 bg-transparent text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
          />
          <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-foreground/60">⌘ K</kbd>
        </div>
      </Reveal>
    </section>
  );
}

function Stats() {
  const items = [
    { v: 1025, suf: "+", label: "Total Pokémon Discovered", color: "var(--aether)" },
    { v: 18, suf: "", label: "Elemental Types Archived", color: "var(--psychic)" },
    { v: 9, suf: "", label: "World Regions Mapped", color: "var(--ember)" },
  ];
  return (
    <section className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-16">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <TiltCard className="rounded-3xl" intensity={6}>
              <div className="glass-strong relative overflow-hidden rounded-3xl p-10">
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-30 blur-3xl" style={{ background: s.color }} />
                <div className="text-[clamp(3rem,7vw,5rem)] font-extrabold leading-none" style={{ color: s.color }}>
                  <Counter to={s.v} suffix={s.suf} />
                </div>
                <div className="mt-4 label-caps text-foreground/70">{s.label}</div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TypesShowcase() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-16">
      <Reveal>
        <div className="label-caps text-aether">Elemental Spectrum</div>
        <h2 className="mt-3 max-w-[20ch] text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight">
          Eighteen frequencies, one living grid.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap gap-3">
          {TYPES.map((t) => (
            <motion.div key={t} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
              <Link to="/types" className="block">
                <div className="glass rounded-2xl p-5 transition-colors duration-300 hover:bg-white/[0.06]" style={{ boxShadow: `0 14px 40px -28px ${TYPE_COLORS[t].glow}` }}>
                  <TypeBadge type={t} />
                  <div className="mt-3 text-2xl font-extrabold capitalize" style={{ color: TYPE_COLORS[t].fg }}>{t}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Trending() {
  const { data } = useQuery({
    queryKey: ["trending"],
    queryFn: () => Promise.all(TRENDING_IDS.slice(0, 6).map((id) => fetchPokemon(id))),
    staleTime: Infinity,
  });

  return (
    <section className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-16">
      <Reveal>
        <div className="flex items-end justify-between">
          <div>
            <div className="label-caps text-aether">Trending Near You</div>
            <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-extrabold tracking-tight">Recently scanned specimens</h2>
          </div>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {(data ?? Array.from({ length: 6 })).map((p, i) =>
          p ? <PokemonCard key={p.id} p={p} index={i} /> : <SkeletonCard key={i} />,
        )}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-5 pt-12 md:px-16">
      <Reveal>
        <div className="glass-strong relative overflow-hidden rounded-[32px] p-12 text-center md:p-20">
          <div className="pointer-events-none absolute inset-0 aether-gradient opacity-20" />
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-aether blur-3xl opacity-30" />
          <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-psychic blur-3xl opacity-30" />
          <div className="relative">
            <div className="label-caps text-foreground/80">Begin Transmission</div>
            <h3 className="mx-auto mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight">
              Step inside the archive.
            </h3>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">Cross-reference any of 1025+ specimens, their evolutions, stats, abilities and elemental affinities.</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/browse"><MagneticButton>Enter Archive</MagneticButton></Link>
              <Link to="/compare"><MagneticButton variant="ghost">Compare Specimens</MagneticButton></Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
