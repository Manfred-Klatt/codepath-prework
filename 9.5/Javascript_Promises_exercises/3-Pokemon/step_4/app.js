document.addEventListener("DOMContentLoaded", function() {
  let baseURL = "https://pokeapi.co/api/v2";

  let btn = document.querySelector("button");
  let pokeArea = document.getElementById("pokemon-area");

  btn.addEventListener("click", getPokemonData);

  async function getPokemonData() {
    try {

      pokeArea.innerHTML = "";

      let allData = await axios.get(`${baseURL}/pokemon/?limit=1000`);
      let randomPokemonUrls = [];

      for (let i = 0; i < 3; i++) {
        let randomIdx = Math.floor(Math.random() * allData.data.results.length);
        let url = allData.data.results.splice(randomIdx, 1)[0].url;
        randomPokemonUrls.push(url);
      }

      let pokemonData = await Promise.all(
        randomPokemonUrls.map(url => axios.get(url))
      );

      let speciesData = await Promise.all(
        pokemonData.map(p => axios.get(p.data.species.url))
      );

      speciesData.forEach((d, i) => {

        let descriptionObj = d.data.flavor_text_entries.find(function(entry) {
          return entry.language.name === "en";
        });

        let description = descriptionObj ? descriptionObj.flavor_text : "";
        let name = pokemonData[i].data.name;
        let imgSrc = pokemonData[i].data.sprites.front_default;
        
        pokeArea.insertAdjacentHTML('beforeend', makePokeCard(name, imgSrc, description));
      });
    } catch (error) {
      console.error("Error handling button click:", error);
    }
  }
  function makePokeCard(name, imgSrc, description) {
    return `
      <div class="card">
        <h1>${name}</h1>
        <img src=${imgSrc} />
        <p>${description}</p>
      </div>
    `;
  }
});
