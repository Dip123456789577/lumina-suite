export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export const getImageUrl = (id: number) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export async function getPokemonList(limit = 50, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error("Failed to fetch pokemon list");
  
  const data = await response.json();
  
  // Enhance results with ID and image URL
  data.results = data.results.map((p: any) => {
    const urlParts = p.url.split('/');
    const id = parseInt(urlParts[urlParts.length - 2], 10);
    return {
      ...p,
      id,
      image: getImageUrl(id)
    };
  });
  
  return data;
}

export async function getPokemonDetail(idOrName: string | number) {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) throw new Error(`Failed to fetch pokemon: ${idOrName}`);
  return response.json();
}

export async function getPokemonSpecies(idOrName: string | number) {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`);
  if (!response.ok) throw new Error(`Failed to fetch pokemon species: ${idOrName}`);
  return response.json();
}

export async function getEvolutionChain(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch evolution chain");
  return response.json();
}
