const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const BASE_API_URL = "https://rithm-jeopardy.herokuapp.com/api";

let categories = [];

async function getCategoryIds() {
  let response = await axios.get(`${BASE_API_URL}categories`, {
    params: {
      count: 100,
      offset: Math.floor(Math.random() * 500)
    }
  });
  
  let categoriesWithEnoughClues = response.data.filter(
    cat => cat.clues_count >= NUM_QUESTIONS_PER_CAT
  );
  
  let shuffled = _.shuffle(categoriesWithEnoughClues);
  return shuffled.slice(0, NUM_CATEGORIES).map(cat => cat.id);
}

async function getCategory(catId) {
  let response = await axios.get(`${BASE_API_URL}category`, {
    params: { id: catId }
  });
  
  let category = response.data;
  let allClues = category.clues;
  let randomClues = _.sampleSize(allClues, NUM_QUESTIONS_PER_CAT);
  let clues = randomClues.map(clue => ({
    question: clue.question,
    answer: clue.answer,
    showing: null,
    value: clue.value || 200 * (randomClues.indexOf(clue) + 1)
  }));
  
  return {
    title: category.title,
    clues: clues
  };
}

async function fillTable() {
  let $thead = $("<thead>");
  let $tr = $("<tr>");
  
  for (let category of categories) {
    $tr.append($("<th>").text(category.title));
  }
  
  $thead.append($tr);
  $("#jeopardy").empty().append($thead);
  
  let $tbody = $("<tbody>");
  
  for (let clueIdx = 0; clueIdx < NUM_QUESTIONS_PER_CAT; clueIdx++) {
    let $tr = $("<tr>");
    
    for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) {
      let $td = $("<td>")
        .attr("id", `${catIdx}-${clueIdx}`)
        .text("?")
        .data("clue", categories[catIdx].clues[clueIdx]);
      
      $tr.append($td);
    }
    
    $tbody.append($tr);
  }
  
  $("#jeopardy").append($tbody);
}

function handleClick(evt) {
  let $tgt = $(evt.target);
  let clue = $tgt.data("clue");
  
  if (!clue) return;
  
  if (clue.showing === null) {
    $tgt.text(clue.question);
    clue.showing = "question";
  } else if (clue.showing === "question") {
    $tgt.text(clue.answer);
    clue.showing = "answer";
    $tgt.addClass("disabled");
  }
}

function showLoadingView() {
  $("#jeopardy").empty();
  $("#spin-container").show();
  $("#start").text("Loading...").prop("disabled", true);
}
function hideLoadingView() {
  $("#spin-container").hide();
  $("#start").text("Restart Game").prop("disabled", false);
}
async function setupAndStart() {
  showLoadingView();
  
  try {
    let catIds = await getCategoryIds();
    categories = [];
    
    for (let catId of catIds) {
      categories.push(await getCategory(catId));
    }
    
    fillTable();
    hideLoadingView();
  } catch (e) {
    console.error("Error setting up game:", e);
    hideLoadingView();
    alert("Failed to load game. Please try again.");
  }
}

$("#start").on("click", setupAndStart);

$(document).ready(function() {
  $("#jeopardy").on("click", "td", handleClick);
});
