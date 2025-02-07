document.addEventListener("DOMContentLoaded", function() {
  let baseURL = "https://pokeapi.co/api/v2";

  let btn = document.querySelector("button");

  async function fetchPokemonAndSpecies() {
    try {
      
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

      let descriptions = speciesData.map(d => {
        let descriptionObj = d.data.flavor_text_entries.find(
          entry => entry.language.name === "en"
        );
        return descriptionObj
          ? descriptionObj.flavor_text
          : "No description available.";
      });

      descriptions.forEach((desc, i) => {
        console.log(`${pokemonData[i].data.name}: ${desc}`);
      });

    } catch (error) {
      console.error("Error fetching data for part3:", error);
    }
  }

  btn.addEventListener("click", fetchPokemonAndSpecies);
});
