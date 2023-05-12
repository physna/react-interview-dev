import { useAsync } from "@/hooks/useAsync";
import { useEffect } from "react";
import { Pokemon } from "pokedex-promise-v2";

export default function Home() {
  const { run, data } = useAsync<Pokemon[]>();

  useEffect(() => {
    run(async () => {
      const response = await fetch(`/api/pokemon`);

      return response.json();
    });
  }, [run]);

  return (
    <main>
      <section className="grid grid-cols-4 gap-4 p-24">
        {data &&
          data.map((pokemon) => (
            <div
              key={pokemon.name}
              className="max-w-sm rounded overflow-hidden shadow-lg"
            >
              {pokemon.sprites.front_default && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-full"
                  src={pokemon.sprites.front_default}
                  alt={`Sprite of ${name}`}
                />
              )}
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{pokemon.name}</div>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}
