import game from "./game.js";


// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js';
import { getDatabase, ref, set, push, onValue, query, orderByChild} from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDL5zVdi28woZKwXaqQGn488oaV4pfi5Fk",
  authDomain: "poppers-774a0.firebaseapp.com",
  projectId: "poppers-774a0",
  storageBucket: "poppers-774a0.appspot.com",
  messagingSenderId: "262767763780",
  appId: "1:262767763780:web:c2276624df9b1cd6dd7711",
  measurementId: "G-SCTSNJJ1F3",
  databaseURL: "https://poppers-774a0-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// var leaderBoardsRaw = fs.readFile('score.json');
// var leaderBoards = JSON.parse(leaderBoardsRaw);
// fetch('https://tmdwnsyang.github.io/poppers/score.json')
// .then(response => {
//   if (!response.ok) 
//     throw new Error(`HTTP error: ${response.status}`);
//   else{
//     return response.json();
//   }}).then( data => {
//     leaderBoards = data;
    
//     // console.log(leaderBoards);
//   } ).catch( error => {
//     console.error(`could not get scores json: ${error}`);
//   })


//! linebreaks and other formatting stuff
var scoreCounter = document.querySelector("#subT");
const idLevels = document.querySelector("#levels");
const levels = document.getElementsByClassName("levelTile");
const container = document.querySelector("#container");
var tiles = document.getElementsByClassName("tile");
let debug = true;
let gameObj = new game(easy, debug);
let leaderBoard

// MENU Options!! 0~6 
levels[0].addEventListener("click",  difficultySelection);
levels[1].addEventListener("click",  difficultySelection);
levels[2].addEventListener("click", difficultySelection);
levels[3].addEventListener("click", ()=> openPopup('scoreBoard'));
levels[4].addEventListener("click", ()=> openPopup('share'));
levels[5].addEventListener("click", openPopup);
container.addEventListener("click", backgroundChange);
container.addEventListener("click", popperGameInProgress);



// Sets up the board with the number of rquired tiles.
// difficultySelection Buttons will disappear once the difficulty has been made
function difficultySelection(event) {
  var difficulty = event.currentTarget.id;
  console.log(difficulty);
  closePopup();
  gameObj.setGameProperties(difficulty);
  for (let i = 0; i < gameObj.getBoardSize(); i++) {
    var divTile = document.createElement("button");
    divTile.className = "tile";
    container.appendChild(divTile);
  }

  clearChild(idLevels);
  for (let item of tiles) {
    item.style.visibility = "visible";
  }
  scoreCounter.textContent = "Click anywhere below to begin!";
}

// theDiv represent the tiles that are being clicked. Upon clicks, the
// texts will be updated. Also keeps score of the game.
function popperGameInProgress() {
  const theDiv = event.target;

  var win = true;
  scoreCounter.appendChild(document.createTextNode(`score: ${gameObj.getBoardScore()}`));

  gameObj.incrementBoardScore();

  theDiv.textContent = "Pop!";
  scoreCounter.textContent = `score: ${gameObj.getBoardScore()}`;
  for (let i = 0; i < gameObj.getBoardSize() - 1 && gameObj.getBoardScore() > 0; i++) {
    if (tiles[i].style.backgroundColor != tiles[i + 1].style.backgroundColor) {
      console.log("Different color!");
      win = false;
      break;
    } else win = true;
  }
  if (win) {
    for (let item of tiles) {
      item.textContent = "🥳";
    }
    // document.body.style.background = 'black';
    this.removeEventListener("click", popperGameInProgress);
    this.removeEventListener("click", backgroundChange);

    resultsPage();
  }
}
function backgroundChange() {
  event.target.style.backgroundColor = gameObj.bgChange();
}

// runs when the game is over.
function resultsPage() {

  //# ===== RESULT UI 
  var tests = document.getElementsByClassName("hiddenTile");
  var hiddenTile = document.querySelector('#tile2');
  tests[0].style.visibility = "visible";
  tests[0].style.display ="block";
  tests[0].textContent = "YOU WON!";
  tests[0].style.color = "white";
  tests[0].style.backgroundColor = "#ff85dB";

  // Save all scores into a item file here
  appendItemChild(tests[0],`Your score is ${gameObj.getBoardScore()}. ${gameObj.getEncouragement()}`,'div', 'subtextSmall');

  // probably not the most elegant way, but this adds 3 buttons in the result.
  var str1=['Return','Share','Try Again'];
  for( let i = 0; i < 3; i++)
    appendItemChild(hiddenTile,str1[i], 'button','levelTile');

  hiddenTile.children[1].addEventListener("click", () => {window.location.reload()});
  hiddenTile.children[2].addEventListener("click", () => openPopup('share'));
  
  openPopup('gameOver');
}

//# ========== POPUP MENUS
function openPopup(option = 'ERROR'){
  let textHeading = document.createElement("h2");
  let windowPopup = document.getElementById("popup");
  windowPopup.classList.add("open-popup");

  clearChild(windowPopup);
  if (option ==='scoreBoard')
  {
    scoreboardPopup(windowPopup);
  }
  else if (option === 'gameOver')
    gameOverPopup(windowPopup);
  else if (option === 'share')
    appendItemChild(windowPopup, 'Share, to whom?','h2');
  else{
    textHeading.textContent = "Credits, credits, CREDITS!";
    windowPopup.appendChild(textHeading);
  }
  if (option != 'gameOver'){
    let dismissButton = appendItemChild(windowPopup, 'dismiss','button');
    dismissButton.addEventListener("click", closePopup);
  }
  
}

function closePopup(){
  let windowPopup = document.getElementById('popup');
   windowPopup.classList.remove('open-popup');
}




//# === POPUP: NAME INPUT DIALOGUE
// Called by results() page. Responsible for saving the user game information 
// and saving to the cloud.
function gameOverPopup (windowPopup){
  appendItemChild(windowPopup, "Let's make you famous!", "h2");
  appendItemChild(windowPopup, "Enter your name below.", "subText");

  
  appendNewLineChild(windowPopup);
  var playerName = appendItemChild(windowPopup, null, "input");
  appendNewLineChild(windowPopup);
  

  var submitButton = appendItemChild(windowPopup, "Submit!", "button");

  submitButton.addEventListener('click',()=> {
    gameObj.setPlayerProperties(playerName.value, gameObj.getBoardScore() );
    closePopup();
    
    writeUserData(gameObj.getPlayerName(), gameObj.getPlayerScoreCount(), 
                  gameObj.getDifficulty(), 0);  
  });
  
}

function scoreboardPopup(windowPopup){
  appendItemChild(windowPopup, "Scoreboard", "h2");
  var topThree = [ [], [], []];
  const easyRef = query(ref(db, 'easy'), orderByChild('score'));
  onValue(easyRef, (snapshot) => {
    snapshot.forEach((childSnapshot) =>{
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      console.log(`${childData.playerName} | ${childData.score}`);
      // console.log(childKey);
    });
}, { onlyOnce: true});
  

}


//# FIREBASE DATABASE HELPER FUNCTIONS!
function writeUserData( playerName, score, difficulty, time = 0)
{
  // const database = getDatabase(app);
  const postListRef = ref(db, difficulty);
  const newPostRef = push(postListRef);
  set(newPostRef, {
    difficulty: difficulty,
    playerName : playerName,
    score : score
  })
  console.log(newPostRef);
}

//============================================================
// HELPER FUNCTIONS....
// pre: takes in parent object with children
// post: clears ALL children
function clearChild(parent)
{
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// post: takes in a parent element, item content to append, and type
// pre: returns element type. Appends the item to the last child
function appendItemChild(parent, textContent ='', elementType = 'div', className  =''){
  let item = document.createElement(elementType);
  item.textContent = textContent;
  parent.appendChild(item);
  if (className.length != 0)
    item.className = className; 
  return item;
}

function appendNewLineChild(parent)
{
  appendItemChild(parent, '', 'br');
}
