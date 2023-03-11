import {
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
  TILE_STATUS,
} from "./minesweeper.js";

const BOARD_SIZE = 20;
const NUMBER_OF_MINES = 64;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const timer = document.querySelector(".timer");

if (
  window.PublicKeyCredential &&
  PublicKeyCredential.isConditionalMediationAvailable()
)
  console.log("WebAuthn supported");

boardElement.style.setProperty("--size", BOARD_SIZE);

resizeBoard();

addEventListener("resize", (event) => resizeBoard());

let gameStarted = false;
let gameEnded = false;
let tenths = 0;

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      if (!gameStarted && !gameEnded) {
        gameStarted = true;
        setInterval(timeCount, 100);
      }
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      if (gameStarted) {
        e.preventDefault();
        markTile(tile);
      }
    });
  });
});

function resizeBoard() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  if (windowWidth > 900) {
    let actualWidth =
      windowWidth - document.querySelector(".timer").offsetWidth;

    let minTileSize = Math.floor(
      (Math.min(actualWidth, windowHeight) - (10 + 2 * (BOARD_SIZE - 1))) /
        BOARD_SIZE
    );
    boardElement.style.setProperty("--tileSize", `${minTileSize}px`);
  } else {
    let actualHeight =
      windowHeight - document.querySelector(".timer").offsetHeight;

    let minTileSize = Math.floor(
      (Math.min(windowWidth, actualHeight) - (10 + 2 * (BOARD_SIZE - 1))) /
        BOARD_SIZE
    );
    boardElement.style.setProperty("--tileSize", `${minTileSize}px`);
  }
}

function timeCount() {
  if (!gameEnded) {
    tenths++;
    if (tenths < 9999) {
      if (tenths < 100)
        timer.textContent = `00${Math.floor(tenths / 10)}.${tenths % 10}` + "s";
      else if (tenths < 1000)
        timer.textContent = `0${Math.floor(tenths / 10)}.${tenths % 10}` + "s";
      else
        timer.textContent = `${Math.floor(tenths / 10)}.${tenths % 10}` + "s";
    } else {
      timer.textContent = "999.9s";
      clearInterval();
    }
  }
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    gameEnded = true;
    clearInterval();
  }

  if (win) {
    alert("You win! :D\n" + "Time: " + timer.textContent);
  }

  if (lose) {
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUS.MARKED) markTile(tile);
        if (tile.mine) {
          revealTile(board, tile);
        }
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
