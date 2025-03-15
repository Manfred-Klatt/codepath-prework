const giphyCpiKey = "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym";

const generateGifsButton = document.getElementById("generate-gifs-btn");
const clearGifsButton = document.getElementById("clear-gifs-btn");

const display = document.getElementById("display-div");

generateGifsButton.addEventListener("click", generateGifs);
clearGifsButton.addEventListener("click", clearGifs);

async function grabGifFromApi(query) {

  const response = await axios.get(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${giphyCpiKey}&limit=10`);

  return response.data.data.map((val) => {
    return {
      gifURL: val.images.fixed_width.url
    }
  });
}

function getInputData() 
  {
    const dataInput = document.getElementById("search-input");
    return dataInput.value;
  }

async function generateGifs(e) {
  e.preventDefault();

  display.innerHTML = "";

  const inputData = getInputData();

  const gifs = await grabGifFromApi(inputData)

  const firstRow = document.createElement("div");
  const secondRow = document.createElement("div");

  firstRow.classList.add("row", "first");
  secondRow.classList.add("row", "second");

  for (let i = 0; i < gifs.length / 2; i++) {
    const image = document.createElement("img");
    
    image.src = gifs[i].gifURL;

    firstRow.appendChild(image);
  }

  for (let i = 5; i < gifs.length; i++) {
    const image = document.createElement("img");
    
    image.src = gifs[i].gifURL;

    secondRow.appendChild(image);
  }

  display.appendChild(firstRow);
  display.appendChild(secondRow);
};

function clearGifs() {
  display.innerHTML = "";
  display.innerHTML = "... GIF here ...";
}

