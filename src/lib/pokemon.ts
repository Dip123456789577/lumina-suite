const POKEAPI = "https://pokeapi.co/api/v2";

export type PokeType =
  | "normal" | "fire" | "water" | "electric" | "grass" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
  | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";

export interface PokemonSummary {
  id: number;
  name: string;
  types: PokeType[];
  sprite: string;
  artwork: string;
  stats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number };
  total: number;
  height: number;
  weight: number;
}

export interface PokemonDetail extends PokemonSummary {
  abilities: { name: string; hidden: boolean }[];
  flavor: string;
  genus: string;
  moves: { name: string; type: PokeType; power: number | null; accuracy: number | null }[];
}

export const TYPE_COLORS: Record<PokeType, { bg: string; fg: string; glow: string }> = {
  normal:   { bg: "rgba(168,168,120,0.18)", fg: "#d4d4a8", glow: "rgba(168,168,120,0.5)" },
  fire:     { bg: "rgba(240,128,48,0.22)", fg: "#ffb27a", glow: "rgba(240,128,48,0.6)" },
  water:    { bg: "rgba(104,144,240,0.22)", fg: "#9cb8ff", glow: "rgba(104,144,240,0.55)" },
  electric: { bg: "rgba(248,208,48,0.20)", fg: "#ffe07a", glow: "rgba(248,208,48,0.6)" },
  grass:    { bg: "rgba(120,200,80,0.22)", fg: "#9cdc7c", glow: "rgba(120,200,80,0.55)" },
  ice:      { bg: "rgba(152,216,216,0.22)", fg: "#bfeaea", glow: "rgba(152,216,216,0.55)" },
  fighting: { bg: "rgba(192,48,40,0.22)", fg: "#ff8a80", glow: "rgba(192,48,40,0.55)" },
  poison:   { bg: "rgba(160,64,160,0.22)", fg: "#d28cd2", glow: "rgba(160,64,160,0.55)" },
  ground:   { bg: "rgba(224,192,104,0.22)", fg: "#ecd599", glow: "rgba(224,192,104,0.55)" },
  flying:   { bg: "rgba(168,144,240,0.22)", fg: "#c4b3ff", glow: "rgba(168,144,240,0.55)" },
  psychic:  { bg: "rgba(248,88,136,0.22)", fg: "#ff9bb8", glow: "rgba(248,88,136,0.55)" },
  bug:      { bg: "rgba(168,184,32,0.22)", fg: "#c8d76b", glow: "rgba(168,184,32,0.55)" },
  rock:     { bg: "rgba(184,160,56,0.22)", fg: "#d9c184", glow: "rgba(184,160,56,0.55)" },
  ghost:    { bg: "rgba(112,88,152,0.25)", fg: "#b0a0d8", glow: "rgba(112,88,152,0.55)" },
  dragon:   { bg: "rgba(112,56,248,0.25)", fg: "#b39cff", glow: "rgba(112,56,248,0.6)" },
  dark:     { bg: "rgba(112,88,72,0.25)", fg: "#b8a99a", glow: "rgba(112,88,72,0.55)" },
  steel:    { bg: "rgba(184,184,208,0.22)", fg: "#dcdcec", glow: "rgba(184,184,208,0.5)" },
  fairy:    { bg: "rgba(238,153,172,0.22)", fg: "#ffc3d2", glow: "rgba(238,153,172,0.55)" },
};

function artworkFor(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
function spriteFor(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function fetchPokemon(idOrName: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Specimen not found");
  const data = await res.json();
  const species = await fetch(data.species.url).then((r) => r.json());

  const flavor = (species.flavor_text_entries as { flavor_text: string; language: { name: string } }[])
    .find((e) => e.language.name === "en")?.flavor_text.replace(/[\f\n\r]/g, " ") ?? "";
  const genus = (species.genera as { genus: string; language: { name: string } }[])
    .find((g) => g.language.name === "en")?.genus ?? "";

  const stats = {
    hp: data.stats[0].base_stat,
    attack: data.stats[1].base_stat,
    defense: data.stats[2].base_stat,
    spAtk: data.stats[3].base_stat,
    spDef: data.stats[4].base_stat,
    speed: data.stats[5].base_stat,
  };

  const moves = (data.moves as { move: { name: string; url: string } }[])
    .slice(0, 8)
    .map((m) => ({ name: m.move.name.replace(/-/g, " "), type: "normal" as PokeType, power: null, accuracy: null }));

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: { type: { name: PokeType } }) => t.type.name),
    sprite: spriteFor(data.id),
    artwork: artworkFor(data.id),
    stats,
    total: Object.values(stats).reduce((a, b) => a + b, 0),
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map((a: { ability: { name: string }; is_hidden: boolean }) => ({
      name: a.ability.name.replace(/-/g, " "),
      hidden: a.is_hidden,
    })),
    flavor,
    genus,
    moves,
  };
}

export async function fetchPokemonList(limit = 24, offset = 0): Promise<PokemonSummary[]> {
  const res = await fetch(`${POKEAPI}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  const results = await Promise.all(
    (data.results as { name: string; url: string }[]).map(async (p) => {
      const id = Number(p.url.split("/").filter(Boolean).pop());
      const det = await fetch(p.url).then((r) => r.json());
      const stats = {
        hp: det.stats[0].base_stat,
        attack: det.stats[1].base_stat,
        defense: det.stats[2].base_stat,
        spAtk: det.stats[3].base_stat,
        spDef: det.stats[4].base_stat,
        speed: det.stats[5].base_stat,
      };
      return {
        id,
        name: det.name,
        types: det.types.map((t: { type: { name: PokeType } }) => t.type.name),
        sprite: spriteFor(id),
        artwork: artworkFor(id),
        stats,
        total: Object.values(stats).reduce((a, b) => a + b, 0),
        height: det.height / 10,
        weight: det.weight / 10,
      } as PokemonSummary;
    }),
  );
  return results;
}

export const FEATURED_IDS = [6, 150, 448, 384, 25, 658];
export const TRENDING_IDS = [25, 94, 133, 658, 887, 778, 130, 149];