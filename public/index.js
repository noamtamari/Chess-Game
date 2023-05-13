
var clickCount = 0;
var clickButtonArray = new Array(2);
var possibleMovesArray = [];
var possibleEatMoveArray = [];
var whiteEatenPieces = [];
var blackEatenPieces = [];
var defenceSquare = [];
var checkDefenceSquares = [];
var checkRout = [];
var checkRoutButtons = [];
var turnColor = "white";
var turnCounter = 0;
var timerOption = false;
var undoOption = false;
var time;
var whiteTimer;
var blackTimer;
var undoButton;
var restartButton;
var pauseButton;
var saveButton;
var isRestartBlack = true;
var isRestartWhite = true;
var isPaused = false;
var movesArray = [];
var pieceMoved;
var checkOnColor;
var checkDirection;
var enPassantDirection;

var eatenBlackDiv = document.getElementsByName("eaten-black")[0];
var eatenWhiteDiv = document.getElementsByName("eaten-white")[0];
var letterIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
var VarPieceClicked;
var iClickedLocation;
var jClickedLocation;
var iFirstLocation;
var jFirstLocation;
var isChecked = false;
var checkPiece;

var updateBoard = new Array(8);

console.log(document.getElementById("savedBoard").innerHTML);

if (document.getElementById("savedBoard").innerHTML.includes("undefined")) {
  createBoard();
  board();
} else {
  var savedBoard = JSON.parse(document.getElementById("savedBoard").innerHTML);
  console.log(savedBoard.turn);
  createBoard();

  updateBoard = savedBoard.board;
  movesArray = savedBoard.moves;
  newBoard();
  movesArray.forEach(move => {
    var Blackbutton = document.createElement("BUTTON");
    Blackbutton.name = move[0].name;
    Blackbutton.innerHTML = move[0].innerHTML;
    Blackbutton.className = move[0].className;
    var text = document.createTextNode("");
    Blackbutton.appendChild(text);
    move[0] = document.getElementsByName(Blackbutton.name)[0];

    var whiteButton = document.createElement("BUTTON");
    whiteButton.name = move[1].name;
    whiteButton.innerHTML = move[1].innerHTML;
    whiteButton.className = move[1].className;
    var text = document.createTextNode("");
    whiteButton.appendChild(text);
    move[1] = document.getElementsByName(whiteButton.name)[0];


    // document.getElementsByName(whiteButton.name) = whiteButton;
    // document.getElementsByName(whiteButton.name).classList("can-eat");
  });

  turnCounter = savedBoard.turnCounter;
  clickButtonArray = [];
  document.addEventListener('DOMContentLoaded', function() {
    //  function to be called after the page has loaded
    afterMoveAnalyze(movesArray[movesArray.length-1][4]);
  });
 

}

if (savedBoard.turn === "black") {
  switchTurn("white");
} else {
  switchTurn("black");
}




//CREATING A 2 DIMENSION 8X8 CHESS BOARD
function createBoard() {
  for (var i = 0; i < updateBoard.length; i++) {
    updateBoard[i] = new Array(8);
  }
}

//PUTTING THE TIME DIVS IN A SPECIFIC LOCATION
function placeTimerDiv(button) {
  // var rect = button.getBoundingClientRect();
  // var x_pos = rect.left + "px";
  // var y_pos = rect.top - 75 + "px";
  // var blackClock = document.getElementById("black-time");
  // blackClock.style.position = "absolute";
  // blackClock.style.left = x_pos;
  // blackClock.style.top = y_pos;
  // console.log(blackClock.style.left);
  // var downpiece = document.getElementsByName("00")[0];
  // var rect2 = downpiece.getBoundingClientRect();
  // var whiteClock = document.getElementById("white-time");
  // whiteClock.style.position = "absolute";
  // whiteClock.style.left = x_pos;
  // whiteClock.style.top = rect2.bottom + 10 + "px";
}

//CHESS PIECE OBJECT
function ChessPiece(type, color, iLocation, jLocation) {
  this.type = type;
  this.color = color;
  this.iLocation = iLocation;
  this.jLocation = jLocation;
  this.move = 0;
  this.firstTurnNumber;
  this.isPinned = false;
  this.pinDirection = "";
  this.enPassant = false;
  var enPassantTurn = 0;
  this.pieceImageSrc = "images/" + color + "-" + type + ".png";
}

function Turn(startSquare, finalSquare, moveType) {
  this.startSquere = startSquare;
  this.finalSquare = finalSquare;
  this.moveType = moveType;
}

// var start1vs1Button = document
//   .getElementsByName("start1vs1")[0]
//   .addEventListener("mousedown", board);

//INITIALIZING THE BOARD WITH BUTTON CONTAINING PIECES IMAGE, PIECES OBJECTS
function board() {
  makeSound("board");
  var myDiv = document.getElementById("board");

  for (i = 8; i >= 1; i--) {
    for (j = 0; j < 8; j++) {
      // creating button element
      var button = document.createElement("BUTTON");
      button.name = i - 1 + "" + j;

      // creating text to be
      //displayed on button
      // var text = document.createTextNode(i + "" + letterIndex[j]);
      var text = document.createTextNode("");

      // appending text to button
      //images for chess pieces - https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
      if (i === 7) {
        button.innerHTML =
          '<img class="toolsImages" src="/images/black-pawn.png" style="width: 100%; height:  100%;"/>';
        var ChessPiece1 = new ChessPiece("pawn", "black", i - 1, j);
        updateBoard[i - 1][j] = ChessPiece1;
      } else if (i === 2) {
        button.innerHTML =
          '<img class="toolsImages" src="/images/white-pawn.png" style="width: 100%; height:  100%;"/>';
        var ChessPiece1 = new ChessPiece("pawn", "white", i - 1, j);
        updateBoard[i - 1][j] = ChessPiece1;
      } else if ((i === 8 || i === 1) && (j === 0 || j === 7)) {
        if (i === 8) {
          button.innerHTML =
            '<img class="toolsImages" src="/images/black-rook.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("rook", "black", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        } else {
          button.innerHTML =
            '<img class="toolsImages" src="/images/white-rook.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("rook", "white", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        }
      } else if ((i === 8 || i === 1) && (j === 1 || j === 6)) {
        if (i === 8) {
          button.innerHTML =
            '<img class="toolsImages" src="/images/black-horse.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("horse", "black", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        } else {
          button.innerHTML =
            '<img class="toolsImages" src="/images/white-horse.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("horse", "white", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        }
      } else if ((i === 8 || i === 1) && (j === 2 || j === 5)) {
        if (i === 8) {
          button.innerHTML =
            '<img class="toolsImages" src="/images/black-bishop.png" style="width: 100%; height:  100%;" />';
          var ChessPiece1 = new ChessPiece("bishop", "black", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        } else {
          button.innerHTML =
            '<img class="toolsImages" src="/images/white-bishop.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("bishop", "white", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        }
      } else if ((i === 8 || i === 1) && j === 3) {
        if (i === 8) {
          button.innerHTML =
            '<img class="toolsImages" src="/images/black-queen.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("queen", "black", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        } else {
          button.innerHTML =
            '<img class="toolsImages" src="/images/white-queen.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("queen", "white", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        }
      } else if ((i === 8 || i === 1) && j === 4) {
        if (i === 8) {
          button.innerHTML =
            '<img class="toolsImages" src="/images/black-king.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("king", "black", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        } else {
          button.innerHTML =
            '<img class="toolsImages" src="/images/white-king.png" style="width: 100%; height:  100%;"/>';
          var ChessPiece1 = new ChessPiece("king", "white", i - 1, j);
          updateBoard[i - 1][j] = ChessPiece1;
        }
      } else {
        updateBoard[i - 1][j] = "Free Squere";
      }
      if ((i + j) % 2 !== 0) {
        button.classList.add("black");
      } else {
        button.classList.add("white");
      }

      button.appendChild(text);

      // appending button to div
      myDiv.appendChild(button);
      button.classList.add("chessSqure");
      button.addEventListener("mousedown", pieceClicked);
    }
  }
  // var bodyElement = document.getElementById("board");
  // var start1vs1Button = document.getElementsByName("start1vs1")[0];
  // bodyElement.removeChild(start1vs1Button);

  // placeTimerDiv(document.getElementsByName("70")[0]);

  //IF THERE IS A LIMITED TIME THE FUNCTION OF TIMER WILL BE DEPLOY
  if (document.getElementById("black-time") !== null) {
    Timer("black", null);
    Timer("white", null);
    timerOption = true;
  }
  undoButton = document.getElementsByClassName("undo-button")[0];
  if (undoButton !== undefined) {
    undoButton.addEventListener("mousedown", undoMove);
    undoButton.disabled = true;
    undoOption = true;
  }

  restartButton = document.getElementsByClassName("restart-button")[0];
  if (restartButton !== undefined) {
    restartButton.addEventListener("mousedown", restartGame);
    restartButton.disabled = true;
  }

  pauseButton = document.getElementsByClassName("pause-button")[0];
  if (pauseButton !== undefined) {
    pauseButton.addEventListener("mousedown", pauseGame);
  }

  saveButton = document.getElementsByClassName("save-button")[0];
  if (saveButton !== undefined) {
    saveButton.addEventListener("mousedown", saveGame);
    saveButton.disabled = true;
  }


}

function newBoard() {

  makeSound("board");
  var myDiv = document.getElementById("board");

  for (i = 8; i >= 1; i--) {
    for (j = 0; j < 8; j++) {
      // creating button element
      var button = document.createElement("BUTTON");
      button.name = i - 1 + "" + j;

      // creating text to be
      //displayed on button
      // var text = document.createTextNode(i + "" + letterIndex[j]);
      var text = document.createTextNode("");
      if (updateBoard[i - 1][j] !== "Free Squere") {
        button.innerHTML = '<img class="toolsImages"' + 'src="/' + updateBoard[i - 1][j].pieceImageSrc + '" style="width: 100%; height:  100%;"/> ';
      }

      // appending text to button
      //images for chess pieces - https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

      if ((i + j) % 2 !== 0) {
        button.classList.add("black");
      } else {
        button.classList.add("white");
      }

      button.appendChild(text);

      // appending button to div
      myDiv.appendChild(button);
      button.classList.add("chessSqure");
      button.addEventListener("mousedown", pieceClicked);
    }
  }
  // var bodyElement = document.getElementById("board");
  // var start1vs1Button = document.getElementsByName("start1vs1")[0];
  // bodyElement.removeChild(start1vs1Button);

  // placeTimerDiv(document.getElementsByName("70")[0]);

  //IF THERE IS A LIMITED TIME THE FUNCTION OF TIMER WILL BE DEPLOY
  if (document.getElementById("black-time") !== null) {
    Timer("black", null);
    Timer("white", null);
    timerOption = true;
  }
  undoButton = document.getElementsByClassName("undo-button")[0];
  if (undoButton !== undefined) {
    undoButton.addEventListener("mousedown", undoMove);
    undoOption = true;
  }

  restartButton = document.getElementsByClassName("restart-button")[0];
  if (restartButton !== undefined) {
    restartButton.addEventListener("mousedown", restartGame);
  }

  pauseButton = document.getElementsByClassName("pause-button")[0];
  if (pauseButton !== undefined) {
    pauseButton.addEventListener("mousedown", pauseGame);
  }

  saveButton = document.getElementsByClassName("save-button")[0];
  if (saveButton !== undefined) {
    saveButton.addEventListener("mousedown", saveGame);
    saveButton.disabled = true;
  }


}

function undoMove() {
  if (movesArray[turnCounter - 1][4].firstTurnNumber === turnCounter) {
    movesArray[turnCounter - 1][4].move = 0;
  }
  turnCounter--;
  if (turnCounter === 0) {
    undoButton.disabled = true;
    saveButton.disabled = true;
    restartButton.disabled = true;
  }

  let firstButton = movesArray[turnCounter][0];
  let secondButton = movesArray[turnCounter][1];
  let iPieceFinal = Number(secondButton.name[0]);
  let jPieceFinal = Number(secondButton.name[1]);

  let iPieceOriginal = Number(firstButton.name[0]);
  let jPieceOriginal = Number(firstButton.name[1]);
  // alert(
  //   "piece was in i = " +
  //   iPieceOriginal +
  //   "and j = " +
  //   jPieceOriginal +
  //   "final i = " +
  //   iPieceFinal +
  //   " j final = " +
  //   jPieceFinal + "piece type is " + movesArray[turnCounter][4].type + " secondButton.innerHTML "+ secondButton.innerHTML
  // );
  let eatenButtonSRC = firstButton.innerHTML;

  firstButton.innerHTML = secondButton.innerHTML;
  secondButton.innerHTML = "";
  updateBoard[iPieceOriginal][jPieceOriginal] = movesArray[turnCounter][4];
  movesArray[turnCounter][4].iLocation = iPieceOriginal;
  movesArray[turnCounter][4].jLocation = jPieceOriginal;
  if (movesArray[turnCounter][5] === null) {
    updateBoard[iPieceFinal][jPieceFinal] = "Free Squere";
  } else {
    updateBoard[iPieceFinal][jPieceFinal] = movesArray[turnCounter][5];
    secondButton.innerHTML =
      '<img class="toolsImages" src=' +
      updateBoard[iPieceFinal][jPieceFinal].pieceImageSrc +
      ' style="width: 100%; height:  100%;"/>';
    document.getElementById("" + turnCounter).remove();
  }

  if (movesArray[turnCounter].includes("pawn upgrade")) {
    updateBoard[iPieceOriginal][jPieceOriginal].type = "pawn";
    if (updateBoard[iPieceOriginal][jPieceOriginal].color === "black") {
      firstButton.innerHTML = '<img class="toolsImages" src="/images/black-pawn.png" style="width: 100%; height:  100%;"/>';
      ;
    } else {
      firstButton.innerHTML = '<img class="toolsImages" src="/images/white-pawn.png" style="width: 100%; height:  100%;"/>';
      ;
    }
  }
  var castle = movesArray[turnCounter][7];
  switch (castle) {
    case "white queen side":
      updateBoard[0][0] = updateBoard[0][3];
      updateBoard[0][0].iLocation = 0;
      updateBoard[0][0].jLocation = 0;
      updateBoard[0][3] = "Free Squere";
      document.getElementsByName(0 + "" + 0)[0].innerHTML = document.getElementsByName(0 + "" + 3)[0].innerHTML;
      document.getElementsByName(0 + "" + 3)[0].innerHTML = "";
      break;
    case "white king side":
      updateBoard[0][7] = updateBoard[0][5];
      updateBoard[0][7].iLocation = 0;
      updateBoard[0][7].jLocation = 7;
      updateBoard[0][5] = "Free Squere";
      document.getElementsByName(0 + "" + 7)[0].innerHTML = document.getElementsByName(0 + "" + 5)[0].innerHTML;
      document.getElementsByName(0 + "" + 5)[0].innerHTML = "";
      break;
    case "black queen side":
      updateBoard[7][0] = updateBoard[7][3];
      updateBoard[7][0].iLocation = 7;
      updateBoard[7][0].jLocation = 0;
      updateBoard[7][3] = "Free Squere";
      document.getElementsByName(7 + "" + 0)[0].innerHTML = document.getElementsByName(7 + "" + 3)[0].innerHTML;
      document.getElementsByName(7 + "" + 3)[0].innerHTML = "";
      break;
    case "black king side":
      updateBoard[7][7] = updateBoard[7][5];
      updateBoard[7][7].iLocation = 7;
      updateBoard[7][7].jLocation = 7;
      updateBoard[7][5] = "Free Squere";
      document.getElementsByName(7 + "" + 7)[0].innerHTML = document.getElementsByName(7 + "" + 5)[0].innerHTML;
      document.getElementsByName(7 + "" + 5)[0].innerHTML = "";
      break;
    default:
      break;
  }

  if (turnCounter - 1 !== -1) {
    checkPieceMove(movesArray[turnCounter - 1][4]);
    afterMoveAnalyze(movesArray[turnCounter - 1][4]);
  }
  switchTurn(turnColor);
  clickCount = 0;
  turnReset();
  movesArray.pop();
}
function restartGame() {
  if (confirm("Are You Sure You Want To Restart The Game ? ") == true) {
    while (movesArray.length !== 0) {
      undoMove();
    }
    restartButton.disabled = true;
    isRestartBlack = true;
    isRestartWhite = true;
  }

}

function pauseGame() {
  let pause = document.getElementsByClassName("pause-button")[0];
  console.log(document.getElementsByClassName("pause-button")[0].innerHTML)
  if (pause.innerHTML === "Pause") {
    pause.innerHTML = "Play";
    isPaused = true;
    disabledBoard();
  } else {
    isPaused = false;
    pause.innerHTML = "Pause";
    disabledBoard();
    ableBoard();
  }


}

function saveGame() {
  savedMovesArray = movesArray;
  for (i = 0; i < movesArray.length; i++) {
    var blackButton = {
      name: movesArray[i][0].name,
      innerHTML: movesArray[i][0].innerHTML,
      className: movesArray[i][0].className
    }
    var whiteButton = {
      name: movesArray[i][1].name,
      innerHTML: movesArray[i][1].innerHTML,
      className: movesArray[i][1].className
    }
    savedMovesArray[i][0] = blackButton;
    savedMovesArray[i][1] = whiteButton;
  }




  const game = {
    board: updateBoard,
    turn: turnColor,
    turnCounter: turnCounter,
    moves: savedMovesArray,
    timerOption: timerOption,
    undoOption: undoOption,
    blackTime: blackTimer,
    whiteTime: whiteTimer,
  }
  const data = { game };
  console.log(game);

  fetch('/1vs1/submit-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      // handle response from server
      console.log(response);
      if (response.status === 200) {
        let loader = document.getElementsByClassName("loader")[0];
        console.log("Game have been saved");
        loader.hidden = false;
        setTimeout(() => {
          loader.className = "loader-finished";
          document.getElementById("save").disabled = true;
        }, "2500");
        loader.hidden = false;
      } else {
        loader.hidden = false;
      }
    });
}

function pieceClicked() {
  clickButtonArray[clickCount] = this;
  clickCount++;
  iClickedLocation = Number(this.name[0]);
  jClickedLocation = Number(this.name[1]);

  console.log("Click Count= " + clickCount);
  console.log("Button location=" + this.name);
  console.log("Button i location= " + iClickedLocation);
  console.log("Button j location= " + jClickedLocation);

  if (clickCount === 1) {
    iFirstLocation = Number(this.name[0]);
    jFirstLocation = Number(this.name[0]);
  }

  if (!checkFreeSqure(iClickedLocation, jClickedLocation) && clickCount !== 2) {
    pieceSelectDived(this, iClickedLocation, jClickedLocation);
    // console.log("there is defend on = " + defenceSquare.length);
    // for (var i = 0; i < defenceSquare.length; i++) {
    //     console.log("DEFENCE=" + defenceSquare[i]);
    //     // defenceSquare[i].classList.add("can-move");
    // }
  } else if (clickCount === 1) {
    //RESET COUNT IF PLAYER CLICK ON EMPTY SQUERE
    clickCount = 0;
  }
  if (clickCount === 2 && checkLegalMove(this)) {
    if (possibleEatMoveArray.includes(clickButtonArray[1])) {
      // alert("yummy you just eat opponent " + updateBoard[iClickedLocation][jClickedLocation].type + " with a " + VarPieceClicked.type);
      if (clickButtonArray[1].innerHTML === "") {
        enPassantMove(enPassantDirection, iClickedLocation, jClickedLocation);
      } else {
        addEatenPiece(
          updateBoard[iClickedLocation][jClickedLocation].color,
          clickButtonArray[1].innerHTML
        );
      }
      this.classList.remove("clicked");
      movePiece(
        this,
        VarPieceClicked,
        iClickedLocation,
        jClickedLocation,
        "eat"
      );
    } else {
      movePiece(
        this,
        VarPieceClicked,
        iClickedLocation,
        jClickedLocation,
        "move"
      );
    }
  }
}

function pieceSelectDived(button, i, j) {
  button.classList.toggle("clicked"); //STYLE A PIECE BIENG PRESSED
  VarPieceClicked = updateBoard[i][j];
  console.log(
    "piece clicked:" +
    VarPieceClicked.type +
    "I Location= " +
    i +
    " J Location= " +
    j
  );
  if (VarPieceClicked.color === turnColor) {
    checkPieceMove(VarPieceClicked);
  } else {
    turnReset();
  }
}

//Returning if The squre is free
function checkFreeSqure(i, j) {
  if (updateBoard[i][j] === "Free Squere") {
    return true;
  } else {
    return false;
  }
}

function checkLegalMove(button) {
  var canMove = button.classList;
  if (clickButtonArray[0].name === clickButtonArray[1].name) {
    //CHECK IF PLAYER PRESSED ON THE SAME PIECE WITHOUT MOVING
    clickCount = 0;
    // alert("ilegal move - you pressed on the same piece");
    turnReset();
    return false;
  } else if (!possibleMovesArray.includes(clickButtonArray[1])) {
    // alert("ilegal move - you cant move piece to this squere");
    turnReset();
    return false;
    //IF THE PIECE IS PINNED THE VALUE WILL BE -1
  } else if (button.classList.value.indexOf("can-move") === -1) {
    //
    turnReset();
    return false;
  } else {
    return true;
  }
}
function checkPieceMove(p) {
  var i = p.iLocation;
  var j = p.jLocation;
  if (p.type === "pawn") {
    checkPawnMove(p, j, i);
  } else if (p.type === "rook") {
    checkRookMove(p, j, i);
  } else if (p.type === "horse") {
    checkHorseMove(p, j, i);
  } else if (p.type === "bishop") {
    checkBishopMove(p, j, i);
  } else if (p.type === "queen") {
    checkBishopMove(p, j, i);
    checkRookMove(p, j, i);
  } else {
    checkKingMove(p, j, i);
  }
}
function getPossibleMovesWhite() {
  var whitePiecesPossibleMoves = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j] !== "Free Squere" &&
        updateBoard[i][j].color === "white" &&
        updateBoard[i][j].type !== "king" &&
        updateBoard[i][j].type !== "pawn"
      ) {
        checkPieceMove(updateBoard[i][j]);
      } else if (
        updateBoard[i][j].type === "pawn" &&
        updateBoard[i][j].color === "white"
      ) {
        checkPawnEatMove(
          updateBoard[i][j],
          updateBoard[i][j].jLocation,
          updateBoard[i][j].iLocation,
          []
        );
      }
    }
  }
  whitePiecesPossibleMoves = possibleMovesArray;

  resetPossibleMove();
  return whitePiecesPossibleMoves;
}
function getAllPossibleMovesWhite() {
  var counter = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j] !== "Free Squere" &&
        updateBoard[i][j].color === "white" &&
        updateBoard[i][j].type !== "king"
      ) {
        checkPieceMove(updateBoard[i][j]);
        counter = counter + possibleMovesArray.length;
      }
    }
  }
  resetPossibleMove();
  return counter;
}
function getAllPossibleMovesBlack() {
  var counter = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j] !== "Free Squere" &&
        updateBoard[i][j].color === "black" &&
        updateBoard[i][j].type !== "king"
      ) {
        checkPieceMove(updateBoard[i][j]);
        counter = counter + possibleMovesArray.length;
      }
    }
  }
  blackPiecesPossibleMoves = possibleMovesArray;
  resetPossibleMove();
  return counter;
}
function getPossibleMovesBlack() {
  var blackPiecesPossibleMoves = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j] !== "Free Squere" &&
        updateBoard[i][j].color === "black" &&
        updateBoard[i][j].type !== "king" &&
        updateBoard[i][j].type !== "pawn"
      ) {
        checkPieceMove(updateBoard[i][j]);
      } else if (
        updateBoard[i][j].type === "pawn" &&
        updateBoard[i][j].color === "black"
      ) {
        checkPawnEatMove(
          updateBoard[i][j],
          updateBoard[i][j].jLocation,
          updateBoard[i][j].iLocation,
          []
        );
      }
    }
  }
  blackPiecesPossibleMoves = possibleMovesArray;
  resetPossibleMove();
  return blackPiecesPossibleMoves;
}

function checkBishopMove(p, j, i) {
  var leftPin = false;
  var rightPin = false;
  var upPin = false;
  var downPin = false;
  var downLeftPin = false;
  var downRightPin = false;
  var upRightPin = false;
  var upLeftPin = false;
  var pinByRookDirection = checkPinByRook(p, j, i);
  var pinByBishopDirection = checkPinByBishop(p, j, i);

  if (pinByRookDirection[0] === "pin-left") {
    leftPin = true;
  }
  if (pinByRookDirection[1] === "pin-right") {
    rightPin = true;
  }
  if (pinByRookDirection[2] === "pin-up") {
    upPin = true;
  }
  if (pinByRookDirection[3] === "pin-down") {
    downPin = true;
  }

  if (pinByBishopDirection[0] === "pin-left-down") {
    downLeftPin = true;
  }
  if (pinByBishopDirection[1] === "pin-right-down") {
    downRightPin = true;
  }
  if (pinByBishopDirection[2] === "pin-left-up") {
    upLeftPin = true;
  }
  if (pinByBishopDirection[3] === "pin-right-up") {
    upRightPin = true;
  }

  var dRight = i + 1;
  var fRight = j + 1;
  for (dRight; dRight <= 7 && fRight <= 7; dRight++) {
    if (updateBoard[dRight][fRight] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downRightPin &&
        !upLeftPin
      ) {
        document
          .getElementsByName(dRight + "" + fRight)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dRight + "" + fRight)[0]
        );
      }
      defenceSquare.push(document.getElementsByName(dRight + "" + fRight)[0]);
      fRight++;
    } else if (updateBoard[dRight][fRight].color != p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downRightPin &&
        !upLeftPin
      ) {
        document
          .getElementsByName(dRight + "" + fRight)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dRight + "" + fRight)[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(dRight + "" + fRight)[0]
        );
      }
      defenceSquare.push(document.getElementsByName(dRight + "" + fRight)[0]);

      if (updateBoard[dRight][fRight].type === "king") {
        if (fRight !== 7 && dRight !== 7) {
          possibleMovesArray.push(
            document.getElementsByName(dRight + 1 + "" + (fRight + 1))[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "downLeft");
      }
      dRight = 7;
    } else {
      defenceSquare.push(document.getElementsByName(dRight + "" + fRight)[0]);
      dRight = 7;
    }
  }
  var dLeftUp = i + 1;
  var fLeftUp = j - 1;
  for (dLeftUp; dLeftUp <= 7 && fLeftUp >= 0; dLeftUp++) {
    if (updateBoard[dLeftUp][fLeftUp] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(dLeftUp + "" + fLeftUp)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dLeftUp + "" + fLeftUp)[0]
        );
      }
      defenceSquare.push(document.getElementsByName(dLeftUp + "" + fLeftUp)[0]);
      fLeftUp--;
    } else if (updateBoard[dLeftUp][fLeftUp].color != p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(dLeftUp + "" + fLeftUp)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dLeftUp + "" + fLeftUp)[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(dLeftUp + "" + fLeftUp)[0]
        );
      }
      defenceSquare.push(document.getElementsByName(dLeftUp + "" + fLeftUp)[0]);

      if (updateBoard[dLeftUp][fLeftUp].type === "king") {
        if (dLeftUp !== 7 && fLeftUp !== 0) {
          possibleMovesArray.push(
            document.getElementsByName(dLeftUp + 1 + "" + (fLeftUp - 1))[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "downRight");
      }
      dLeftUp = 7;
    } else {
      defenceSquare.push(document.getElementsByName(dLeftUp + "" + fLeftUp)[0]);
      dLeftUp = 7;
    }
  }

  var dLeftDown = i - 1;
  var fLeftDown = j - 1;
  for (dLeftDown; dLeftDown >= 0 && fLeftDown >= 0; dLeftDown--) {
    if (updateBoard[dLeftDown][fLeftDown] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downRightPin &&
        !upLeftPin
      ) {
        document
          .getElementsByName(dLeftDown + "" + fLeftDown)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dLeftDown + "" + fLeftDown)[0]
        );
      }
      defenceSquare.push(
        document.getElementsByName(dLeftDown + "" + fLeftDown)[0]
      );
      fLeftDown--;
    } else if (updateBoard[dLeftDown][fLeftDown].color != p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downRightPin &&
        !upLeftPin
      ) {
        document
          .getElementsByName(dLeftDown + "" + fLeftDown)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dLeftDown + "" + fLeftDown)[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(dLeftDown + "" + fLeftDown)[0]
        );
      }
      defenceSquare.push(
        document.getElementsByName(dLeftDown + "" + fLeftDown)[0]
      );

      if (updateBoard[dLeftDown][fLeftDown].type === "king") {
        if (dLeftDown !== 0 && fLeftDown !== 0) {
          possibleMovesArray.push(
            document.getElementsByName(dLeftDown - 1 + "" + (fLeftDown - 1))[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "upRight");
      }
      dLeftDown = 0;
    } else {
      defenceSquare.push(
        document.getElementsByName(dLeftDown + "" + fLeftDown)[0]
      );
      dLeftDown = 0;
    }
  }

  var dRightDown = i - 1;
  var fRightDown = j + 1;
  for (dRightDown; dRightDown >= 0 && fRightDown <= 7; dRightDown--) {
    if (updateBoard[dRightDown][fRightDown] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(dRightDown + "" + fRightDown)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dRightDown + "" + fRightDown)[0]
        );
      }
      defenceSquare.push(
        document.getElementsByName(dRightDown + "" + fRightDown)[0]
      );
      fRightDown++;
    } else if (updateBoard[dRightDown][fRightDown].color != p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(dRightDown + "" + fRightDown)[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(dRightDown + "" + fRightDown)[0]
        );
      }
      defenceSquare.push(
        document.getElementsByName(dRightDown + "" + fRightDown)[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(dRightDown + "" + fRightDown)[0]
      );
      if (updateBoard[dRightDown][fRightDown].type === "king") {
        if (dRightDown !== 0 && fRightDown !== 7) {
          possibleMovesArray.push(
            document.getElementsByName(
              dRightDown - 1 + "" + (fRightDown + 1)
            )[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "upLeft");
      }
      dRightDown = 0;
    } else {
      defenceSquare.push(
        document.getElementsByName(dRightDown + "" + fRightDown)[0]
      );
      dRightDown = 0;
    }
  }
  if (isChecked === true && checkOnColor === p.color) {
    var temp = [];
    console.log("CHECK ROUTH BUTTON = " + checkRoutButtons.length);
    for (var ind = 0; ind < possibleMovesArray.length; ind++) {
      for (var jnd = 0; jnd < checkRoutButtons.length; jnd++) {
        if (possibleMovesArray[ind] === checkRoutButtons[jnd]) {
          temp.push(possibleMovesArray[ind]);
        } else {
          possibleMovesArray[ind].classList.remove("can-move");
        }
      }
    }
    possibleMovesArray = temp;
    for (var ind = 0; ind < possibleMovesArray.length; ind++) {
      possibleMovesArray[ind].classList.add("can-move");
    }
    console.log(
      "Possible Moves for " +
      p.type +
      "in i location " +
      i +
      " in j location " +
      j +
      " = " +
      possibleMovesArray.length
    );
  }
}

function checkHorseMove(p, j, i) {
  var leftPin = false;
  var rightPin = false;
  var upPin = false;
  var downPin = false;
  var downLeftPin = false;
  var downRightPin = false;
  var upRightPin = false;
  var upLeftPin = false;
  var pinByRookDirection = checkPinByRook(p, j, i);
  var pinByBishopDirection = checkPinByBishop(p, j, i);

  if (pinByRookDirection[0] === "pin-left") {
    leftPin = true;
  }
  if (pinByRookDirection[1] === "pin-right") {
    rightPin = true;
  }
  if (pinByRookDirection[2] === "pin-up") {
    upPin = true;
  }
  if (pinByRookDirection[3] === "pin-down") {
    downPin = true;
  }

  if (pinByBishopDirection[0] === "pin-left-down") {
    downLeftPin = true;
  }
  if (pinByBishopDirection[1] === "pin-right-down") {
    downRightPin = true;
  }
  if (pinByBishopDirection[2] === "pin-left-up") {
    upLeftPin = true;
  }
  if (pinByBishopDirection[3] === "pin-right-up") {
    upRightPin = true;
  }

  if (i + 2 <= 7 && j + 1 <= 7) {
    if (updateBoard[i + 2][j + 1] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 2 + "" + (j + 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 2 + "" + (j + 1))[0]
        );
      }

      defenceSquare.push(document.getElementsByName(i + 2 + "" + (j + 1))[0]);
    } else if (updateBoard[i + 2][j + 1].color !== p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 2 + "" + (j + 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 2 + "" + (j + 1))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i + 2 + "" + (j + 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 2 + "" + (j + 1))[0]);

      if (updateBoard[i + 2][j + 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i + 2 + "" + (j + 1))[0]);
    }
  }

  if (i + 2 <= 7 && j - 1 >= 0) {
    if (updateBoard[i + 2][j - 1] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 2 + "" + (j - 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 2 + "" + (j - 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 2 + "" + (j - 1))[0]);
    } else if (updateBoard[i + 2][j - 1].color !== p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 2 + "" + (j - 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 2 + "" + (j - 1))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i + 2 + "" + (j - 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 2 + "" + (j - 1))[0]);

      if (updateBoard[i + 2][j - 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i + 2 + "" + (j - 1))[0]);
    }
  }

  if (i - 1 >= 0 && j - 2 >= 0) {
    if (updateBoard[i - 1][j - 2] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 1 + "" + (j - 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 1 + "" + (j - 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j - 2))[0]);
    } else if (updateBoard[i - 1][j - 2].color !== p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 1 + "" + (j - 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 1 + "" + (j - 2))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i - 1 + "" + (j - 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j - 2))[0]);

      if (updateBoard[i - 1][j - 2].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j - 2))[0]);
    }
  }

  if (i + 1 <= 7 && j + 2 <= 7) {
    if (updateBoard[i + 1][j + 2] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 1 + "" + (j + 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 1 + "" + (j + 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j + 2))[0]);
    } else if (updateBoard[i + 1][j + 2].color !== p.color) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 1 + "" + (j + 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 1 + "" + (j + 2))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i + 1 + "" + (j + 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j + 2))[0]);

      if (updateBoard[i + 1][j + 2].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j + 2))[0]);
    }
  }
  if (i - 1 >= 0 && j + 2 <= 7) {
    if (updateBoard[i - 1][j + 2] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 1 + "" + (j + 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 1 + "" + (j + 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j + 2))[0]);
    } else if (
      updateBoard[i - 1][j + 2].color !== p.color &&
      updateBoard[i - 1][j + 2] !== "Free Squere"
    ) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 1 + "" + (j + 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 1 + "" + (j + 2))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i - 1 + "" + (j + 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j + 2))[0]);

      if (updateBoard[i - 1][j + 2].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j + 2))[0]);
    }
  }
  if (i - 2 >= 0 && j - 1 >= 0) {
    if (updateBoard[i - 2][j - 1] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 2 + "" + (j - 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 2 + "" + (j - 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 2 + "" + (j - 1))[0]);
    } else if (
      updateBoard[i - 2][j - 1].color !== p.color &&
      updateBoard[i - 2][j - 1] !== "Free Squere"
    ) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 2 + "" + (j - 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 2 + "" + (j - 1))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i - 2 + "" + (j - 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 2 + "" + (j - 1))[0]);

      if (updateBoard[i - 2][j - 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i - 2 + "" + (j - 1))[0]);
    }
  }

  if (i + 1 <= 7 && j - 2 >= 0) {
    if (updateBoard[i + 1][j - 2] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 1 + "" + (j - 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 1 + "" + (j - 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j - 2))[0]);
    } else if (
      updateBoard[i + 1][j - 2].color !== p.color &&
      updateBoard[i + 1][j - 2] !== "Free Squere"
    ) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i + 1 + "" + (j - 2))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i + 1 + "" + (j - 2))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i + 1 + "" + (j - 2))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j - 2))[0]);

      if (updateBoard[i + 1][j - 2].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j - 2))[0]);
    }
  }
  if (i - 2 >= 0 && j + 1 <= 7) {
    if (updateBoard[i - 2][j + 1] === "Free Squere") {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 2 + "" + (j + 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 2 + "" + (j + 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 2 + "" + (j + 1))[0]);
    } else if (
      updateBoard[i - 2][j + 1].color !== p.color &&
      updateBoard[i - 2][j + 1] !== "Free Squere"
    ) {
      if (
        !leftPin &&
        !rightPin &&
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document
          .getElementsByName(i - 2 + "" + (j + 1))[0]
          .classList.add("can-move");
        possibleMovesArray.push(
          document.getElementsByName(i - 2 + "" + (j + 1))[0]
        );
        possibleEatMoveArray.push(
          document.getElementsByName(i - 2 + "" + (j + 1))[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i - 2 + "" + (j + 1))[0]);

      if (updateBoard[i - 2][j + 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else {
      defenceSquare.push(document.getElementsByName(i - 2 + "" + (j + 1))[0]);
    }
  }
  if (isChecked === true && checkOnColor === p.color) {
    var temp = [];
    console.log("CHECK ROUTH BUTTON = " + checkRoutButtons.length);
    for (var i = 0; i < possibleMovesArray.length; i++) {
      for (var j = 0; j < checkRoutButtons.length; j++) {
        if (possibleMovesArray[i] === checkRoutButtons[j]) {
          temp.push(possibleMovesArray[i]);
        } else {
          possibleMovesArray[i].classList.remove("can-move");
        }
      }
    }
    possibleMovesArray = temp;
    for (var ind = 0; ind < possibleMovesArray.length; ind++) {
      possibleMovesArray[ind].classList.add("can-move");
    }
    console.log(
      "Possible Moves for " +
      p.type +
      "in i location " +
      i +
      " in j location " +
      j +
      " = " +
      possibleMovesArray.length
    );
  }
}

function getKings() {
  var kingArray = [];
  var whiteking;
  var blackking;
  for (var i = 0; i <= 7; i++) {
    for (var j = 0; j <= 7; j++) {
      if (
        updateBoard[i][j].color === "white" &&
        updateBoard[i][j].type === "king"
      ) {
        whiteking = updateBoard[i][j];
      } else if (
        updateBoard[i][j].color === "black" &&
        updateBoard[i][j].type === "king"
      ) {
        blackking = updateBoard[i][j];
      }
    }
  }
  kingArray.push(whiteking);
  kingArray.push(blackking);
  return kingArray;
}
function checkKingsLocation(iwk, jwk, ibk, jbk) {
  if (iwk === ibk && jwk + 1 === jbk) {
    return false;
  } else if (iwk === ibk && jwk - 1 === jbk) {
    return false;
  } else if (iwk + 1 === ibk && jwk === jbk) {
    return false;
  } else if (iwk - 1 === ibk && jwk === jbk) {
    return false;
  } else if (iwk + 1 === ibk && jwk - 1 === jbk) {
    return false;
  } else if (iwk - 1 === ibk && jwk - 1 === jbk) {
    return false;
  } else if (iwk + 1 === ibk && jwk + 1 === jbk) {
    return false;
  } else if (iwk - 1 === ibk && jwk + 1 === jbk) {
    return false;
  } else {
    return true;
  }
}
function checkKingMove(p, j, i) {
  var whiteKing = getKings()[0];
  var iWhiteKingLocation = whiteKing.iLocation;
  var jWhiteKingLocation = whiteKing.jLocation;
  // alert(defenceSquare.length);
  if (p.color === "black") {
    var whitePMoves = getPossibleMovesWhite();
  } else {
    var blackPMoves = getPossibleMovesBlack();
  }
  var blackKing = getKings()[1];
  var iBlackKingLocation = blackKing.iLocation;
  var jBlackKingLocation = blackKing.jLocation;
  var ikRight = i - 1;
  var jkRight = j + 1;
  if (j !== 7) {
    if (i === 0) {
      ikRight++;
    }
    for (ikRight; ikRight <= i + 1; ikRight++) {
      if (ikRight !== 8) {
        if (p.color === "white") {
          if (
            checkKingsLocation(
              ikRight,
              jkRight,
              iBlackKingLocation,
              jBlackKingLocation
            )
          ) {
            if (
              updateBoard[ikRight][jkRight] === "Free Squere" &&
              defenceSquare.includes(
                document.getElementsByName(ikRight + "" + jkRight)[0]
              ) !== true
            ) {
              document
                .getElementsByName(ikRight + "" + jkRight)[0]
                .classList.add("can-move");
              possibleMovesArray.push(
                document.getElementsByName(ikRight + "" + jkRight)[0]
              );
            } else if (updateBoard[ikRight][jkRight].color !== p.color) {
              if (
                defenceSquare.includes(
                  document.getElementsByName(ikRight + "" + jkRight)[0]
                ) !== true
              ) {
                document
                  .getElementsByName(ikRight + "" + jkRight)[0]
                  .classList.add("can-move");
                possibleMovesArray.push(
                  document.getElementsByName(ikRight + "" + jkRight)[0]
                );
                possibleEatMoveArray.push(
                  document.getElementsByName(ikRight + "" + jkRight)[0]
                );
              }
            }
          }
        } else {
          if (
            checkKingsLocation(
              ikRight,
              jkRight,
              iWhiteKingLocation,
              jWhiteKingLocation
            )
          ) {
            if (
              updateBoard[ikRight][jkRight] === "Free Squere" &&
              defenceSquare.includes(
                document.getElementsByName(ikRight + "" + jkRight)[0]
              ) !== true
            ) {
              document
                .getElementsByName(ikRight + "" + jkRight)[0]
                .classList.add("can-move");
              possibleMovesArray.push(
                document.getElementsByName(ikRight + "" + jkRight)[0]
              );
            } else if (updateBoard[ikRight][jkRight].color !== p.color) {
              if (
                defenceSquare.includes(
                  document.getElementsByName(ikRight + "" + jkRight)[0]
                ) !== true
              ) {
                document
                  .getElementsByName(ikRight + "" + jkRight)[0]
                  .classList.add("can-move");
                possibleMovesArray.push(
                  document.getElementsByName(ikRight + "" + jkRight)[0]
                );
                possibleEatMoveArray.push(
                  document.getElementsByName(ikRight + "" + jkRight)[0]
                );
              }
            }
          }
        }
      }
    }
  }
  var ikLeft = i - 1;
  var jkLeft = j - 1;
  if (j !== 0) {
    if (i === 0) {
      ikLeft++;
    }
    for (ikLeft; ikLeft <= i + 1; ikLeft++) {
      if (ikLeft !== 8) {
        if (p.color === "white") {
          if (
            checkKingsLocation(
              ikLeft,
              jkLeft,
              iBlackKingLocation,
              jBlackKingLocation
            )
          ) {
            if (
              updateBoard[ikLeft][jkLeft] === "Free Squere" &&
              defenceSquare.includes(
                document.getElementsByName(ikLeft + "" + jkLeft)[0]
              ) !== true
            ) {
              document
                .getElementsByName(ikLeft + "" + jkLeft)[0]
                .classList.add("can-move");
              possibleMovesArray.push(
                document.getElementsByName(ikLeft + "" + jkLeft)[0]
              );
            } else if (updateBoard[ikLeft][jkLeft].color !== p.color) {
              if (
                defenceSquare.includes(
                  document.getElementsByName(ikLeft + "" + jkLeft)[0]
                ) !== true
              ) {
                document
                  .getElementsByName(ikLeft + "" + jkLeft)[0]
                  .classList.add("can-move");
                possibleMovesArray.push(
                  document.getElementsByName(ikLeft + "" + jkLeft)[0]
                );
                possibleEatMoveArray.push(
                  document.getElementsByName(ikLeft + "" + jkLeft)[0]
                );
              }
            }
          }
        } else {
          if (
            checkKingsLocation(
              ikLeft,
              jkLeft,
              iWhiteKingLocation,
              jWhiteKingLocation
            )
          ) {
            if (
              updateBoard[ikLeft][jkLeft] === "Free Squere" &&
              defenceSquare.includes(
                document.getElementsByName(ikLeft + "" + jkLeft)[0]
              ) !== true
            ) {
              document
                .getElementsByName(ikLeft + "" + jkLeft)[0]
                .classList.add("can-move");
              possibleMovesArray.push(
                document.getElementsByName(ikLeft + "" + jkLeft)[0]
              );
            } else if (updateBoard[ikLeft][jkLeft].color !== p.color) {
              if (
                defenceSquare.includes(
                  document.getElementsByName(ikLeft + "" + jkLeft)[0]
                ) !== true
              ) {
                document
                  .getElementsByName(ikLeft + "" + jkLeft)[0]
                  .classList.add("can-move");
                possibleMovesArray.push(
                  document.getElementsByName(ikLeft + "" + jkLeft)[0]
                );
                possibleEatMoveArray.push(
                  document.getElementsByName(ikLeft + "" + jkLeft)[0]
                );
              }
            }
          }
        }
      }
    }
  }

  if (i !== 7) {
    if (p.color === "white") {
      if (
        checkKingsLocation(i + 1, j, iBlackKingLocation, jBlackKingLocation)
      ) {
        if (
          updateBoard[i + 1][j] === "Free Squere" &&
          defenceSquare.includes(
            document.getElementsByName(i + 1 + "" + j)[0]
          ) !== true
        ) {
          document
            .getElementsByName(i + 1 + "" + j)[0]
            .classList.add("can-move");
          possibleMovesArray.push(
            document.getElementsByName(i + 1 + "" + j)[0]
          );
        } else if (updateBoard[i + 1][j].color !== p.color) {
          if (
            defenceSquare.includes(
              document.getElementsByName(i + 1 + "" + j)[0]
            ) !== true
          ) {
            document
              .getElementsByName(i + 1 + "" + j)[0]
              .classList.add("can-move");
            possibleMovesArray.push(
              document.getElementsByName(i + 1 + "" + j)[0]
            );
            possibleEatMoveArray.push(
              document.getElementsByName(i + 1 + "" + j)[0]
            );
          }
        }
      }
    } else {
      if (
        checkKingsLocation(i + 1, j, iWhiteKingLocation, jWhiteKingLocation)
      ) {
        if (
          updateBoard[i + 1][j] === "Free Squere" &&
          defenceSquare.includes(
            document.getElementsByName(i + 1 + "" + j)[0]
          ) !== true
        ) {
          document
            .getElementsByName(i + 1 + "" + j)[0]
            .classList.add("can-move");
          possibleMovesArray.push(
            document.getElementsByName(i + 1 + "" + j)[0]
          );
        } else if (updateBoard[i + 1][j].color !== p.color) {
          if (
            defenceSquare.includes(
              document.getElementsByName(i + 1 + "" + j)[0]
            ) !== true
          ) {
            document
              .getElementsByName(i + 1 + "" + j)[0]
              .classList.add("can-move");
            possibleMovesArray.push(
              document.getElementsByName(i + 1 + "" + j)[0]
            );
            possibleEatMoveArray.push(
              document.getElementsByName(i + 1 + "" + j)[0]
            );
          }
        }
      }
    }
  }

  if (i !== 0) {
    if (p.color === "white") {
      if (
        checkKingsLocation(i - 1, j, iBlackKingLocation, jBlackKingLocation)
      ) {
        if (
          updateBoard[i - 1][j] === "Free Squere" &&
          defenceSquare.includes(
            document.getElementsByName(i - 1 + "" + j)[0]
          ) !== true
        ) {
          document
            .getElementsByName(i - 1 + "" + j)[0]
            .classList.add("can-move");
          possibleMovesArray.push(
            document.getElementsByName(i - 1 + "" + j)[0]
          );
        } else if (updateBoard[i - 1][j].color !== p.color) {
          if (
            defenceSquare.includes(
              document.getElementsByName(i - 1 + "" + j)[0]
            ) !== true
          ) {
            document
              .getElementsByName(i - 1 + "" + j)[0]
              .classList.add("can-move");
            possibleMovesArray.push(
              document.getElementsByName(i - 1 + "" + j)[0]
            );
            possibleEatMoveArray.push(
              document.getElementsByName(i - 1 + "" + j)[0]
            );
          }
        }
      }
    } else {
      if (
        checkKingsLocation(i - 1, j, iWhiteKingLocation, jWhiteKingLocation)
      ) {
        if (
          updateBoard[i - 1][j] === "Free Squere" &&
          defenceSquare.includes(
            document.getElementsByName(i - 1 + "" + j)[0]
          ) !== true
        ) {
          document
            .getElementsByName(i - 1 + "" + j)[0]
            .classList.add("can-move");
          possibleMovesArray.push(
            document.getElementsByName(i - 1 + "" + j)[0]
          );
        } else if (updateBoard[i - 1][j].color !== p.color) {
          if (
            defenceSquare.includes(
              document.getElementsByName(i - 1 + "" + j)[0]
            ) !== true
          ) {
            document
              .getElementsByName(i - 1 + "" + j)[0]
              .classList.add("can-move");
            possibleMovesArray.push(
              document.getElementsByName(i - 1 + "" + j)[0]
            );
            possibleEatMoveArray.push(
              document.getElementsByName(i - 1 + "" + j)[0]
            );
          }
        }
      }
    }
  }
  if (p.move === 0 && isChecked === false && p.color === "white") {
    if (updateBoard[0][0].move === 0) {
      //WHITE QUEEN SIDE CASTLING
      let queenCastle = true;
      for (var s = 1; s < 4; s++) {
        if (updateBoard[0][s] !== "Free Squere") {
          queenCastle = false;
        }
      }
      if (queenCastle) {
        possibleMovesArray.push(document.getElementsByName("02")[0]);
        document.getElementsByName("02")[0].classList.add("can-move");
      }
    }
    if (updateBoard[0][7].move === 0) {
      let kingCastle = true;
      for (var kc = 5; kc < 7; kc++) {
        if (updateBoard[0][kc] !== "Free Squere") {
          kingCastle = false;
        }
      }
      if (kingCastle) {
        possibleMovesArray.push(document.getElementsByName("06")[0]);
        document.getElementsByName("06")[0].classList.add("can-move");
      }
    }
  }
  if (p.move === 0 && isChecked === false && p.color === "black") {
    if (updateBoard[7][0].move === 0) {
      //BLACK QUEEN SIDE CASTLING
      let queenCastle = true;
      for (var s = 1; s < 4; s++) {
        if (updateBoard[7][s] !== "Free Squere") {
          queenCastle = false;
        }
      }
      if (queenCastle) {
        possibleMovesArray.push(document.getElementsByName("72")[0]);
        document.getElementsByName("72")[0].classList.add("can-move");
      }
    }
    if (updateBoard[7][7].move === 0) {
      let kingCastle = true;
      for (var kc = 5; kc < 7; kc++) {
        if (updateBoard[7][kc] !== "Free Squere") {
          kingCastle = false;
        }
      }
      if (kingCastle) {
        possibleMovesArray.push(document.getElementsByName("76")[0]);
        document.getElementsByName("76")[0].classList.add("can-move");
      }
    }
  }
  if (p.color === "black") {
    for (var a = 0; a < possibleMovesArray.length; a++) {
      for (var b = 0; b < whitePMoves.length; b++) {
        if (possibleMovesArray[a] === whitePMoves[b]) {
          possibleMovesArray[a].classList.remove("can-move");
          // possibleMovesArray[a].classList.add("can-eat");
        }
      }
    }
    console.log("Black KING P MOVES = " + possibleMovesArray.length);
    var ntd = whitePMoves;
    var ntdSet = new Set(ntd);
    possibleMovesArray = possibleMovesArray.filter((button) => {
      return !ntdSet.has(button);
    });
    console.log("KING P MOVES = " + possibleMovesArray.length);
  } else {
    for (var a = 0; a < possibleMovesArray.length; a++) {
      for (var b = 0; b < blackPMoves.length; b++) {
        if (possibleMovesArray[a] === blackPMoves[b]) {
          possibleMovesArray[a].classList.remove("can-move");
          // possibleMovesArray[a].classList.add("can-eat");
        }
      }
    }
    console.log("white KING P MOVES = " + possibleMovesArray.length);
    var ntd = blackPMoves;
    var ntdSet = new Set(ntd);
    possibleMovesArray = possibleMovesArray.filter((button) => {
      return !ntdSet.has(button);
    });
    console.log("white KING P MOVES = " + possibleMovesArray.length);
  }

  if (isChecked) {
    if (checkDirection === "left" && p.jLocation !== 7) {
      var index = possibleMovesArray.indexOf(
        document.getElementsByName(i + "" + (j + 1))[0]
      );
      if (index !== -1) {
        possibleMovesArray.splice(index, 1);
      }
      document
        .getElementsByName(i + "" + (j + 1))[0]
        .classList.remove("can-move");
    } else if (checkDirection === "right" && p.jLocation !== 0) {
      var index = possibleMovesArray.indexOf(
        document.getElementsByName(i + "" + (j - 1))[0]
      );
      if (index !== -1) {
        possibleMovesArray.splice(index, 1);
      }
      document
        .getElementsByName(i + "" + (j - 1))[0]
        .classList.remove("can-move");
    } else if (checkDirection === "down" && p.iLocation !== 7) {
      var index = possibleMovesArray.indexOf(
        document.getElementsByName(i + 1 + "" + j)[0]
      );
      if (index !== -1) {
        possibleMovesArray.splice(index, 1);
      }
      document
        .getElementsByName(i + 1 + "" + j)[0]
        .classList.remove("can-move");
    } else if (checkDirection === "up" && p.iLocation !== 0) {
      var index = possibleMovesArray.indexOf(
        document.getElementsByName(i - 1 + "" + j)[0]
      );
      if (index !== -1) {
        possibleMovesArray.splice(index, 1);
      }
      document
        .getElementsByName(i - 1 + "" + j)[0]
        .classList.remove("can-move");
    }
    // && (p.iLocation !== 0 || p.jLocation !== 0)
    else if (checkDirection === "downLeft") {
      if (
        typeof document.getElementsByName(i + 1 + "" + (j + 1))[0] !==
        "undefined"
      ) {
        var index = possibleMovesArray.indexOf(
          document.getElementsByName(i + 1 + "" + (j + 1))[0]
        );
        console.log("INDEX OF =" + index);
        if (index !== -1) {
          possibleMovesArray.splice(index, 1);
        }
        document
          .getElementsByName(i + 1 + "" + (j + 1))[0]
          .classList.remove("can-move");
      }
    } else if (checkDirection === "downRight") {
      if (
        typeof document.getElementsByName(i + 1 + "" + (j - 1))[0] !==
        "undefined"
      ) {
        var index = possibleMovesArray.indexOf(
          document.getElementsByName(i + 1 + "" + (j - 1))[0]
        );
        console.log("INDEX OF =" + index);
        if (index !== -1) {
          possibleMovesArray.splice(index, 1);
        }
        document
          .getElementsByName(i + 1 + "" + (j - 1))[0]
          .classList.remove("can-move");
      }
    } else if (checkDirection === "upRight") {
      if (
        typeof document.getElementsByName(i - 1 + "" + (j - 1))[0] !==
        "undefined"
      ) {
        var index = possibleMovesArray.indexOf(
          document.getElementsByName(i - 1 + "" + (j - 1))[0]
        );
        console.log("INDEX OF =" + index);
        if (index !== -1) {
          possibleMovesArray.splice(index, 1);
        }
        document
          .getElementsByName(i - 1 + "" + (j - 1))[0]
          .classList.remove("can-move");
      }
    } else if (checkDirection === "upLeft") {
      if (
        typeof document.getElementsByName(i - 1 + "" + (j + 1))[0] !==
        "undefined"
      ) {
        var index = possibleMovesArray.indexOf(
          document.getElementsByName(i - 1 + "" + (j + 1))[0]
        );
        console.log("INDEX OF =" + index);
        if (index !== -1) {
          possibleMovesArray.splice(index, 1);
        }
        document
          .getElementsByName(i - 1 + "" + (j + 1))[0]
          .classList.remove("can-move");
      }
    }
  }
  console.log("KING P MOVES = " + possibleMovesArray.length);
}
function enPassantMove(direction, i, j) {
  switch (direction) {
    case "white":
      var element = document.getElementsByName(i - 1 + "" + j)[0];
      addEatenPiece(updateBoard[i - 1][j].color, element.innerHTML);
      element.innerHTML = "";
      updateBoard[i - 1][j] = "Free Squere";
      break;
    case "black":
      var element = document.getElementsByName(i + 1 + "" + j)[0];
      addEatenPiece(updateBoard[i + 1][j].color, element.innerHTML);
      element.innerHTML = "";
      updateBoard[i - 1][j] = "Free Squere";
      break;
    default:
      break;
  }
}
function checkPawnEatMove(p, j, i, pinByBishopDirection) {
  //CHECK IF A PAWN CAN EAT

  var downLeftPin = false;
  var downRightPin = false;
  var upRightPin = false;
  var upLeftPin = false;
  if (pinByBishopDirection[0] === "pin-left-down") {
    downLeftPin = true;
  }
  if (pinByBishopDirection[1] === "pin-right-down") {
    downRightPin = true;
  }
  if (pinByBishopDirection[2] === "pin-left-up") {
    upLeftPin = true;
  }
  if (pinByBishopDirection[3] === "pin-right-up") {
    upRightPin = true;
  }

  if (p.color === "white") {
    if (
      j + 1 <= 7 &&
      i + 1 <= 7 &&
      !downLeftPin &&
      !downRightPin &&
      !upLeftPin &&
      updateBoard[i + 1][j + 1] !== "Free Squere" &&
      updateBoard[i + 1][j + 1].color === "black"
    ) {
      document
        .getElementsByName(i + 1 + "" + (j + 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i + 1 + "" + (j + 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i + 1 + "" + (j + 1))[0]
      );
      if (updateBoard[i + 1][j + 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else if (
      j + 1 <= 7 &&
      i + 1 <= 7 &&
      updateBoard[i + 1][j + 1] === "Free Squere"
    ) {
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j + 1))[0]);
    } else if (
      j + 1 <= 7 &&
      i + 1 <= 7 &&
      updateBoard[i + 1][j + 1] !== "Free Squere" &&
      updateBoard[i + 1][j + 1].color === p.color
    ) {
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j + 1))[0]);
    }

    if (
      j - 1 >= 0 &&
      i + 1 <= 7 &&
      !downLeftPin &&
      !downRightPin &&
      !upRightPin &&
      updateBoard[i + 1][j - 1] !== "Free Squere" &&
      updateBoard[i + 1][j - 1].color === "black"
    ) {
      document
        .getElementsByName(i + 1 + "" + (j - 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i + 1 + "" + (j - 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i + 1 + "" + (j - 1))[0]
      );
      if (updateBoard[i + 1][j - 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else if (
      j - 1 >= 0 &&
      i + 1 <= 7 &&
      updateBoard[i + 1][j - 1] === "Free Squere"
    ) {
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j - 1))[0]);
    } else if (
      j - 1 >= 0 &&
      i + 1 <= 7 &&
      updateBoard[i + 1][j - 1] !== "Free Squere" &&
      updateBoard[i + 1][j - 1].color === p.color
    ) {
      defenceSquare.push(document.getElementsByName(i + 1 + "" + (j - 1))[0]);
    }
    //EN-PASSANT WHITE LEFT EAT
    if (
      j - 1 >= 0 &&
      !downLeftPin &&
      !downRightPin &&
      !upRightPin &&
      updateBoard[i][j - 1].type === "pawn" &&
      updateBoard[i][j - 1].color === "black" &&
      updateBoard[i][j - 1].enPassant === true
    ) {
      document
        .getElementsByName(i + 1 + "" + (j - 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i + 1 + "" + (j - 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i + 1 + "" + (j - 1))[0]
      );
      enPassantDirection = "white";
    }
    if (
      j + 1 <= 7 &&
      !downLeftPin &&
      !downRightPin &&
      !upLeftPin &&
      updateBoard[i][j + 1].type === "pawn" &&
      updateBoard[i][j + 1].color === "black" &&
      updateBoard[i][j + 1].enPassant === true
    ) {
      document
        .getElementsByName(i + 1 + "" + (j + 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i + 1 + "" + (j + 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i + 1 + "" + (j + 1))[0]
      );
      enPassantDirection = "white";
    }
  }

  if (p.color === "black") {
    if (
      j + 1 <= 7 &&
      i - 1 >= 0 &&
      !downLeftPin &&
      !upLeftPin &&
      !upRightPin &&
      updateBoard[i - 1][j + 1] !== "Free Squere" &&
      updateBoard[i - 1][j + 1].color === "white"
    ) {
      document
        .getElementsByName(i - 1 + "" + (j + 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i - 1 + "" + (j + 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i - 1 + "" + (j + 1))[0]
      );
      if (updateBoard[i - 1][j + 1].type === "king") {
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p);
      }
    } else if (
      j + 1 <= 7 &&
      i - 1 >= 0 &&
      updateBoard[i - 1][j + 1] === "Free Squere"
    ) {
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j + 1))[0]);
    } else if (
      j + 1 <= 7 &&
      i - 1 >= 0 &&
      updateBoard[i - 1][j + 1] !== "Free Squere" &&
      updateBoard[i - 1][j + 1].color === p.color
    ) {
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j + 1))[0]);
    }

    if (
      j - 1 >= 0 &&
      i - 1 >= 0 &&
      !downRightPin &&
      !upLeftPin &&
      !upRightPin &&
      updateBoard[i - 1][j - 1] !== "Free Squere" &&
      updateBoard[i - 1][j - 1].color === "white"
    ) {
      document
        .getElementsByName(i - 1 + "" + (j - 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i - 1 + "" + (j - 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i - 1 + "" + (j - 1))[0]
      );
      if (updateBoard[i - 1][j - 1].type === "king") {
        isChecked = true;
        checkPiece = p;

        againstCheckMove(p);
      }
    } else if (
      j - 1 >= 0 &&
      i - 1 >= 0 &&
      updateBoard[i - 1][j - 1] === "Free Squere"
    ) {
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j - 1))[0]);
    } else if (
      j - 1 >= 0 &&
      i - 1 >= 0 &&
      updateBoard[i - 1][j - 1] !== "Free Squere" &&
      updateBoard[i - 1][j - 1].color === p.color
    ) {
      defenceSquare.push(document.getElementsByName(i - 1 + "" + (j - 1))[0]);
    }
    if (
      j - 1 >= 0 &&
      !downRightPin &&
      !upLeftPin &&
      !upRightPin &&
      updateBoard[i][j - 1].type === "pawn" &&
      updateBoard[i][j - 1].color === "white" &&
      updateBoard[i][j - 1].enPassant === true
    ) {
      document
        .getElementsByName(i - 1 + "" + (j - 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i - 1 + "" + (j - 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i - 1 + "" + (j - 1))[0]
      );
      enPassantDirection = "black";
    }
    if (
      j + 1 <= 7 &&
      !downLeftPin &&
      !upLeftPin &&
      !upRightPin &&
      updateBoard[i][j + 1].type === "pawn" &&
      updateBoard[i][j + 1].color === "white" &&
      updateBoard[i][j + 1].enPassant === true
    ) {
      document
        .getElementsByName(i - 1 + "" + (j + 1))[0]
        .classList.add("can-move");
      possibleMovesArray.push(
        document.getElementsByName(i - 1 + "" + (j + 1))[0]
      );
      possibleEatMoveArray.push(
        document.getElementsByName(i - 1 + "" + (j + 1))[0]
      );
      enPassantDirection = "black";
    }
  }
}

function checkPawnMove(p, j, i) {
  var leftPin = false;
  var rightPin = false;
  var upPin = false;
  var downPin = false;
  var downLeftPin = false;
  var downRightPin = false;
  var upRightPin = false;
  var upLeftPin = false;
  var pinByRookDirection = checkPinByRook(p, j, i);
  var pinByBishopDirection = checkPinByBishop(p, j, i);

  if (pinByRookDirection[0] === "pin-left") {
    leftPin = true;
  }
  if (pinByRookDirection[1] === "pin-right") {
    rightPin = true;
  }
  if (pinByRookDirection[2] === "pin-up") {
    upPin = true;
  }
  if (pinByRookDirection[3] === "pin-down") {
    downPin = true;
  }

  if (pinByBishopDirection[0] === "pin-left-down") {
    downLeftPin = true;
  }
  if (pinByBishopDirection[1] === "pin-right-down") {
    downRightPin = true;
  }
  if (pinByBishopDirection[2] === "pin-left-up") {
    upLeftPin = true;
  }
  if (pinByBishopDirection[3] === "pin-right-up") {
    upRightPin = true;
  }

  if (p.color === "white") {
    if (!leftPin && !rightPin && !upPin && !downPin) {
      checkPawnEatMove(p, j, i, pinByBishopDirection);
    }

    if (p.move === 0) {
      if (
        i + 1 <= 7 &&
        updateBoard[i + 1][j] === "Free Squere" &&
        updateBoard[i + 2][j] === "Free Squere" &&
        !leftPin &&
        !rightPin &&
        !downLeftPin &&
        !downRightPin &&
        !upRightPin &&
        !upLeftPin
      ) {
        for (var d = i + 1; d < i + 3; d++) {
          document.getElementsByName(d + "" + j)[0].classList.add("can-move");
          possibleMovesArray.push(document.getElementsByName(d + "" + j)[0]);
        }
      } else if (
        i + 1 <= 7 &&
        updateBoard[i + 1][j] === "Free Squere" &&
        !leftPin &&
        !rightPin &&
        !downLeftPin &&
        !downRightPin &&
        !upRightPin &&
        !upLeftPin
      ) {
        document.getElementsByName(i + 1 + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i + 1 + "" + j)[0]);
      }
    } else {
      if (
        i + 1 <= 7 &&
        updateBoard[i + 1][j] === "Free Squere" &&
        !leftPin &&
        !rightPin &&
        !downLeftPin &&
        !downRightPin &&
        !upRightPin &&
        !upLeftPin
      ) {
        document.getElementsByName(i + 1 + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i + 1 + "" + j)[0]);
      }
    }
  }
  if (p.color === "black") {
    if (!leftPin && !rightPin && !upPin && !downPin) {
      checkPawnEatMove(p, j, i, pinByBishopDirection);
    }

    if (p.move === 0) {
      if (
        i - 1 >= 0 &&
        updateBoard[i - 1][j] === "Free Squere" &&
        updateBoard[i - 2][j] === "Free Squere" &&
        !leftPin &&
        !rightPin &&
        !downLeftPin &&
        !downRightPin &&
        !upRightPin &&
        !upLeftPin
      ) {
        for (var d = i - 1; d > i - 3; d--) {
          document.getElementsByName(d + "" + j)[0].classList.add("can-move");
          possibleMovesArray.push(document.getElementsByName(d + "" + j)[0]);
        }
      } else if (
        i - 1 >= 0 &&
        updateBoard[i - 1][j] === "Free Squere" &&
        !leftPin &&
        !rightPin &&
        !downLeftPin &&
        !downRightPin &&
        !upRightPin &&
        !upLeftPin
      ) {
        document.getElementsByName(i - 1 + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i - 1 + "" + j)[0]);
      }
    } else {
      if (
        i - 1 >= 0 &&
        updateBoard[i - 1][j] === "Free Squere" &&
        !leftPin &&
        !rightPin &&
        !downLeftPin &&
        !downRightPin &&
        !upRightPin &&
        !upLeftPin
      ) {
        document.getElementsByName(i - 1 + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i - 1 + "" + j)[0]);
      }
    }
  }
  console.log("Possible Moves = " + possibleMovesArray.length);

  if (isChecked === true && checkOnColor === p.color) {
    var temp = [];
    var jcl = getButtonLocation(
      checkRoutButtons[checkRoutButtons.length - 1]
    )[1];
    console.log("CHECK ROUTH BUTTON = " + checkRoutButtons.length);
    for (var i = 0; i < possibleMovesArray.length; i++) {
      var jpl = getButtonLocation(possibleMovesArray[i])[1];
      for (var j = 0; j < checkRoutButtons.length; j++) {
        if (
          possibleMovesArray[i] === checkRoutButtons[j] &&
          jcl !== p.jLocation
        ) {
          temp.push(possibleMovesArray[i]);
        } else {
          possibleMovesArray[i].classList.remove("can-move");
        }
      }
    }
    possibleMovesArray = temp;
    for (var i = 0; i < possibleMovesArray.length; i++) {
      possibleMovesArray[i].classList.add("can-move");
    }
  }

  console.log("Possible Moves = " + possibleMovesArray.length);
}
function getButtonLocation(button) {
  var i = Number(button.name[0]);
  var j = Number(button.name[1]);
  var locations = [i, j];
  return locations;
}

function againstCheckMoveQueen(p, direction, i, j) {
  if (direction === "left") {
    while (!checkRout.includes(p)) {
      j--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
      // document.getElementsByName(i + "" + j)[0].classList.add("can-eat");
    }
  } else if (direction === "right") {
    while (!checkRout.includes(p)) {
      j++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (direction === "down") {
    while (!checkRout.includes(p)) {
      i--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (direction === "up") {
    while (!checkRout.includes(p)) {
      i++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  }

  if (direction === "downLeft") {
    while (!checkRout.includes(p)) {
      i--;
      j--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (direction === "downRight") {
    while (!checkRout.includes(p)) {
      i--;
      j++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (direction === "upRight") {
    while (!checkRout.includes(p)) {
      i++;
      j++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (direction === "upLeft") {
    while (!checkRout.includes(p)) {
      i++;
      j--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  }
}

function againstCheckMove(p, direction) {
  //IF THERE IS A CHECK THE FUNCTION PUTTING THE ROUTH TO THE KING IN AN ARRAY

  checkDirection = direction;
  var whiteKing = getKings()[0];
  var iWhiteKingLocation = whiteKing.iLocation;
  var jWhiteKingLocation = whiteKing.jLocation;

  var blackKing = getKings()[1];
  var iBlackKingLocation = blackKing.iLocation;
  var jBlackKingLocation = blackKing.jLocation;
  if (p.color === "white") {
    var i = iBlackKingLocation;
    var j = jBlackKingLocation;
  } else {
    var i = iWhiteKingLocation;
    var j = jWhiteKingLocation;
  }

  if (p.type === "queen") {
    againstCheckMoveQueen(p, direction, i, j);
  } else if (p.type === "rook" && direction === "left") {
    while (!checkRout.includes(p)) {
      j--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
      // document.getElementsByName(i + "" + j)[0].classList.add("can-eat");
    }
  } else if (p.type === "rook" && direction === "right") {
    while (!checkRout.includes(p)) {
      j++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "rook" && direction === "down") {
    while (!checkRout.includes(p)) {
      i--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "rook" && direction === "up") {
    while (!checkRout.includes(p)) {
      i++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  }

  if (p.type === "bishop" && direction === "downLeft") {
    while (!checkRout.includes(p)) {
      i--;
      j--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "bishop" && direction === "downRight") {
    while (!checkRout.includes(p)) {
      i--;
      j++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "bishop" && direction === "upRight") {
    while (!checkRout.includes(p)) {
      i++;
      j++;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "bishop" && direction === "upLeft") {
    while (!checkRout.includes(p)) {
      i++;
      j--;
      checkRout.push(updateBoard[i][j]);
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "horse") {
    while (!checkRout.includes(p)) {
      checkRout.push(p);
      var i = p.iLocation;
      var j = p.jLocation;
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  } else if (p.type === "pawn") {
    while (!checkRout.includes(p)) {
      checkRout.push(p);
      var i = p.iLocation;
      var j = p.jLocation;
      checkRoutButtons.push(document.getElementsByName(i + "" + j)[0]);
    }
  }
}
function checkPinnedPiece(p, i, j, pMoves) {
  let tempBoard = updateBoard;
  let piecePossibleMoves = pMoves;
  let Ocolor;
  if (p.color === "white") {
    Ocolor = "black";
  } else {
    Ocolor = "white";
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        tempBoard[i][j].color === Ocolor &&
        (tempBoard[i][j].type === "queen" ||
          tempBoard[i][j].type === "rook" ||
          tempBoard[i][j].type === "bishop")
      ) {
        checkPieceMove(tempBoard[i][j]);
      }
    }
  }
}
function checkPinByBishop(p, j, i) {
  var whiteKing = getKings()[0];
  var blackKing = getKings()[1];
  var iKingLocation;
  var jKingLocation;
  var bishopColor;
  var pinArray = new Array(4);
  var freeRightUp = true;
  var freeLeftUp = true;
  var freeRightDown = true;
  var freeLeftDown = true;

  if (p.color === "black") {
    iKingLocation = blackKing.iLocation;
    jKingLocation = blackKing.jLocation;
    bishopColor = "white";
  } else {
    iKingLocation = whiteKing.iLocation;
    jKingLocation = whiteKing.jLocation;
    bishopColor = "black";
  }

  //CHECK PIN OF A bishop ON THE LEFT-DOWN SIDE
  if (
    i !== 0 &&
    j !== 0 &&
    jKingLocation > j &&
    iKingLocation > i &&
    iKingLocation - i === jKingLocation - j
  ) {
    var itoKing = i + 1;
    for (var jtoKing = j + 1; jtoKing < jKingLocation; jtoKing++) {
      if (updateBoard[itoKing][jtoKing] !== "Free Squere") {
        freeRightUp = false;
      }
      itoKing++;
    }
    if (
      freeRightUp ||
      (updateBoard[i + 1][j + 1].type === "king" &&
        updateBoard[i + 1][j + 1].color === p.color)
    ) {
      var ileft = i - 1;
      for (var jleft = j - 1; jleft >= 0; jleft--) {
        if (updateBoard[ileft][jleft] !== "Free Squere") {
          if (
            (updateBoard[ileft][jleft].type === "bishop" ||
              updateBoard[ileft][jleft].type === "queen") &&
            updateBoard[ileft][jleft].color === bishopColor
          ) {
            pinArray[0] = "pin-left-down";
            break;
          } else {
            break;
          }
        }
        ileft--;
      }
    }
  }
  //CHECK PIN OF A bishop ON THE RIGHT-DOWN SIDE
  if (
    i !== 0 &&
    j !== 7 &&
    jKingLocation < j &&
    iKingLocation > i &&
    iKingLocation - i === j - jKingLocation
  ) {
    var itoKing = i + 1;
    for (var JtoKing = j - 1; JtoKing > jKingLocation; JtoKing--) {
      if (updateBoard[itoKing][JtoKing] !== "Free Squere") {
        freeLeftUp = false;
      }
      itoKing++;
    }
    if (
      freeLeftUp ||
      (updateBoard[i + 1][j - 1].type === "king" &&
        updateBoard[i + 1][j - 1].color === p.color)
    ) {
      var ileft = i - 1;
      for (var right = j + 1; right <= 7; right++) {
        if (updateBoard[ileft][right] !== "Free Squere") {
          if (
            (updateBoard[ileft][right].type === "bishop" ||
              updateBoard[ileft][right].type === "queen") &&
            updateBoard[ileft][right].color === bishopColor
          ) {
            pinArray[1] = "pin-right-down";
            break;
          } else {
            break;
          }
        }
        ileft--;
      }
    }
  }
  //CHECK PIN OF A bishop FROM LEFT-UP SIDE
  if (
    i !== 7 &&
    j !== 0 &&
    jKingLocation > j &&
    iKingLocation < i &&
    i - iKingLocation === jKingLocation - j
  ) {
    var jtoKing = j + 1;
    for (var itoKing = i - 1; itoKing > iKingLocation; itoKing--) {
      if (updateBoard[itoKing][jtoKing] !== "Free Squere") {
        freeRightDown = false;
      }
      jtoKing++;
    }
    if (
      freeRightDown ||
      (updateBoard[i - 1][j + 1].type === "king" &&
        updateBoard[i - 1][j + 1].color === p.color)
    ) {
      var jleft = j - 1;
      for (var up = i + 1; up <= 7 && jleft >= 0; up++) {
        if (updateBoard[up][jleft] !== "Free Squere") {
          if (
            (updateBoard[up][jleft].type === "bishop" ||
              updateBoard[up][jleft].type === "queen") &&
            updateBoard[up][jleft].color === bishopColor
          ) {
            pinArray[2] = "pin-left-up";
            break;
          } else {
            break;
          }
        }
        jleft--;
      }
    }
  }
  //CHECK PIN OF A bishop FROM RIGHT-UP SIDE
  if (
    i !== 7 &&
    j !== 7 &&
    jKingLocation < j &&
    iKingLocation < i &&
    i - iKingLocation === j - jKingLocation
  ) {
    var jtoKing = j - 1;
    for (var itoKing = i - 1; itoKing > iKingLocation; itoKing--) {
      if (updateBoard[itoKing][jtoKing] !== "Free Squere") {
        freeLeftDown = false;
      }
      jtoKing--;
    }
    if (
      freeLeftDown ||
      (updateBoard[i - 1][j - 1].type === "king" &&
        updateBoard[i - 1][j - 1].color === p.color)
    ) {
      var jright = j + 1;
      for (var down = i + 1; down <= 7 && jright <= 7; down++) {
        if (updateBoard[down][jright] !== "Free Squere") {
          if (
            (updateBoard[down][jright].type === "bishop" ||
              updateBoard[down][jright].type === "queen") &&
            updateBoard[down][jright].color === bishopColor
          ) {
            pinArray[3] = "pin-right-up";
            break;
          } else {
            break;
          }
        }
        jright++;
      }
    }
  }
  return pinArray;
}
function checkPinByRook(p, j, i) {
  var whiteKing = getKings()[0];
  var blackKing = getKings()[1];
  var iKingLocation;
  var jKingLocation;
  var rookColor;
  var pinArray = new Array(4);
  var freeRight = true;
  var freeLeft = true;
  var freeUp = true;
  var freeDown = true;

  if (p.color === "black") {
    iKingLocation = blackKing.iLocation;
    jKingLocation = blackKing.jLocation;
    rookColor = "white";
  } else {
    iKingLocation = whiteKing.iLocation;
    jKingLocation = whiteKing.jLocation;
    rookColor = "black";
  }

  //CHECK PIN OF A ROOK ON THE LEFT SIDE
  if (i === iKingLocation && j !== 0) {
    for (var toKing = j + 1; toKing < jKingLocation; toKing++) {
      if (updateBoard[i][toKing] !== "Free Squere") {
        freeRight = false;
      }
    }
    if (
      freeRight ||
      (updateBoard[i][j + 1].type === "king" &&
        updateBoard[i][j + 1].color === p.color)
    ) {
      for (var left = j - 1; left >= 0; left--) {
        if (updateBoard[i][left] !== "Free Squere") {
          if (
            (updateBoard[i][left].type === "rook" ||
              updateBoard[i][left].type === "queen") &&
            updateBoard[i][left].color === rookColor
          ) {
            if (left < j && left > jKingLocation) {
              break
            } else {
              pinArray[0] = "pin-left";
              break;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  //CHECK PIN OF A ROOK ON THE RIGHT SIDE
  if (i === iKingLocation && j !== 7) {
    for (var toKing = j - 1; toKing > jKingLocation; toKing--) {
      if (updateBoard[i][toKing] !== "Free Squere") {
        freeLeft = false;
      }
    }
    if (
      freeLeft ||
      (updateBoard[i][j - 1].type === "king" &&
        updateBoard[i][j - 1].color === p.color)
    ) {
      for (var right = j + 1; right <= 7; right++) {
        if (updateBoard[i][right] !== "Free Squere") {
          if (
            (updateBoard[i][right].type === "rook" ||
              updateBoard[i][right].type === "queen") &&
            updateBoard[i][right].color === rookColor
          ) {
            if (right > j && right < jKingLocation) {
              break;
            } else {
              pinArray[1] = "pin-right";
              break;
            }

          } else {
            break;
          }
        }
      }
    }
  }
  //CHECK PIN OF A ROOK FROM SOUTH SIDE
  if (j === jKingLocation && i !== 7) {
    for (var toKing = i + 1; toKing < iKingLocation; toKing++) {
      if (updateBoard[toKing][j] !== "Free Squere") {
        freeUp = false;
      }
    }
    if (
      freeUp ||
      (updateBoard[i + 1][j].type === "king" &&
        updateBoard[i + 1][j].color === p.color)
    ) {

      for (var up = i - 1; up >= 0; up--) {
        if (updateBoard[up][j] !== "Free Squere") {
          if (
            (updateBoard[up][j].type === "rook" ||
              updateBoard[up][j].type === "queen") &&
            updateBoard[up][j].color === rookColor
          ) {
            if (up < i && up > iKingLocation) {
              break;
            } else {
              pinArray[2] = "pin-up";
              break;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  //CHECK PIN OF A ROOK FROM NORTH SIDE
  if (j === jKingLocation && i !== 0) {
    for (var toKing = i - 1; toKing > iKingLocation; toKing--) {
      if (updateBoard[toKing][j] !== "Free Squere") {
        freeDown = false;
      }
    }
    if (
      freeDown ||
      (updateBoard[i - 1][j].type === "king" &&
        updateBoard[i - 1][j].color === p.color)
    ) {
      for (var down = i + 1; down <= 7; down++) {
        if (updateBoard[down][j] !== "Free Squere") {
          if (
            (updateBoard[down][j].type === "rook" ||
              updateBoard[down][j].type === "queen") &&
            updateBoard[down][j].color === rookColor
          ) {
            if (down > i && down < iKingLocation) {
              break;
            } else {
              pinArray[3] = "pin-down";
              break;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  return pinArray;
}
function checkRookMove(p, j, i) {
  //FUNCTION FOR ROOK AND QUEEN ONLY
  var whiteKing = getKings()[0];
  var blackKing = getKings()[1];
  var iKingLocation;
  var jKingLocation;
  if (p.color === "black") {
    iKingLocation = whiteKing.iLocation;
    jKingLocation = whiteKing.jLocation;
  } else {
    iKingLocation = blackKing.iLocation;
    jKingLocation = blackKing.jLocation;
  }

  var leftPin = false;
  var rightPin = false;
  var upPin = false;
  var downPin = false;
  var downLeftPin = false;
  var downRightPin = false;
  var upRightPin = false;
  var upLeftPin = false;
  var pinByRookDirection = checkPinByRook(p, j, i);
  var pinByBishopDirection = checkPinByBishop(p, j, i);

  if (pinByRookDirection[0] === "pin-left") {
    leftPin = true;
  }
  if (pinByRookDirection[1] === "pin-right") {
    rightPin = true;
  }
  if (pinByRookDirection[2] === "pin-up") {
    upPin = true;
  }
  if (pinByRookDirection[3] === "pin-down") {
    downPin = true;
  }

  if (pinByBishopDirection[0] === "pin-left-down") {
    downLeftPin = true;
  }
  if (pinByBishopDirection[1] === "pin-right-down") {
    downRightPin = true;
  }
  if (pinByBishopDirection[2] === "pin-left-up") {
    upLeftPin = true;
  }
  if (pinByBishopDirection[3] === "pin-right-up") {
    upRightPin = true;
  }

  //CHECK RIGHT SIDE OF THE CHOSEN ROOK
  for (var right = j + 1; right <= 7; right++) {
    if (updateBoard[i][right] === "Free Squere") {
      if (
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(i + "" + right)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i + "" + right)[0]);
      }
      defenceSquare.push(document.getElementsByName(i + "" + right)[0]);
    } else if (updateBoard[i][right].color !== p.color) {
      if (
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(i + "" + right)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i + "" + right)[0]);
        possibleEatMoveArray.push(
          document.getElementsByName(i + "" + right)[0]
        );
      }
      defenceSquare.push(document.getElementsByName(i + "" + right)[0]);
      if (updateBoard[i][right].type === "king") {
        if (right !== 7) {
          possibleMovesArray.push(
            document.getElementsByName(i + "" + (right + 1))[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "left");
      }
      right = 7;
    } else {
      defenceSquare.push(document.getElementsByName(i + "" + right)[0]);
      right = 7;
    }
  }
  for (var left = j - 1; left >= 0; left--) {
    //CHECK LEFT SIDE OF THE CHOSEN ROOK
    if (updateBoard[i][left] === "Free Squere") {
      if (
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(i + "" + left)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i + "" + left)[0]);
      }
      defenceSquare.push(document.getElementsByName(i + "" + left)[0]);
    } else if (updateBoard[i][left].color !== p.color) {
      if (
        !upPin &&
        !downPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(i + "" + left)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(i + "" + left)[0]);
        possibleEatMoveArray.push(document.getElementsByName(i + "" + left)[0]);
      }
      defenceSquare.push(document.getElementsByName(i + "" + left)[0]);
      if (updateBoard[i][left].type === "king") {
        if (left !== 0) {
          possibleMovesArray.push(
            document.getElementsByName(i + "" + (left - 1))[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "right");
      } else {
        if (left - 1 > 0 && updateBoard[i][left - 1].type === "king") {
          updateBoard[i][left].isPinned = true;
        } else {
          updateBoard[i][left].isPinned = false;
        }
      }
      left = 0;
    } else {
      defenceSquare.push(document.getElementsByName(i + "" + left)[0]);

      left = 0;
    }
  }
  for (var up = i + 1; up <= 7; up++) {
    //CHECK NORTH SIDE OF THE CHOSEN ROOK
    if (updateBoard[up][j] === "Free Squere") {
      if (
        !rightPin &&
        !leftPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(up + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(up + "" + j)[0]);
      }
      defenceSquare.push(document.getElementsByName(up + "" + j)[0]);
    } else if (updateBoard[up][j].color !== p.color) {
      if (
        !rightPin &&
        !leftPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(up + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(up + "" + j)[0]);
        possibleEatMoveArray.push(document.getElementsByName(up + "" + j)[0]);
      }
      defenceSquare.push(document.getElementsByName(up + "" + j)[0]);
      if (updateBoard[up][j].type === "king") {
        if (up !== 7) {
          possibleMovesArray.push(
            document.getElementsByName(up + 1 + "" + j)[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "down");
      } else {
        if (up + 1 < 8 && updateBoard[up + 1][j].type === "king") {
          updateBoard[up][j].isPinned = true;
        } else {
          updateBoard[up][j].isPinned = false;
        }
      }
      up = 7;
    } else {
      defenceSquare.push(document.getElementsByName(up + "" + j)[0]);

      up = 7;
    }
  }
  for (var down = i - 1; down >= 0; down--) {
    //CHECK SOUTH SIDE OF THE CHOSEN ROOK
    if (updateBoard[down][j] === "Free Squere") {
      if (
        !rightPin &&
        !leftPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(down + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(down + "" + j)[0]);
      }
      defenceSquare.push(document.getElementsByName(down + "" + j)[0]);
    } else if (updateBoard[down][j].color !== p.color) {
      if (
        !rightPin &&
        !leftPin &&
        !downLeftPin &&
        !downRightPin &&
        !upLeftPin &&
        !upRightPin
      ) {
        document.getElementsByName(down + "" + j)[0].classList.add("can-move");
        possibleMovesArray.push(document.getElementsByName(down + "" + j)[0]);
        possibleEatMoveArray.push(document.getElementsByName(down + "" + j)[0]);
      }
      defenceSquare.push(document.getElementsByName(down + "" + j)[0]);
      if (updateBoard[down][j].type === "king") {
        if (down !== 0) {
          possibleMovesArray.push(
            document.getElementsByName(down - 1 + "" + j)[0]
          );
        }
        isChecked = true;
        checkPiece = p;
        againstCheckMove(p, "up");
      }
      down = 0;
    } else {
      defenceSquare.push(document.getElementsByName(down + "" + j)[0]);
      down = 0;
    }
  }
  if (isChecked === true && checkOnColor === p.color) {
    var temp = [];
    console.log("CHECK ROUTH BUTTON = " + checkRoutButtons.length);
    for (var i = 0; i < possibleMovesArray.length; i++) {
      for (var j = 0; j < checkRoutButtons.length; j++) {
        if (possibleMovesArray[i] === checkRoutButtons[j]) {
          temp.push(possibleMovesArray[i]);
        } else {
          possibleMovesArray[i].classList.remove("can-move");
        }
      }
    }
    possibleMovesArray = temp;
    for (var i = 0; i < possibleMovesArray.length; i++) {
      possibleMovesArray[i].classList.add("can-move");
    }
    console.log(
      "Possible Moves for " +
      p.type +
      "in i location " +
      i +
      " in j location " +
      j +
      " = " +
      possibleMovesArray.length
    );
  }
}
function disabledBoard() {
  var boardButton = document.getElementsByClassName("chessSqure");
  for (var i = 0; i < boardButton.length; i++) {
    boardButton[i].setAttribute("disabled", "true");
  }
}
function ableBoard() {
  var boardButton = document.getElementsByClassName("chessSqure");
  for (var i = 0; i < boardButton.length; i++) {
    boardButton[i].removeAttribute("disabled");
  }
}
function movePawn(button, piece, i, j) {
  if (Math.abs(piece.iLocation - i) === 2) {
    piece.enPassant = true;
    piece.enPassantTurn = turnCounter;
    // alert("this pawn treathing en Passant")
  }
  if (
    (piece.color === "white" && i === 7) ||
    (piece.color === "black" && i === 0)
  ) {
    switch (piece.color) {
      case "black":
        switchTurn("white");
        break;
      default:
        switchTurn("black");
        break;
    }
    disabledBoard();
    let pieceSelectDiv = document.createElement("DIV");
    pieceSelectDiv.id = "pawn-upgrade";
    pieceSelectDiv.className = "md-6";
    // let pieceSelectDiv = document.getElementById("pawn-upgrade");
    let text = document.createTextNode("");
    $("#turn").after(pieceSelectDiv);
    let upgradeTitle = document.createElement("H4");
    let textH1 = document.createTextNode("Select Piece To Replace The Pawn");
    upgradeTitle.id = "upgrade-title";
    upgradeTitle.appendChild(textH1);
    $("#pawn-upgrade").append(upgradeTitle);

    let rook = document.createElement("BUTTON");
    rook.name = "rook";
    rook.appendChild(text);
    rook.classList.add("upgrade-button");
    rook.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-rook.png" style="width: 100%; height:  100%;"/>';
    rook.addEventListener("mousedown", function () {
      upgradePawn(piece, button, rook);
    });

    let bishop = document.createElement("BUTTON");
    bishop.name = "bishop";
    bishop.appendChild(text);
    bishop.classList.add("upgrade-button");
    bishop.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-bishop.png" style="width: 100%; height:  100%;"/>';
    bishop.addEventListener("mousedown", function () {
      upgradePawn(piece, button, bishop);
    });

    let horse = document.createElement("BUTTON");
    horse.name = "horse";
    horse.appendChild(text);
    horse.classList.add("upgrade-button");
    horse.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-horse.png" style="width: 100%; height:  100%;"/>';
    horse.addEventListener("mousedown", function () {
      upgradePawn(piece, button, horse);
    });

    let queen = document.createElement("BUTTON");
    queen.name = "queen";
    queen.appendChild(text);
    queen.classList.add("upgrade-button");
    queen.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-queen.png" style="width: 100%; height:  100%;"/>';
    queen.addEventListener("mousedown", function () {
      upgradePawn(piece, button, queen);
    });

    pieceSelectDiv.appendChild(rook);
    pieceSelectDiv.appendChild(horse);
    pieceSelectDiv.appendChild(bishop);
    pieceSelectDiv.appendChild(queen);
  }
}
function upgradePawn(piece, button, upgradeButton) {
  if (upgradeButton.name === "queen") {
    piece.type = "queen";
    button.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-queen.png" style="width: 100%; height:  100%;"/>';
    afterMoveAnalyze(piece);
  } else if (upgradeButton.name === "bishop") {
    piece.type = "bishop";
    button.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-bishop.png" style="width: 100%; height:  100%;"/>';
    afterMoveAnalyze(piece);
  } else if (upgradeButton.name === "rook") {
    piece.type = "rook";
    button.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-rook.png" style="width: 100%; height:  100%;"/>';
    afterMoveAnalyze(piece);
  } else {
    piece.type = "horse";
    button.innerHTML =
      '<img class="toolsImages" src="/images/' +
      piece.color +
      '-horse.png" style="width: 100%; height:  100%;"/>';
    afterMoveAnalyze(piece);
  }

  movesArray[movesArray.length - 1].push("pawn upgrade");
  // alert(movesArray[movesArray.length-1])
  ableBoard();
  $("#pawn-upgrade").remove();
  $("#upgrade-title").remove();
  switch (piece.color) {
    case "white":
      switchTurn("white");
      break;
    default:
      switchTurn("black");
      break;
  }
}
function switchTurn(color) {
  if (color === "white") {
    turnColor = "black";
    $("#turn").text("Black Turn");
  } else {
    turnColor = "white";
    $("#turn").text("White Turn");
  }
}
function movePiece(button, piece, i, j, sound) {
  let loader = document.getElementsByClassName("loader-finished")[0];
  if (loader !== undefined) {
    loader.className = "loader";
    loader.hidden = true;
    document.getElementById("save").disabled = false;
  }
  var castle;
  turnCounter++;
  if (turnCounter === 1 && restartButton !== undefined) {
    restartButton.disabled = false;
  }
  if (turnCounter === 1 && undoButton !== undefined) {
    undoButton.disabled = false;
  }
  if (turnCounter !== 0 && saveButton !== undefined) {
    saveButton.disabled = false;
  }
  if (piece.color === "white") {
    turnColor = "black";
    $("#turn").text("Black Turn");
    if (piece.type === "king" && piece.move === 0) {
      if (clickButtonArray[1].name === "02") {
        //CASTLE WHITE QUEEN SIDE
        document.getElementsByName("03")[0].innerHTML =
          document.getElementsByName("00")[0].innerHTML;
        document.getElementsByName("00")[0].innerHTML = "";
        updateBoard[0][3] = updateBoard[0][0];
        updateBoard[0][3].jLocation = 3;
        updateBoard[0][0] = "Free Squere";
        checkRookMove(updateBoard[0][3], 3, 0);
        castle = "white queen side";
      } else if (clickButtonArray[1].name === "06") {
        //CASTLE WHITE KING SIDE
        document.getElementsByName("05")[0].innerHTML =
          document.getElementsByName("07")[0].innerHTML;
        document.getElementsByName("07")[0].innerHTML = "";
        updateBoard[0][5] = updateBoard[0][7];
        updateBoard[0][5].jLocation = 5;
        updateBoard[0][7] = "Free Squere";
        checkRookMove(updateBoard[0][5], 5, 0);
        castle = "white king side";
      }
    }
  } else {
    turnColor = "white";
    $("#turn").text("White Turn");
    if (piece.type === "king" && piece.move === 0) {
      //CASTLE BLACK QUEEN SIDE
      if (clickButtonArray[1].name === "72") {
        document.getElementsByName("73")[0].innerHTML =
          document.getElementsByName("70")[0].innerHTML;
        document.getElementsByName("70")[0].innerHTML = "";
        updateBoard[7][3] = updateBoard[7][0];
        updateBoard[7][3].jLocation = 3;
        updateBoard[7][0] = "Free Squere";
        checkRookMove(updateBoard[7][3], 3, 7);
        castle = "black queen side";
      } else if (clickButtonArray[1].name === "76") {
        //CASTLE BLACK KING SIDE
        document.getElementsByName("75")[0].innerHTML =
          document.getElementsByName("77")[0].innerHTML;
        document.getElementsByName("77")[0].innerHTML = "";
        updateBoard[7][5] = updateBoard[7][7];
        updateBoard[7][5].jLocation = 5;
        updateBoard[7][7] = "Free Squere";
        checkRookMove(updateBoard[7][5], 5, 7);
        castle = "black king side";
      }
    }
  }
  pieceMoved = piece;
  var eatenPiece = null;
  if (sound === "eat") {
    eatenPiece = updateBoard[i][j];
  }
  if (piece.move === 0) {
    piece.move = 1;
    piece.firstTurnNumber = turnCounter;
  }
  movesArray.push([
    clickButtonArray[0],
    clickButtonArray[1],
    i,
    j,
    piece,
    eatenPiece,
    isChecked, castle
  ]);
  clickButtonArray[0].classList.toggle("clicked");
  clickButtonArray[1].innerHTML = clickButtonArray[0].innerHTML;
  clickButtonArray[0].innerHTML = "";
  if (piece.type === "pawn") {
    movePawn(clickButtonArray[1], piece, i, j);
  }
  clickCount = 0;
  updateBoard[i][j] = piece;
  piece.iLocation = i;
  piece.jLocation = j;
  updateBoard[Number(clickButtonArray[0].name[0])][
    Number(clickButtonArray[0].name[1])
  ] = "Free Squere";
  console.log(
    "new i location:" +
    i +
    " new j location:" +
    j +
    "type of moved piece:" +
    updateBoard[i][j].type
  );
  makeSound(sound);

  afterMoveAnalyze(piece);
}
function makeSound(sound) {
  switch (sound) {
    case "eat":
      var eat = new Audio("/sounds/capture.mp3");
      eat.play();
      break;

    case "board":
      var boardSound = new Audio("/sounds/board-start.mp3");
      boardSound.play();
      break;

    default:
      var move = new Audio("/sounds/chess-move.mp3");
      move.play();
      break;
  }
}
function afterMoveAnalyze(piece) {
  if (piece.color === "white") {
    getAllPossibleMovesWhite();
  } else {
    getAllPossibleMovesBlack();
  }
  resetPossibleMove();
  if (isChecked) {
    if (piece.type === "king") {
      isChecked = false;
      checkRout = [];
      checkRoutButtons = [];
    } else if (piece.color !== checkPiece.color) {
      isChecked = false;
      checkRout = [];
      checkRoutButtons = [];
    }
  }
  turnReset();
  if (isChecked) {
    if (piece.color === "white") {
      checkOnColor = "black";
      var kingMovesCounter = blackKingMoveCounter();
      var pawnsMovesCounter = blackPawnsMoveCounter();
      var pm = getAllPossibleMovesBlack();
      var afterCheckPossibleMoves = pm + pawnsMovesCounter + kingMovesCounter;

      if (afterCheckPossibleMoves === 0) {
        alert("WHITE Won By Check-Mate!!!");
      } else {
        alert("CHECK ON " + checkOnColor);
      }
    } else {
      checkOnColor = "white";
      var kingMovesCounter = whiteKingMoveCounter();
      var pawnsMovesCounter = whitePawnsMoveCounter();
      var pm = getAllPossibleMovesWhite();
      var afterCheckPossibleMoves = pm + pawnsMovesCounter + kingMovesCounter;

      if (afterCheckPossibleMoves === 0) {
        alert("BLACK Won By Check-Mate!!!");
      } else {
        alert("CHECK ON " + checkOnColor);
      }
    }
  }

  resetPossibleMove();
}
function whitePawnsMoveCounter() {
  var counter = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j].color === "white" &&
        updateBoard[i][j].type === "pawn"
      ) {
        checkPieceMove(updateBoard[i][j]);
        counter += possibleMovesArray.length;
      }
    }
  }
  return counter;
}
function blackPawnsMoveCounter() {
  var counter = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j].color === "black" &&
        updateBoard[i][j].type === "pawn"
      ) {
        checkPieceMove(updateBoard[i][j]);
        counter = counter + possibleMovesArray.length;
      }
    }
  }
  return counter;
}
function whiteKingMoveCounter() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j] !== "Free Squere" &&
        updateBoard[i][j].color === "white" &&
        updateBoard[i][j].type === "king"
      ) {
        checkPieceMove(updateBoard[i][j]);
      }
    }
  }

  return possibleMovesArray.length;
}
function blackKingMoveCounter() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j] !== "Free Squere" &&
        updateBoard[i][j].color === "black" &&
        updateBoard[i][j].type === "king"
      ) {
        // var kingButton = document.getElementsByName(i + "" + j)[0];
        // pieceSelectDived(kingButton, i, j);
        checkKingMove(updateBoard[i][j], j, i);
      }
    }
  }
  return possibleMovesArray.length;
}
function turnReset() {
  if (clickButtonArray.length !== 0) {
    clickButtonArray[0].classList.remove("clicked");
  }
  resetPossibleMove();
  clickCount = 0;
  clickButtonArray = [];
  defenceSquare = [];

  for (var i = 0; i < 8; i++) {
    //RESET EN-PASSANT
    for (var j = 0; j < 8; j++) {
      if (
        updateBoard[i][j].type === "pawn" &&
        turnCounter - updateBoard[i][j].enPassantTurn > 0
      ) {
        updateBoard[i][j].enPassant = false;
        enPassantDirection = "";
      }
    }
  }
}
function resetPossibleMove() {
  //RESET THE POSSIBLE MOVES OF ALL PIECES ON BOARD
  if (possibleMovesArray.length !== 0) {
    for (var i = 0; i < possibleMovesArray.length; i++) {
      possibleMovesArray[i].classList.remove("can-move");
    }
  }
  possibleMovesArray = [];
  possibleEatMoveArray = [];
  // defenceSquare = [];
}
function resetBoardMoves() {
  for (var i = 0; i < possibleMovesArray.length; i++) {
    possibleMovesArray[i].classList.remove("can-move");
  }
}
function addEatenPiece(color, src) {
  // ADDING THE EATEN PIECE TO A DIV IN THE HTML
  if (color === "black") {
    // var eatenPiece = new ChessPiece(type, "black", iLocation, jLocation);
    var eatenBlackButton = document.createElement("BUTTON");
    eatenBlackButton.name = "eaten";
    eatenBlackButton.id = "" + turnCounter;
    blackEatenPieces.push(eatenBlackButton);
    eatenBlackDiv.appendChild(eatenBlackButton);
    eatenBlackButton.innerHTML = src;
    eatenBlackButton.classList.add("eaten-piece");
  } else {
    var eatenWhiteButton = document.createElement("BUTTON");
    eatenWhiteButton.name = "eaten";
    eatenWhiteButton.id = "" + turnCounter;
    whiteEatenPieces.push(eatenWhiteButton);
    eatenWhiteDiv.appendChild(eatenWhiteButton);
    eatenWhiteButton.innerHTML = src;
    eatenWhiteButton.classList.add("eaten-piece");
  }
}

function Timer(color, timer) {
  if (timer === null) {
    time = Number(
      document.querySelector("." + color + "-time-title").innerHTML
    );
  } else {
    time = timer;
  }

  let [seconds, minutes, hours] = [0, 0, 0];
  let timerRef = document.querySelector("." + color + "-time-title");
  if (time >= 60) {
    hours = Math.floor(time / 60);
    minutes = time % 60;
  } else {
    minutes = time;
  }
  console.log("hours = " + hours + " minutes = " + minutes);
  if (minutes < 10) {
    timerRef.innerHTML = "0" + hours + " : " + "0" + minutes + " : 00";
  } else {
    timerRef.innerHTML = "0" + hours + " : " + minutes + " : 00";
  }

  let int = null;
  // let turn = document.getElementById("turn");
  // turn.addEventListener("change", () => {
  //   if (int !== null) {
  //     clearInterval(int);
  //   }
  int = setInterval(displayTimer, 1000);
  // });

  function displayTimer() {
    if (seconds == 0 && minutes == 0 && hours == 0) {
      alert("game over");
    }
    if ((hours == 2 || hours == 1) && minutes == 0 && seconds == 0) {
      seconds = 60;
      minutes = 59;
      hours--;
    }
    if (seconds == 0 && minutes != 0 && turnCounter != 0) {
      minutes--;
    }
    if (seconds == 0) {
      switch (turnCounter) {
        case 0:
          if (color === "white") {
            minutes--;
            seconds = 60;
          } else {
            seconds = 0;
          }
          break;

        default:
          seconds = 60;
          break;
      }
    }
    if (color === turnColor && !isPaused) {
      seconds--;
    }
    if (isRestartBlack === true && color === "black") {
      isRestartBlack = false;
      if (time >= 60) {
        hours = Math.floor(time / 60);
        minutes = time % 60;
      } else {
        minutes = time;
      }
      console.log("hours = " + hours + " minutes = " + minutes);
      if (minutes < 10) {
        timerRef.innerHTML = "0" + hours + " : " + "0" + minutes + " : 00";
      } else {
        timerRef.innerHTML = "0" + hours + " : " + minutes + " : 00";
      }
      seconds = 0;
    } else if (isRestartWhite === true && color === "white") {
      isRestartWhite = false;
      if (time >= 60) {
        hours = Math.floor(time / 60);
        minutes = time % 60;
      } else {
        minutes = time;
      }
      console.log("hours = " + hours + " minutes = " + minutes);
      if (minutes < 10) {
        timerRef.innerHTML = "0" + hours + " : " + "0" + minutes + " : 00";
      } else {
        timerRef.innerHTML = "0" + hours + " : " + minutes + " : 00";
      }
      seconds = 0;
    }

    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    timerRef.innerHTML = `${h} : ${m} : ${s}`;
    if (color === "white") {
      whiteTimer = [h, m, s];
    } else {
      blackTimer = [h, m, s];
    }
  }
}
