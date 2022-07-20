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


window.onload = initializeGame();


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
    var score = document.querySelector("#subT");

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
    score.textContent = "Click anywhere below to begin!";
  });
}

// theDiv represent the tiles that are being clicked. Upon clicks, the
// texts will be updated. Also keeps the SCORE and TIME of the PLAYER.
// The game progresses with a clickEvent handler
function gameInProgressHandler(elem, gameObj) {
  
  var startTime, myInterval, elapsedTime;
  var score = document.querySelector("#subT");
  var tiles = document.getElementsByClassName("tile");
  var subtextTime ;
  var win = false;

  startTime ;
  
  // Starts the timer for the first run
  var timer = ( function() {
    var executed = false;
    return function() { 
      if (!executed) {
        executed = true;
        elapsedTime = 0;
        startTime = Date.now();
        console.log('elapsedTime');
        
        myInterval = setInterval(function(){
          elapsedTime = Date.now() - startTime;
        },100);
        subtextTime = document.createElement('div');
        // subtextTime.className = 'subtextSmall';
      }
    }
  })();
  
  
  elem.addEventListener(
    "click",
    function handler(event) {
      // randomize background for every click
      backgroundChange(event, gameObj);
      
      // Starts the timer for the first run
      timer(); 

      // Increments the board score status
      const theDiv = event.target;
      gameObj.incrementBoardScore();
      theDiv.textContent = "Pop!";

      // Displays the player score and the timer while the game is running
      // Also STOPS the timer when the player wins
      var myInterval = setInterval(function() {
        if (!win){
          score.innerHTML = `score: ${gameObj.getBoardScore()}`;
          subtextTime.textContent = `time: ${(elapsedTime / 1000).toFixed(3)} s`;
          appendNewLineChild(score);
          score.appendChild(subtextTime);
        }
        else{
          clearInterval(myInterval);
        }
      }, 100);

      // Determines wins or losses by checking if the color matches every round
      for (let i = 0;
        i < gameObj.getBoardSize() - 1 && gameObj.getBoardScore() > 0;
        i++) {
        if (
          tiles[i].style.backgroundColor != tiles[i + 1].style.backgroundColor
        ) {
          console.log("Different color!");
          win = false;
          break;
        } else win = true;
      }

      // Sets player time property once the player wins and sets time
      if (win) {
        for (let item of tiles) {
          item.textContent = "🥳";
        }
        gameObj.setPlayerTime((elapsedTime / 1000).toFixed(3));

        this.removeEventListener("click", handler);
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
    `Your score is ${gameObj.getBoardScore()} with time of
    ${gameObj.getPlayerTime()}. ${gameObj.getEncouragement()}`,
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

    writeUserData(gameObj);
  });
}

// 0 easy 1 hard 2 extreme
function rankingPopup(windowPopup, gameObj) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  appendItemChild(windowPopup, "World Ranking 🌎", "h1");
  
  
  var i = 1;
  for ( let level of gameObj.getLeaderBoard() ) {
    {
      for (let ob of level)
      {
        appendItemChild(windowPopup, `${i}. ${ob.playerName.padEnd(20,'.').substr(0,16)} score: ${ob.score} | ${ob.difficulty} | ${ob.time}s`,'div' ,'font-size: 2.0em');
        i++;
        // appendNewLineChild(windowPopup);
        if (i > 15) break;
      }
    }
  }

  appendNewLineChild(windowPopup);

  appendItemChild(windowPopup, `Latest data fetched at ${d}`, "subtextSmall",'subtext', 'font-size: 0.6em');
  appendNewLineChild(windowPopup);
  appendItemChild(windowPopup, `*Ordered by descending time. Lower the score, the better!`, "subtextSmall",'div', 'font-size: 0.6em');
  appendNewLineChild(windowPopup);

  // for (let data of leaderBoard){
  //   console.log( `${data}`);
  // }



  }





//#======== FIREBASE DATABASE HELPER FUNCTIONS!========================
// Takes player info and saves data to the cloud
function writeUserData(playerObj) {
  // const database = getDatabase(app);
  const postListRef = ref(db, playerObj.getDifficulty());
  const newPostRef = push(postListRef);
  set(newPostRef, {
    difficulty: playerObj.getDifficulty(),
    playerName: playerObj.getPlayerName(),
    score: playerObj.getPlayerScoreCount(),
    time: playerObj.getPlayerTime() 
  });
  // console.log(newPostRef);
}

// Returns a container with 3 different difficulty levels and all users
// in a form of array, sorted.
function getUserObjectInArray(){
  let leaderBoard = [[],[],[]];
  var levelKeys = ['easy', 'hard', 'extreme'];
  for (let i = 0; i < levelKeys.length; i++) {
    const easyRef = query(ref(db, levelKeys[i]), orderByChild('time'));
    onValue(easyRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();

          leaderBoard[i].push({
            playerName: childData.playerName,
            score : childData.score,
            difficulty: childData.difficulty,
            time: childData.time
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


