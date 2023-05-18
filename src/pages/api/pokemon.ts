// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Pokedex } from "@/utils/pokedex";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NamedAPIResourceList, Pokemon } from "pokedex-promise-v2";

export type SimplePokemon = Pick<Pokemon, "name" | "id"> & {
  image: string | null;
};

export type PokemonList = Omit<NamedAPIResourceList, "results"> & {
  results: SimplePokemon[];
};

function asSimplePokemon(pokemon: Pokemon): SimplePokemon {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.front_default,
  };
}

const cache = new Map<string, SimplePokemon>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokemonList>
) {
  const { count, next, previous, results } = await Pokedex.getPokemonsList({
    limit:
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit, 10)
        : undefined,
    offset:
      typeof req.query.offset === "string"
        ? parseInt(req.query.offset, 10)
        : undefined,
  });

  const names = results
    .filter(({ name }) => !cache.has(name))
    .map(({ name }) => name);

  const pokemon = await Pokedex.getPokemonByName(names);

  pokemon.forEach((entry) => {
    cache.set(entry.name, asSimplePokemon(entry));
  });

  res.status(200).json({
    count,
    next:
      next &&
      next.replace("https://pokeapi.co/api/v2", "http://localhost:3000/api"),
    previous:
      previous &&
      previous.replace(
        "https://pokeapi.co/api/v2",
        "http://localhost:3000/api"
      ),
    results: results
      .map(({ name }) => {
        if (cache.has(name)) {
          return cache.get(name) as SimplePokemon;
        }

        const found = pokemon.find((entry) => entry.name === name);

        if (!found) {
          throw new Error("Missing pokemon entry");
        }

        return asSimplePokemon(found);
      })
      .filter(Boolean),
  });
}
