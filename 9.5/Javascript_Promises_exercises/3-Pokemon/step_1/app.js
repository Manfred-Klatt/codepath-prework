document.addEventListener("DOMContentLoaded", function() {
  let baseURL = "https://pokeapi.co/api/v2";

  let btn = document.querySelector("button");

  async function fetchPokemon() {
    try {
      let response = await axios.get(`${baseURL}/pokemon/?limit=1000`);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data for part1:", error);
    }
  }
  btn.addEventListener("click", fetchPokemon);
});
