// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Pokedex } from "@/utils/pokedex";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NamedAPIResourceList, Pokemon } from "pokedex-promise-v2";

export type PokemonList = NamedAPIResourceList;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pokemon | { error: string }>
) {
  const { name } = req.query;

  if (typeof name !== "string") {
    res.status(400).json({
      error: "BAD_REQUEST",
    });

    return;
  }

  try {
    const result = await Pokedex.getPokemonByName(name);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      error: "NOT_FOUND",
    });
  }
}
