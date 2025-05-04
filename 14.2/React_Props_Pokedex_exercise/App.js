import {
  useState,
  useEffect
} from "react";

function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemon = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokémon not found");
      const data = await res.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery("1");
    fetchPokemon();
  }, []);

  return React.createElement(
    "div", {
      className: "min-h-screen bg-gray-100 p-4 flex flex-col items-center"
    },

    React.createElement("h1", {
      className: "text-4xl font-bold text-red-500 mb-4"
    }, "Pokédex"),

    React.createElement(
      "div", {
        className: "flex gap-2 mb-4"
      },
      React.createElement("input", {
        type: "text",
        className: "border border-gray-300 rounded px-3 py-2",
        placeholder: "Enter Pokémon name or ID",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") fetchPokemon();
        },
      }),
      React.createElement(
        "button", {
          onClick: fetchPokemon,
          className: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded",
        },
        "Search"
      )
    ),

    loading && React.createElement("p", {
      className: "text-gray-700"
    }, "Loading..."),

    error && React.createElement("p", {
      className: "text-red-500"
    }, error),

    pokemon &&
    React.createElement(
      "div", {
        className: "grid place-items-center w-full"
      },
      React.createElement(
        "div", {
          className: "bg-white shadow-xl rounded-2xl p-6 w-96 text-center border border-gray-200",
        },
        React.createElement("img", {
          src: pokemon.sprites.front_default,
          alt: pokemon.name,
          className: "mx-auto mb-4 w-32 h-32",
        }),
        React.createElement(
          "h2", {
            className: "text-2xl font-semibold capitalize mb-2"
          },
          pokemon.name
        ),
        React.createElement(
          "p", {
            className: "text-sm text-gray-500 mb-4"
          },
          `ID: ${pokemon.id}`
        ),
        React.createElement(
          "div", {
            className: "mb-4"
          },
          React.createElement("h3", {
            className: "font-medium text-gray-700 mb-1"
          }, "Types:"),
          React.createElement(
            "div", {
              className: "flex justify-center flex-wrap gap-2"
            },
            pokemon.types.map((t) =>
              React.createElement(
                "span", {
                  key: t.type.name,
                  className: "px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize",
                },
                t.type.name
              )
            )
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement("h3", {
            className: "font-medium text-gray-700 mb-1"
          }, "Stats:"),
          React.createElement(
            "ul", {
              className: "text-left text-sm space-y-1"
            },
            pokemon.stats.map((stat) =>
              React.createElement(
                "li", {
                  key: stat.stat.name
                },
                React.createElement(
                  "span", {
                    className: "capitalize font-medium"
                  },
                  stat.stat.name
                ),
                `: ${stat.base_stat}`
              )
            )
          )
        )
      )
    )
  );
}

export default App;