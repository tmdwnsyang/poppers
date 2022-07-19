class game {
  // public by default

  constructor(difficulty = 'easy', debug = true){
 
    this.#debugState = debug;
    this.#boardScoreCount = new Number();
    this.#difficulty = difficulty;
    this.#calculateBoardProperties(difficulty);
    this.setPlayerProperties(null);
  }
  // Takes and sets difficulty level in string and calculates board properties 
  // accordingly
  setGameProperties(difficulty){ 
    this.#difficulty = difficulty;
    this.#calculateBoardProperties(difficulty);
  }

  // returns score count in integer > 0
  getPlayerScoreCount() {
    return this.#playerScoreCount;
  }

  // Returns the difficulty level in string
  getDifficulty() {
    return this.#difficulty;
  }
  getBoardSize() {
    return this.#boardSize;
  }
  getBoardScore(){ return this.#boardScoreCount;}
  random(number) {
    return Math.floor(Math.random() * number);
  }
  getEncouragement(){
    return this.#encouragements[this.#encourageIndex][this.random(2)];
  }
  getPlayerName() { return this.#playerName;}
  bgChange() {
    const rndCol = `rgb(${this.random(this.#leftBound) * this.#rightBound}, 
              ${this.random(this.#leftBound) * this.#rightBound}, ${
      this.random(this.#leftBound) * this.#rightBound
    })`;
    return rndCol;
  }
  incrementBoardScore() { this.#boardScoreCount++};
  
  setPlayerProperties(name , currentScore = this.#boardScoreCount) { 
    this.#playerName = name;
    this.#playerScoreCount = currentScore;
}
  
  // PRIVATE FIELDS

  // For param use a very small number. Multiples should not exceed 250
  // Sets board size and debug properties
  #calculateBoardProperties(difficulty) {
    if (difficulty === "easy") {
      this.#encourageIndex = 0;
      this.#boardSize = 4;
      this.#leftBound = 2;
      this.#rightBound = 120;
    } else if (difficulty === "hard") {
      this.#encourageIndex = 1;
      this.#boardSize = 8;
      this.#leftBound = 4;
      this.#rightBound = 63;
    } else {
      this.#encourageIndex = 2;
      this.#boardSize = 16;
      this.#leftBound = 255;
      this.#rightBound = 1;
    }
    if (this.#debugState) this.#boardSize = 1;

  }
  #boardSize;
  #debugState;
  #difficulty;
  #encourageIndex;
  #leftBound;
  #rightBound;
  #boardScoreCount;
  #encouragements = [
    [
      "That wasn't so bad, was it? Easy mode rules!",
      "Wow, that was great! Now why not try the hard or the extreme mode?",
      "Easy-peasy-lemon-squeezy!",
    ],
    [
      "Oh wow, great work beating the hard mode!",
      "Fantastic work! Now do the extreme mode 😈.",
      "Excellent job! You are the popperMain GOD!",
    ],
    ["How did you do that!?", "... I love you — marry me?", "Dear Neptune!"],
  ];
  
  // player properties
  #playerScoreCount;
  #playerDifficultyChoice;
  #playerName;
}

export default game;