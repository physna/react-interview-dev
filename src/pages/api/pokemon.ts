// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Pokedex } from "@/utils/pokedex";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NamedAPIResourceList, Pokemon } from "pokedex-promise-v2";

export type PokemonList = NamedAPIResourceList;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pokemon[]>
) {
  const pokemonList = await Pokedex.getPokemonsList({
    limit: 10,
    offset: 0,
  });

  const pokemon = await Pokedex.getPokemonByName(
    pokemonList.results.map(({ name }) => name)
  );

  res.status(200).json(pokemon);
}
