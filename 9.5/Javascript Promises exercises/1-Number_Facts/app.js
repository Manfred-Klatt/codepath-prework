let favNumber = 3;
let baseURL = "http://numbersapi.com";

async function part1() 
{
  try {
    let response = await axios.get(`${baseURL}/${favNumber}?json`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data for part1:", error);
  }
}

part1();

const favNumbers = [3, 17, 51];

async function part2() {
  try {
    let response = await axios.get(`${baseURL}/${favNumbers}?json`);

    // Create an element to display results
    let resultDiv = document.createElement("div");
    resultDiv.innerHTML = "<h3>Trivia for Favorite Numbers:</h3>";

    // Iterate through the object and display each number's trivia
    Object.entries(response.data).forEach(([number, fact]) => {
      resultDiv.innerHTML += `<p><strong>${number}:</strong> ${fact}</p>`;
    });

    // Append to the body of the document
    document.body.appendChild(resultDiv);
  } catch (error) {
    console.error("Error fetching data for part2:", error);
  }
}
part2();

async function part3() 
{
  const button = document.querySelector("button");
  button.addEventListener("click", clickAndDisplayData);

  async function clickAndDisplayData() {
    try {
      let facts = await Promise.all(
        Array.from({ length: 4 }, () => axios.get(`${baseURL}/${favNumber}?json`))
      );
      facts.forEach(response => {
        document.body.insertAdjacentHTML('beforeend', `<p>${response.data.text}</p>`);
      });
    } catch (error) {
      console.error("Error fetching data for part3:", error);
    }
  }
}

part3();

