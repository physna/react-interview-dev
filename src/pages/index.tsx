import Image from "next/image";
import { Inter } from "next/font/google";
import { useAsync } from "@/hooks/useAsync";
import { PokemonList } from "./api/pokemon";
import { useEffect } from "react";
import { Pokemon } from "pokedex-promise-v2";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { run, data } = useAsync<PokemonList>();

  useEffect(() => {
    run(async () => {
      const response = await fetch("/api/pokemon");
      return response.json();
    });
  }, [run]);

  return (
    <main className={`grid grid-cols-4 gap-4 p-24 ${inter.className}`}>
      {data &&
        data.results.map((results) => (
          <PokemonCard key={results.name} name={results.name} />
        ))}
    </main>
  );
}

interface PokemonCard {
  name: string;
}

function PokemonCard({ name }: PokemonCard) {
  const { run, data, status } = useAsync<Pokemon>();

  useEffect(() => {
    run(async () => {
      const response = await fetch(`/api/pokemon/${name}`);
      return response.json();
    });
  }, [name, run]);

  return data ? (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      {data.sprites.front_default && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="w-full"
          src={data.sprites.front_default}
          alt={`Sprite of ${name}`}
        />
      )}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{data.name}</div>
      </div>
    </div>
  ) : null;
}
