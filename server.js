const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

require('./score.json');
// require('./index.js');

var fs = require('fs'); 
var scoreBoardsRaw = fs.readFileSync('./score.json');
var scoreBoards = JSON.parse(scoreBoardsRaw);

let newPlayerInfo = { 
  "playerName" : 'TOMMY', 
  "score" : 99, 
  "difficulty" : 'HARD AF'
};

scoreBoards.push(newPlayerInfo);

// reverting to JSON file
let dataStr = JSON.stringify(scoreBoards);
fs.writeFile('score.json', dataStr, finished);
console.log(scoreBoards);

  function finished(err){
    console.log( 'finished' );
  }

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});