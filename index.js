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

// fuck it, idgaf if this is global.
let gameObjGlobal = new game();


window.onload = initializeGame();


function initializeGame() {
  const levels = document.getElementsByClassName("levelTile");
  const container = document.querySelector("#container");
  
  let leaderBoard = getUpdatedLeaderboard();  // records
  let debug = false;
  let gameObj = new game(easy, debug, leaderBoard);
  // MENU Options!! 0~6
  menuSelectClickHandler(levels[0], gameObj);
  menuSelectClickHandler(levels[1], gameObj);
  menuSelectClickHandler(levels[2], gameObj);
  openPopup(  'ranking', gameObj, levels[3] );
  openPopup(  'shoutout!', gameObj,levels[4]);
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
  tests[0].style.visibility = "visible";
  tests[0].style.display = "block";
  tests[0].textContent = "YOU WON!";
  tests[0].style.color = "white";
  tests[0].style.backgroundColor = "#ff85dB";

  // Save all scores into a item file here
  appendItemChild(
    tests[0],
    `Your score is ${gameObj.getBoardScore()} with time of
    ${gameObj.getPlayerTime()} seconds. ${gameObj.getEncouragement()}`,
    "div",
    '', 'font-size: 15px'
  );
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
  console.log(gameObj);
  if (option === "ranking") {
    rankingPopup(windowPopup, gameObj);
    
  } else if (option === "victory")
  {
    victoryPopup(windowPopup, gameObj);
    
  }
  else if (option === "share")
  {
    // if (gameObj.)
    // I didn't know that javascript doesn't allow you to pass by ref....
    // fuck me lmfao
    gameObj = gameObjGlobal;
    appendItemChild(windowPopup, "Where to brag to?", "h1");
  
    sharePopup(windowPopup, gameObj);
  }
  else if (option === "credits") {
    textHeading.textContent = "Credits, credits, CREDITS!";
    windowPopup.appendChild(textHeading);
    creditPopup(windowPopup);

  }
  else if (option === "shoutout!")
  {
    appendItemChild(windowPopup, "Spread the Love  ", "h1");
    
    shoutoutPopup(windowPopup);
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

function shoutoutPopup(windowPopup){

    // all this to add the fuckin earth icon. 
    var heartIcon = document.createElement('img');
    heartIcon.classList.add('mainImages');
    heartIcon.setAttribute('src','images/g17870.png');
    heartIcon.setAttribute('alt','img');
    heartIcon.setAttribute('style','height:1em; padding: 0em');
    windowPopup.children[0].insertAdjacentElement('beforeend',heartIcon);


  appendItemChild(windowPopup,'Spread your love for this game to your buddies, everywhere! You will also be able to share your scores once you have completed a game by choosing one of the three difficulty options!', 'div', 'subtext');
  
  let text = [['twitter','fa fa-twitter', `https://twitter.com/intent/tweet?text=Check%20out%20this%20sweet%20game!%20https://tmdwnsyang.github.io/poppers/`],
  ['linkedin','fa fa-linkedin', 'https://www.linkedin.com/sharing/share-offsite/?url=https://tmdwnsyang.github.io/poppers/'],
          ['facebook','fa fa-facebook', 'https://facebook.com'],
          ['instagram','fa fa-instagram', 'https://instagram.com']
];

  appendItemChild(windowPopup,'' , 'div','social-container' );
  for (let i = 0; i < text.length ; i++)
  {
    appendItemChild(windowPopup.children[2],'', 'a', text[i][0]); // class name
    windowPopup.children[2].children[i].setAttribute('href', text[i][2]); // url
    appendItemChild(windowPopup.children[2].children[i],'', 'i',text[i][1]);
    windowPopup.children[2].children[i].insertAdjacentText('beforeend',text[i][0]); //text after the button

  }
}

// Called by results() page. Responsible for saving the user game information
// and saving to the cloud.
function victoryPopup(windowPopup, gameObj) {
  var hiddenTile = document.querySelector("#tile2");

 appendItemChild(windowPopup, "Let's make you famous!", "h1");
  appendItemChild(windowPopup, "Enter your name below.", "subText");

  appendNewLineChild(windowPopup);
  var playerName = appendItemChild(windowPopup, null, "input");
  appendNewLineChild(windowPopup);

  var submitButton = appendItemChild(windowPopup, "Submit!", "button");

  submitButton.addEventListener("click", () => {
    gameObj.setPlayerProperties(playerName.value, gameObj.getBoardScore());
    closePopup();
     // probably not the most elegant way, but this adds 3 buttons in the result.
  var str1 = ["Return", "Share", "Ranking"];
  for (let i = 0; i < 3; i++)
    appendItemChild(hiddenTile, str1[i], "button", "levelTile");

  hiddenTile.children[1].addEventListener("click", () => {
    window.location.reload();
  });
  hiddenTile.children[2].addEventListener("click", () => openPopup("share", gameObj));
  hiddenTile.children[3].addEventListener("click", () => openPopup("ranking",gameObj));
    writeUserData(gameObj);
  });
  return gameObj;
}

function sharePopup(windowPopup, gameObj)
{
  
  let deleteMe = document.getElementById("popup");
  let text = [['twitter','fa fa-twitter', `https://twitter.com/intent/tweet?text=I got%20${gameObjGlobal.getBoardScore()}%20with%20a%20time%20of%20${gameObjGlobal.getPlayerTime()}s!%20Beat%20me%20by%20visiting%20https://tmdwnsyang.github.io/poppers/`],
          ['linkedin','fa fa-linkedin', 'https://www.linkedin.com/sharing/share-offsite/?url=https://tmdwnsyang.github.io/poppers/'],
          ['facebook','fa fa-facebook', 'https://facebook.com'],
          ['instagram','fa fa-instagram', 'https://instagram.com']
];
  appendItemChild(windowPopup, `Share your score of ${gameObj.getBoardScore()} and ${gameObj.getPlayerTime()}s with your friends!`, "div",'subtext');
  appendItemChild(windowPopup,'' , 'div','social-container' );
  let childIndex = 2;
  for (let i = 0; i < text.length ; i++)
  {
    appendItemChild(windowPopup.children[childIndex],'', 'a', text[i][0]);
    deleteMe.children[childIndex].children[i].setAttribute('href',text[i][2]);
    appendItemChild(windowPopup.children[childIndex].children[i],'', 'i',text[i][1]);
    windowPopup.children[childIndex].children[i].insertAdjacentText('beforeend',text[i][0]);

  }

}

// CREDIT POPUP
function creditPopup(windowPopup)
{
  appendItemChild(windowPopup,`Poppers! Beta v. 0.6`, 'div');
  appendItemChild(windowPopup,`Database powered by Firebase™ 🔥`);
  appendItemChild(windowPopup,`github.com/tmdwnsyang/`);

  appendNewLineChild(windowPopup);

  appendItemChild(windowPopup,`Special thanks to Mozilla's MDN Web Docs for getting me started. Program by me. All rights reserved.`, 'div', 'subtextSmall');  
  
  
  appendNewLineChild(windowPopup);
  
}


// 0 easy 1 hard 2 extreme
function rankingPopup(windowPopup, gameObj) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  appendItemChild(windowPopup, "World Ranking  ", "h1");
 
  var earthIcon = document.createElement('img');
  earthIcon.classList.add('mainImages');
  earthIcon.setAttribute('src','images/g9030.png');
  earthIcon.setAttribute('alt','img');
  earthIcon.setAttribute('style','height:1em; padding: 0em');

  windowPopup.children[0].insertAdjacentElement('beforeend',earthIcon);
  
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
  appendItemChild(windowPopup, `*Top 15 players ordered by descending time. Lower the score, the better! If you're not seeing your score, refresh your page.`, "subtextSmall",'div', 'font-size: 0.6em');
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
  gameObjGlobal = playerObj;
  
}

// Returns a container with 3 different difficulty levels and all users
// in a form of array, sorted.
function getUpdatedLeaderboard(){
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


