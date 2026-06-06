import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { PokemonCard } from "@/components/PokemonCard";
import { TypeBadge } from "@/components/TypeBadge";
import { MagneticButton } from "@/components/MagneticButton";
import { fetchPokemonList, type PokeType } from "@/lib/pokemon";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Archive — Aether Dex" },
      { name: "description", content: "Browse 1025+ specimens with biological filters, elemental types and instant search." },
    ],
  }),
  component: Browse,
});

const ALL_TYPES: PokeType[] = ["fire","water","grass","electric","psychic","ghost","dragon","fairy","dark","steel","ice","fighting","flying","bug","rock","ground","poison","normal"];

function Browse() {
  const [limit, setLimit] = useState(24);
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<PokeType>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["list", limit],
    queryFn: () => fetchPokemonList(limit, 0),
    staleTime: 1000 * 60 * 5,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      const matchesQ = !query || p.name.includes(query.toLowerCase()) || String(p.id).includes(query);
      const matchesT = activeTypes.size === 0 || p.types.some((t) => activeTypes.has(t));
      return matchesQ && matchesT;
    });
  }, [data, query, activeTypes]);

  function toggleType(t: PokeType) {
    setActiveTypes((prev) => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });
  }

  return (
    <div className="relative mx-auto max-w-[1440px] px-5 py-16 md:px-16">
      <Reveal>
        <div className="label-caps text-aether">Biological Archive</div>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,5rem)] font-extrabold tracking-[-0.02em]">Explore every specimen.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Filter by elemental affinity, search by Pokédex number, and stream specimens on demand.</p>
      </Reveal>

      {/* search */}
      <Reveal delay={0.1}>
        <div className="glass-strong mt-10 flex items-center gap-3 rounded-full p-2 pl-6">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground/60" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter loaded specimens by name or ID…"
            className="h-12 flex-1 bg-transparent text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="px-3 text-xs text-foreground/60 hover:text-aether">clear</button>
          )}
        </div>
      </Reveal>

      {/* type filters */}
      <Reveal delay={0.15}>
        <div className="mt-6 flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => {
            const active = activeTypes.has(t);
            return (
              <button key={t} onClick={() => toggleType(t)} className={`transition ${active ? "scale-105" : "opacity-70 hover:opacity-100"}`}>
                <TypeBadge type={t} />
              </button>
            );
          })}
          {activeTypes.size > 0 && (
            <button onClick={() => setActiveTypes(new Set())} className="ml-2 rounded-full border border-white/10 px-3 py-1 label-caps text-foreground/60 hover:text-aether">reset</button>
          )}
        </div>
      </Reveal>

      {/* grid */}
      <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-strong h-[420px] animate-pulse rounded-[24px]" />
        ))}
        {filtered.map((p, i) => (
          <PokemonCard key={p.id} p={p} index={i} />
        ))}
      </motion.div>

      <div className="mt-16 flex justify-center">
        <MagneticButton onClick={() => setLimit((l) => l + 24)} variant="ghost">
          Initialize Next Sequence
        </MagneticButton>
      </div>
    </div>
  );
}