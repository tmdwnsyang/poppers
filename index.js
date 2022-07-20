import game from "./game.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, set,push,onValue,query,  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

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


initializeGame();


function initializeGame() {
  const levels = document.getElementsByClassName("levelTile");
  const container = document.querySelector("#container");
  let leaderBoard = getUserObjectInArray();  // records
  let debug = false;
  let gameObj = new game(easy, debug, leaderBoard);
  // MENU Options!! 0~6
  menuSelectClickHandler(levels[0], gameObj);
  menuSelectClickHandler(levels[1], gameObj);
  menuSelectClickHandler(levels[2], gameObj);
  openPopup(  'ranking', gameObj, levels[3] );
  openPopup(  'share', gameObj,levels[4]);
  openPopup( 'credits' , gameObj, levels[5]);
  // levels[5].addEventListener("click", openPopup);
  gameInProgressHandler(container, gameObj);
}

function backgroundChange(event, gameObj) {
  event.target.style.backgroundColor = gameObj.bgChange();
}

// Sets up the board with the number of required tiles.
// difficultySelection Buttons will disappear once the difficulty has been made
function menuSelectClickHandler(elem, gameObj) 
{
  elem.addEventListener("click", function (event)
   {
    var tiles = document.getElementsByClassName("tile");
    const idLevels = document.querySelector("#levels");
    var scoreCounter = document.querySelector("#subT");

    var difficulty = event.currentTarget.id;
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
  });
}

// theDiv represent the tiles that are being clicked. Upon clicks, the
// texts will be updated. Also keeps score of the game.

function gameInProgressHandler(elem, gameObj) {
  elem.addEventListener(
    "click",
    function handler(event) {
      backgroundChange(event, gameObj);

      var tiles = document.getElementsByClassName("tile");
      var scoreCounter = document.querySelector("#subT");
      const theDiv = event.target;
      var win = true;
      scoreCounter.appendChild(
        document.createTextNode(`score: ${gameObj.getBoardScore()}`)
      );
      gameObj.incrementBoardScore();
      theDiv.textContent = "Pop!";
      scoreCounter.textContent = `score: ${gameObj.getBoardScore()}`;
      for (
        let i = 0;
        i < gameObj.getBoardSize() - 1 && gameObj.getBoardScore() > 0;
        i++
      ) {
        if (
          tiles[i].style.backgroundColor != tiles[i + 1].style.backgroundColor
        ) {
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
        this.removeEventListener("click", handler);
        // this.removeEventListener("click", bgHandler);
        resultsPage(gameObj);
      }
    },
    false
  );
}

// runs when the game is over.
function resultsPage(gameObj) {
  //# ===== RESULT UI
  var tests = document.getElementsByClassName("hiddenTile");
  var hiddenTile = document.querySelector("#tile2");
  tests[0].style.visibility = "visible";
  tests[0].style.display = "block";
  tests[0].textContent = "YOU WON!";
  tests[0].style.color = "white";
  tests[0].style.backgroundColor = "#ff85dB";

  // Save all scores into a item file here
  appendItemChild(
    tests[0],
    `Your score is ${gameObj.getBoardScore()}. ${gameObj.getEncouragement()}`,
    "div",
    "subtextSmall"
  );

  // probably not the most elegant way, but this adds 3 buttons in the result.
  var str1 = ["Return", "Share", "Try Again"];
  for (let i = 0; i < 3; i++)
    appendItemChild(hiddenTile, str1[i], "button", "levelTile");

  hiddenTile.children[1].addEventListener("click", () => {
    window.location.reload();
  });
  hiddenTile.children[2].addEventListener("click", () => openPopup("share"));

  openPopup("victory", gameObj);
}

//# ========== POPUP HELPER FUNCTIONS =======================
// optional param 'elem' must be passed in if you desire it to be include an
// event handler, such as click
function openPopup(option, gameObj, elem = null) { 
    if (elem != null) {
      elem.addEventListener("click", () => popupClick(option, gameObj));
    }
    // for popups without an event listener 'click'
    else popupClick(option, gameObj);
}

function popupClick(option, gameObj) {
  
  let textHeading = document.createElement("h1");
  let windowPopup = document.getElementById("popup");
  windowPopup.classList.add("open-popup");
  clearChild(windowPopup);
  if (option === "ranking") {
    rankingPopup(windowPopup, gameObj);
  } else if (option === "victory") victoryPopup(windowPopup, gameObj);
  else if (option === "share")
    appendItemChild(windowPopup, "Share, with whom?", "h1");
  else if (option === "credits") {
    textHeading.textContent = "Credits, credits, CREDITS!";
    windowPopup.appendChild(textHeading);
  }
  if (option != "victory") {
    let dismissButton = appendItemChild(windowPopup, "dismiss", "button");
    dismissButton.addEventListener("click", closePopup);
  }
}

function closePopup() {
  let windowPopup = document.getElementById("popup");
  windowPopup.classList.remove("open-popup");
}

// Called by results() page. Responsible for saving the user game information
// and saving to the cloud.
function victoryPopup(windowPopup, gameObj) {
 appendItemChild(windowPopup, "Let's make you famous!", "h1");
  appendItemChild(windowPopup, "Enter your name below.", "subText");

  appendNewLineChild(windowPopup);
  var playerName = appendItemChild(windowPopup, null, "input");
  appendNewLineChild(windowPopup);

  var submitButton = appendItemChild(windowPopup, "Submit!", "button");

  submitButton.addEventListener("click", () => {
    gameObj.setPlayerProperties(playerName.value, gameObj.getBoardScore());
    closePopup();

    writeUserData(gameObj.getPlayerName(), gameObj.getPlayerScoreCount(),
      gameObj.getDifficulty(), 0);
  });
}

// 0 easy 1 hard 2 extreme
function rankingPopup(windowPopup, gameObj) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  console.log(gameObj.getLeaderBoard());
  appendItemChild(windowPopup, "World Ranking 🌎", "h1");
  
  var i = 1;
  for ( let level of gameObj.getLeaderBoard()) {
    {
      for (let ob of level)
      {
        appendItemChild(windowPopup, `${i}. ${ob.playerName.padEnd(20,'.').substr(0,20)} score: ${ob.score} mode: ${ob.difficulty}`,'div' ,'font-size: 2.0em');
        i++;
        // appendNewLineChild(windowPopup);
        if (i > 20) break;
      }
    }
  }
  appendNewLineChild(windowPopup);

  appendItemChild(windowPopup, `Latest data fetched at ${d}`, "subtextSmall",'subtext', 'font-size: 0.6em');
  appendNewLineChild(windowPopup);
  
  // for (let data of leaderBoard){
  //   console.log( `${data}`);
  // }



  }





//#======== FIREBASE DATABASE HELPER FUNCTIONS!========================
// Takes player info and saves data to the cloud
function writeUserData(playerName, score, difficulty, time = 0) {
  // const database = getDatabase(app);
  const postListRef = ref(db, difficulty);
  const newPostRef = push(postListRef);
  set(newPostRef, {
    difficulty: difficulty,
    playerName: playerName,
    score: score,
  });
  // console.log(newPostRef);
}

// Returns a container with 3 different difficulty levels and all users
// in a form of array, sorted.
function getUserObjectInArray(){
  let leaderBoard = [[],[],[]];
  var levelKeys = ['easy', 'hard', 'extreme'];
  for (let i = 0; i < levelKeys.length; i++) {
    const easyRef = query(ref(db, levelKeys[i]), orderByChild("score"));
    onValue(easyRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();

          leaderBoard[i].push({
            playerName: childData.playerName,
            score : childData.score,
            difficulty: childData.difficulty
          });
        });
      },
      { onlyOnce: true }
    );
  }

  // console.log(leaderBoard.length);


  return leaderBoard;
}
//# =============== document HELPER FUNCTIONS ===================
// pre: takes in parent object with children
// post: clears ALL children
function clearChild(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// post: takes in a parent element, item content to append, and type
// pre: returns element type. Appends the item to the last child
function appendItemChild(
  parent,
  textContent = "",
  elementType = "div",
  className = "",
  style ="",
) {
let item = document.createElement(elementType);
  item.textContent = textContent;
  parent.appendChild(item);
  if (className.length != 0) item.className = className;
  if (style != "") item.style.cssText += style;
  return item;
}

function appendNewLineChild(parent) {
  appendItemChild(parent, "", "br");
}
