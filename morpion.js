class Morpion {
  constructor(player) {
    this.player = player;
    this.ia = player == "J1" ? "J2" : "J1";
    this.map = [];
    this.turn = 0;
    for (let i = 0; i < 3; i++) {
      this.map[i] = [];
      for (let j = 0; j < 3; j++) {
        this.map[i][j] = "EMPTY";
        document.getElementById(this.getZone(i, j)).onclick = () =>
          this.playerTurn(i, j);
      }
    }
    this.finish = false;
    if (this.ia === "J1") this.iaTurn();
  }

  getZone = (x, y) => {
    if (y == 0) return "A" + (x + 1);
    else if (y == 1) return "B" + (x + 1);
    else return "C" + (x + 1);
  };

  checkDraw = () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.map[x][y] === "EMPTY") return false;
      }
    }
    return true;
  };

  fillGrid = (x, y, player) => {
    const image = player == this.player ? "croix" : "rond";
    const zone = this.getZone(x, y);

    if (this.map[x][y] != "EMPTY") return false;
    this.map[x][y] = player;
    document.getElementById(
      zone
    ).style.backgroundImage = `url(image-morpion/${image}.png)`;
    this.turn++;
    this.checking(player);
    return true;
  };

  checking = (player) => {
    const one = this.map[0][0];
    const two = this.map[0][1];
    const three = this.map[0][2];
    const four = this.map[1][0];
    const five = this.map[1][1];
    const six = this.map[1][2];
    const seven = this.map[2][0];
    const eight = this.map[2][1];
    const nine = this.map[2][2];
    if (
      (one === two && one === three && one != "EMPTY") ||
      (four === five && four === six && four != "EMPTY") ||
      (seven === eight && seven === nine && seven != "EMPTY") ||
      (one === five && one === nine && one != "EMPTY") ||
      (three === five && three === seven && three != "EMPTY") ||
      (one === four && one === seven && one != "EMPTY") ||
      (two === five && two === eight && two != "EMPTY") ||
      (three === six && three === nine && three != "EMPTY")
    ) {
      this.finish = true;
      if (player == this.ia) {
        document.getElementById("win").textContent = "L'IA a gagné !";
      } else if (player == this.player) {
        document.getElementById("win").textContent = "Tu as battu l'IA !";
      }
    } else if (this.checkDraw()) {
      document.getElementById("win").textContent = "Vous êtes à égalité";
      this.finish = true;
    }
  };

  playerTurn = (x, y) => {
    if (this.finish) return;
    if (!this.fillGrid(x, y, this.player))
      return alert("La case n'est pas vide");
    else if (!this.finish) this.iaTurn();
  };

  // MOTHERFUCKING IA

  winningLine(a, b, c) {
    return a == b && b == c && a != "EMPTY";
  }

  checkWinner() {
    let winner = null;
    // horizontal
    for (let i = 0; i < 3; i++) {
      if (this.winningLine(this.map[i][0], this.map[i][1], this.map[i][2])) {
        winner = this.map[i][0];
      }
    }
    // Vertical
    for (let i = 0; i < 3; i++) {
      if (this.winningLine(this.map[0][i], this.map[1][i], this.map[2][i])) {
        winner = this.map[0][i];
      }
    }
    // Diagonal
    if (this.winningLine(this.map[0][0], this.map[1][1], this.map[2][2])) {
      winner = this.map[0][0];
    }
    if (this.winningLine(this.map[2][0], this.map[1][1], this.map[0][2])) {
      winner = this.map[2][0];
    }

    if (winner == null && this.turn == 9) {
      return "draw";
    } else {
      return winner;
    }
  }

  minimax(board, depth, alpha, beta, isMaximizing) {
    let move;
    let result = this.checkWinner();
    if (result == this.ia) return 10 - depth;
    else if (result == this.player) return depth - 10;
    else if (result != null) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "EMPTY") {
            board[i][j] = this.ia;
            this.turn++;
            let score = this.minimax(board, depth + 1, alpha, beta, false);
            board[i][j] = "EMPTY";
            this.turn--;
            if (score > bestScore) {
              bestScore = score;
              move = { i, j };
            }
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
              break;
            }
          }
        }
      }
      if (depth === 0) {
        return move;
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "EMPTY") {
            board[i][j] = this.player;
            this.turn++;
            let score = this.minimax(board, depth + 1, alpha, beta, true);
            board[i][j] = "EMPTY";
            this.turn--;
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) {
              break;
            }
          }
        }
      }
      return bestScore;
    }
  }

  iaTurn = () => {
    let move = this.minimax(this.map, 0, -Infinity, Infinity, true);

    this.fillGrid(move.i, move.j, this.ia);
  };
}

const whosFirst = () => {
  let player;
  while (!player == "1" || !player == "2") {
    player = prompt(
      "Taper 1 pour jouer en premier ou 2 pour laisser la main à l'IA?"
    );
  }
  if (player == "1") {
    player = "J1";
  } else if (player == "2") {
    player = "J2";
  }

  return player;
};

const morpion = new Morpion(whosFirst());
