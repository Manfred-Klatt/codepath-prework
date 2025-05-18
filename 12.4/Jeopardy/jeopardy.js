class JeopardyGame {
  constructor() {
    this.NUM_CATEGORIES = 6;
    this.NUM_QUESTIONS_PER_CAT = 5;
    this.BASE_API_URL = "https://rithm-jeopardy.herokuapp.com/api";
    this.categories = [];
    this.score = 0;
    
    this.initializeGame();
  }
  
  async initializeGame() {
    this.bindEventListeners();
  }
  
  bindEventListeners() {
    $("#start").on("click", () => this.setupAndStart());
    $("#jeopardy").on("click", "td", (e) => this.handleClick(e));
  }
  
  async getCategoryIds() {
    try {
      const response = await axios.get(`${this.BASE_API_URL}/categories`, {
        params: {
          count: 100,
          offset: Math.floor(Math.random() * 500)
        }
      });
      
      const categoriesWithEnoughClues = response.data.filter(
        cat => cat.clues_count >= this.NUM_QUESTIONS_PER_CAT
      );
      
      const shuffled = _.shuffle(categoriesWithEnoughClues);
      return shuffled.slice(0, this.NUM_CATEGORIES).map(cat => cat.id);
    } catch (error) {
      console.error("Error fetching category IDs:", error);
      throw error;
    }
  }
  
  async getCategory(catId) {
    try {
      const response = await axios.get(`${this.BASE_API_URL}/category`, {
        params: { id: catId }
      });
      
      const category = response.data;
      const allClues = category.clues;
      const randomClues = _.sampleSize(allClues, this.NUM_QUESTIONS_PER_CAT);
      
      const clues = randomClues.map((clue, index) => ({
        question: clue.question || "No question available",
        answer: clue.answer || "No answer available",
        showing: null,
        value: clue.value || 200 * (index + 1)
      }));
      
      return {
        title: category.title || "Unknown Category",
        clues: clues
      };
    } catch (error) {
      console.error(`Error fetching category ${catId}:`, error);
      throw error;
    }
  }
  
  async fillTable() {
    const $thead = $("<thead>");
    const $tr = $("<tr>");
    
    // Add category headers
    for (const category of this.categories) {
      $tr.append($("<th>").text(category.title));
    }
    
    $thead.append($tr);
    $("#jeopardy").empty().append($thead);
    
    // Create game board
    const $tbody = $("<tbody>");
    
    for (let clueIdx = 0; clueIdx < this.NUM_QUESTIONS_PER_CAT; clueIdx++) {
      const $tr = $("<tr>");
      
      for (let catIdx = 0; catIdx < this.NUM_CATEGORIES; catIdx++) {
        const $td = $("<td>")
          .attr("id", `${catIdx}-${clueIdx}`)
          .text("?")
          .data("clue", this.categories[catIdx].clues[clueIdx])
          .toggleClass("disabled", this.categories[catIdx].clues[clueIdx].showing === "answer");
        
        $tr.append($td);
      }
      
      $tbody.append($tr);
    }
    
    $("#jeopardy").append($tbody);
  }
  
  handleClick(evt) {
    const $tgt = $(evt.target);
    const clue = $tgt.data("clue");
    
    if (!$tgt.is("td") || !clue || $tgt.hasClass("disabled")) return;
    
    if (clue.showing === null) {
      // Show question
      $tgt.text(clue.question);
      clue.showing = "question";
    } else if (clue.showing === "question") {
      // Show answer
      $tgt.text(clue.answer);
      clue.showing = "answer";
      $tgt.addClass("disabled");
      
      // Update score (you can implement scoring logic here)
      // this.updateScore(clue.value);
    }
  }
  
  updateScore(points) {
    this.score += points;
    $(".score-count").text(this.score);
  }
  
  showLoadingView() {
    $("#jeopardy").empty();
    $("#spin-container").show();
    $("#start").text("Loading...").prop("disabled", true);
  }
  
  hideLoadingView() {
    $("#spin-container").hide();
    $("#start").text("Restart Game").prop("disabled", false);
  }
  
  async setupAndStart() {
    this.showLoadingView();
    
    try {
      const catIds = await this.getCategoryIds();
      this.categories = [];
      
      // Reset score
      this.score = 0;
      $(".score-count").text(this.score);
      
      // Load categories in parallel
      const categoryPromises = catIds.map(catId => this.getCategory(catId));
      this.categories = await Promise.all(categoryPromises);
      
      await this.fillTable();
      this.hideLoadingView();
    } catch (error) {
      console.error("Error setting up game:", error);
      this.hideLoadingView();
      alert("Failed to load game. Please try again.");
    }
  }
}

// Initialize the game when the document is ready
$(document).ready(() => {
  window.jeopardyGame = new JeopardyGame();
});
