document.addEventListener("DOMContentLoaded", function() {
  let baseURL = "https://pokeapi.co/api/v2";

  let btn = document.querySelector("button");

  async function fetchPokemonAndProcessTheData() {
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

      pokemonData.forEach(p => console.log(p.data));

    } catch (error) {
      console.error("Error fetching data for part2:", error);
    }
  }
  btn.addEventListener("click", fetchPokemonAndProcessTheData);
});
