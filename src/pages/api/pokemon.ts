// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Pokedex } from "@/utils/pokedex";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NamedAPIResourceList } from "pokedex-promise-v2";

export type PokemonList = NamedAPIResourceList;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokemonList>
) {
  const result = await Pokedex.getPokemonsList({
    limit: 10,
    offset: 0,
  });

  res.status(200).json(result);
}
