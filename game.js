//Turn

const turn = (() => {
  let turn = 'X';
  const char = () => {
    return turn;
  }
  const toggle = () => {
    turn = (turn === 'X' ? 'O' : 'X');
    if (turn === 'O' && ai.active()) {
        console.log("AI Play");
       ai.play();
     }

  }
  return {
    char,
    toggle
  }
})();

//Moves / undo
const moves = (() => {
  let moveArray;

  const reset = () => {
    moveArray = []
  }
  const addMove = (x,y) => {
    moveArray.push({x,y})
  }
  const inner_undo = () => {
    console.log("inner undo start");

    if (move = moveArray.pop()) {
      gameBoard.mark(' ',move.x,move.y)
    }
    console.log("inner undo");
  }

  const undo = () => {
    inner_undo();
    if (ai.active()) {
      inner_undo();
    } else {
      turn.toggle();
    }
    gameBoard.displayGame();

  }
  const numMoves = () => {
    return moveArray.length;
  }
  return {
    addMove,
    undo,
    reset,
    numMoves

  }
})();



//GamePlay
function markCell(col, row) {
  if (gameBoard.mark(turn.char(),col,row)) {
    moves.addMove(col,row);
    turn.toggle();
    gameBoard.displayGame();
    return true;
  } else {
    return false;
  }
}
function choseCell(event) {
  if (gameBoard.gameOver()) {return}
  id = event.target.id;
  col = id.substring(4,5);
  row = id.substring(9,10);
  markCell(col,row);

}

//AI
const ai = (() => {

  let ai_active = false;

  const check_play = () => {
    if (ai_active && turn.char() === 'O') {
      play();
    }
  }
  const toggle = () => {
    ai_active = !(ai_active);
    check_play();
  }
  const set = () => {
    ai_active = document.getElementById('ai-opponent').checked
    check_play();
  }
  const active = () => {
    return ai_active;
  }
  const play = () => {
    do {
      col = Math.floor(Math.random() * 3);
      row = Math.floor(Math.random() * 3);
    } while( moves.numMoves() < 9 && !(markCell(col,row)));
  }

  return {
    set,
    toggle,
    active,
    play
  }
})();


//Gameboard
const winCheck = (() => {

  const checkWinningLines = (board,x,y) => {
    if ( (board[0][y] === board[1][y] && board[1][y] === board[2][y])
        || (board[x][0] === board[x][1] && board[x][1] === board[x][2])
        || (x === y && board[0][0] === board[1][1] && board[1][1] === board[2][2])
        || ((parseInt(x,10) + parseInt(y,10)) === 2 && board[0][2] === board[1][1] && board [2][0] === board[1][1])
      ) {
        return true
      } else {
        return false
      }
  }
  return {
    checkWinningLines
  }

})();


const gameBoard = (() => {
  let board
  let boardDisplay;
  let row_index;
  let hasWon;
  const noMoreMoves = () => {
    return board.flat().reduce(function(accumulator, cell){
      accumulator = accumulator && (cell !== ' ')
      return accumulator
    },true)
  }
  const gameOver = () => { return hasWon !== null  || noMoreMoves();}
  const resetGame = () => {
    board = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']];
    hasWon = null;
    moves.reset();
    ai.set();
    displayGame();

  }

  const mark = (char, x,y) => {

    if (board[x][y] === ' ') {
      board[x][y] =  char;
      if (winCheck.checkWinningLines(board,x,y)) { hasWon = board[x][y];}
      return true

    } else if(char === ' ') {
      board[x][y] =  char;
      return true

    }  else {
      return false
    }
  }
  const displayCell = (cell,col_index) => {
    boardDisplay += `<td id = "col_${col_index}row_${row_index}"
                    class="mark_${board[col_index][row_index]}"
                    onclick = "choseCell(event)">
                    ${board[col_index][row_index]}</td>`
  }
  const displayRow = (row,index) => {
    row_index = index;
    boardDisplay += '<tr>'
    row.forEach(displayCell)
    boardDisplay += '</tr>'
  }
  const displayGame = () => {
    boardDisplay = "<table>";
    board.forEach(displayRow);
    boardDisplay += "</table>";

    if (hasWon) {
      boardDisplay += `<button id = 'again-button' onclick="gameBoard.resetGame()">Play Again</button>`
      boardDisplay += `<p class ="player-turn"><span class ="turn-char" >${hasWon}</span>
                          has won! </p>`;
    }
    else if (noMoreMoves()) {
      boardDisplay += `<button id = 'again-button' onclick="gameBoard.resetGame()">Play Again</button>`
      boardDisplay += `<p class ="player-turn">It's a tie!</p>`;

    }
    else {
      let disabled ="";
      if (moves.numMoves() === 0) {disabled="disabled"};
      boardDisplay += '<div class="button-wrapper">'
      boardDisplay += `<button id = 'reset-button' onclick="gameBoard.resetGame()">Reset</button>`
      boardDisplay += `<button id = 'undo-button' onclick="moves.undo()" ${disabled}>Undo</button>`
      boardDisplay += '</div>'
      boardDisplay += `<p class ="player-turn"><span class ="turn-char" >${turn.char()}</span>'s
                    turn </p>`;

    }
    boardElement = document.getElementById('game-wrapper');
    boardElement.innerHTML =   boardDisplay;

  }
  const getBoard = () => {
    return JSON.parse(JSON.stringify(board));
  }
  return {

    displayGame,
    mark,
    gameOver,
    resetGame,
    noMoreMoves,
    getBoard
  }

})();
//Initiate Game
gameBoard.resetGame();
