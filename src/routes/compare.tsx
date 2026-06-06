import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { TypeBadge } from "@/components/TypeBadge";
import { MagneticButton } from "@/components/MagneticButton";
import { fetchPokemon, TYPE_COLORS } from "@/lib/pokemon";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare â€” Lumina Suite" },
      { name: "description", content: "Side-by-side biological comparison of any two specimens." },
    ],
  }),
  component: Compare,
});

function Compare() {
  const [a, setA] = useState("charizard");
  const [b, setB] = useState("blastoise");

  const { data: pa } = useQuery({ queryKey: ["pokemon", a], queryFn: () => fetchPokemon(a), staleTime: Infinity });
  const { data: pb } = useQuery({ queryKey: ["pokemon", b], queryFn: () => fetchPokemon(b), staleTime: Infinity });

  return (
    <div className="relative mx-auto max-w-[1440px] px-5 py-12 md:px-16">
      <Reveal>
        <div className="label-caps text-lumina">Power Comparator</div>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,5rem)] font-extrabold tracking-[-0.02em]">Run a head-to-head scan.</h1>
      </Reveal>

      <div className="mt-12 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <Slot value={a} onChange={setA} side="left" />
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="glass-strong grid h-16 w-16 place-items-center rounded-full text-lg font-extrabold tracking-widest text-lumina mx-auto"
        >
          VS
        </motion.div>
        <Slot value={b} onChange={setB} side="right" />
      </div>

      {pa && pb && (
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <SpecCard p={pa} accent="var(--ember)" />
          <SpecCard p={pb} accent="var(--lumina)" />
        </div>
      )}
    </div>
  );
}

function Slot({ value, onChange, side }: { value: string; onChange: (v: string) => void; side: "left" | "right" }) {
  const [draft, setDraft] = useState(value);
  return (
    <div className={`glass-strong rounded-3xl p-6 ${side === "left" ? "md:text-right" : "md:text-left"}`}>
      <div className="label-caps text-foreground/60">{side === "left" ? "Specimen A" : "Specimen B"}</div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.toLowerCase())}
          placeholder="Enter name or ID"
          className="glass h-12 w-full rounded-full px-5 text-base focus:outline-none"
        />
        <MagneticButton onClick={() => onChange(draft)} variant="ghost">Scan</MagneticButton>
      </div>
    </div>
  );
}

import type { PokemonDetail } from "@/lib/pokemon";
function SpecCard({ p, accent }: { p: PokemonDetail; accent: string }) {
  const tcol = TYPE_COLORS[p.types[0]];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-strong overflow-hidden rounded-3xl p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="label-caps text-foreground/50">#{String(p.id).padStart(4, "0")}</div>
          <h2 className="mt-2 text-4xl font-extrabold capitalize tracking-tight">{p.name}</h2>
          <div className="mt-2 flex gap-2">{p.types.map((t) => <TypeBadge key={t} type={t} />)}</div>
        </div>
        <div className="relative h-32 w-32 shrink-0">
          <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: tcol.glow, opacity: 0.6 }} />
          <img src={p.artwork} alt={p.name} className="relative h-full w-full object-contain" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {(["hp","attack","defense","spAtk","spDef","speed"] as const).map((k, i) => (
          <div key={k}>
            <div className="flex justify-between text-xs label-caps text-foreground/60">
              <span>{k}</span><span className="font-mono text-foreground">{p.stats[k]}</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (p.stats[k]/180)*100)}%` }} transition={{ duration: 1, delay: 0.05 * i, ease: [0.22,1,0.36,1] }} className="h-full rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
            </div>
          </div>
        ))}
        <div className="mt-4 flex items-baseline justify-between">
          <span className="label-caps text-foreground/50">Quotient</span>
          <span className="text-3xl font-extrabold" style={{ color: accent }}>{(p.total / 8).toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
}