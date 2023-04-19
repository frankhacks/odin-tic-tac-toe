const Gameboard = (() => {
  //Array to hold the state of board
  let board = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let boardHTML = "";
    board.forEach((square, index) => {
      boardHTML += `<div class="cell" id="cell-${index}">${square}</div>`;
    });
    document.querySelector("#board").innerHTML = boardHTML;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", gameController.handleClick);
    });
  };

  const update = (index, value) => {
    board[index] = value;
    render();
  };

  const getGameboard = () => board;

  //const getBoard = () => board;

  return { render, update, getGameboard /*getBoard*/ };
})();

const createPlayers = (name, sign) => {
  return { name, sign };
};

const gameController = (() => {
  //const board = gameBoard();
  let players = [];
  let currentPlayer;
  let gameOver;

  const start = () => {
    players = [
      createPlayers(document.querySelector("#player1").value, "X"),
      createPlayers(document.querySelector("#player2").value, "O"),
    ];
    currentPlayer = 0;
    gameOver = false;
    Gameboard.render();
  };

  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);

    if (Gameboard.getGameboard()[index] !== "") return;
    Gameboard.update(index, players[currentPlayer].sign);

    if (winCheck(Gameboard.getGameboard(), players[currentPlayer].mark)) {
      gameOver = true;
      ScreenController.renderMessage(`${players[currentPlayer].name} wins!`);
    } else if (tieCheck(Gameboard.getGameboard())) {
      gameOver = true;
      ScreenController.renderMessage(`It's a tie`);
    }

    currentPlayer = currentPlayer === 0 ? 1 : 0;
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    Gameboard.render();
    gameOver = false;
    currentPlayer = 0;
    document.querySelector("#message").innerHTML = "";
  };

  function winCheck(board) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }

  function tieCheck(board) {
    return board.every((cell) => cell !== "");
  }

  return { start, handleClick, restart };
})();

const ScreenController = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerHTML = message;
  };
  return { renderMessage };
})();

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  gameController.restart();
});

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  gameController.start();
});
