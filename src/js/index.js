(function gameLoop() {
  const gameSize = 500;
  const cellSize = 5;
  const lifeCicle = 1000; //ms
  const p = 0.9;
  let game = generateField(gameSize, cellSize, p);
  setInterval(() => {
    if (isRuning()) {
      updateGameView(game);
      game = applyGameLogic(game);
    }
  }, lifeCicle);
})();

function generateField(gameSize, celSize, tsh) {
  const game = [];
  const n = gameSize / celSize;
  for (let k = 0; k < n; k++) {
    const newLine = [];
    for (let i = 0; i < n; i++) {
      const p = Math.random();
      const r = p > tsh ? 1 : 0;
      newLine.push(r);
    }
    game.push(newLine);
  }

  return game;
}

async function updateGameView(field) {
  const gameArea = document.querySelector(".game");
  gameArea.innerHTML = null;
  for (const line of field) {
    for (const slot of line) {
      const cel = document.createElement("div");
      if (slot === 1) {
        cel.classList.add("cel", "alive");
      } else {
        cel.classList.add("cel", "dead");
      }
      gameArea.appendChild(cel);
    }
  }
}

function countNeighbors(field, x, y) {
  const range = [-1, 0, 1];
  let count = 0;
  for (const r of range) {
    for (const p of range) {
      const [x_n, y_n] = checkAndTransformCoordinates(x, y, r, p, field.length);
      if (!(x === r && y === p) && field[x_n][y_n] === 1) {
        count += 1;
      }
    }
  }
  return count;
}
// 41vedsu9

function checkAndTransformCoordinates(x, y, r, p, maxCells) {
  let x_ = x + r;
  let y_ = y + p;

  const limit = maxCells - 1;

  x_ = x_ > limit ? 0 : x_ < 0 ? limit : x_;
  y_ = y_ > limit ? 0 : y_ < 0 ? limit : y_;

  return [x_, y_];
}

function applyGameLogic(gameState) {
  const newState = new Array(gameState?.length)
    .fill(0)
    .map(() => new Array(gameState?.length).fill(0));

  for (let x = 0; x < gameState?.length; x++) {
    for (let y = 0; y < gameState?.length; y++) {
      const neib = countNeighbors(gameState, x, y);
      if (gameState[x][y] === 1) {
        if (neib < 2 || neib > 3) {
          newState[x][y] = 0; // died
        } else if (neib === 2 || neib === 3) {
          newState[x][y] = 1; // survive
        }
      }
      if (gameState[x][y] === 0 && neib === 3) {
        newState[x][y] = 1; // born
      }
    }
  }
  return newState;
}

function toggle() {
  const pauseButton = document.querySelector(".toggle");
  let state = pauseButton.textContent;
  if (state === "pause") {
    pauseButton.textContent = "play";
    state = "pause";
  } else if (state === "play") {
    pauseButton.textContent = "pause";
    state = "play";
  } else {
    pauseButton.textContent = "play";
    state = "pause";
  }
}

function isRuning() {
  return document.querySelector(".toggle").textContent === "pause";
}
