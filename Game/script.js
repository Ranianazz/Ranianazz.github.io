const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const rock = document.getElementById("rock");
const background = document.getElementById("background");

const startScreen = document.getElementById("startScreen");
const singlePlayerBtn = document.getElementById("singlePlayerBtn");
const multiplayerBtn = document.getElementById("multiplayerBtn");
const jumpBtn1 = document.getElementById("jumpBtn1");
const jumpBtn2 = document.getElementById("jumpBtn2");
const replayBtn = document.getElementById("replayBtn");

const scoreDisplay1 = document.getElementById("score1");
const scoreDisplay2 = document.getElementById("score2");
const gameOverText = document.getElementById("gameOver");

let gameRunning = false;
let multiplayer = false;

const players = [
  { element: player1, jumping: false, score: 0, active: false, passed: false },
  { element: player2, jumping: false, score: 0, active: false, passed: false },
];

let currentSpeed = 2500;
const speedIncrease = 50;
const minSpeed = 800;

function startGame(isMultiplayer) {
  multiplayer = isMultiplayer;
  gameRunning = true;
  currentSpeed = 2500;

  // Reset player states
  players[0].active = true;
  players[1].active = multiplayer;

  players.forEach((player) => {
    player.jumping = false;
    player.score = 0;
    player.passed = false;
    player.element.style.bottom = "50px";
    player.element.style.display = player.active ? "block" : "none";
  });

  scoreDisplay1.textContent = "Player 1: 0";
  scoreDisplay2.textContent = "Player 2: 0";
  scoreDisplay2.style.display = multiplayer ? "block" : "none";
  jumpBtn2.style.display = multiplayer ? "inline-block" : "none";
  jumpBtn1.style.display = "inline-block";

  startScreen.style.display = "none";
  gameOverText.style.display = "none";

  rock.style.animation = `moveRock ${currentSpeed / 1000}s linear infinite`;
  rock.style.animationPlayState = "running";
  background.style.animationPlayState = "running";

  rock.style.right = "-150px";

  gameLoop();
}

function jump(index) {
  const player = players[index];
  if (!player.active || player.jumping) return;

  player.jumping = true;
  player.element.style.bottom = "200px";

  setTimeout(() => {
    player.element.style.bottom = "50px";
    player.jumping = false;
  }, 600);
}

function checkCollision(index) {
  const player = players[index];
  if (!player.active) return false;

  const rockRect = rock.getBoundingClientRect();
  const playerRect = player.element.getBoundingClientRect();

  const collided = !(
    playerRect.top > rockRect.bottom ||
    playerRect.bottom < rockRect.top ||
    playerRect.right < rockRect.left + 20 ||
    playerRect.left > rockRect.right - 20
  );

  if (collided) {
    eliminatePlayer(index);
  }

  return collided;
}

function eliminatePlayer(index) {
  players[index].active = false;
  players[index].element.style.display = "none";
  if (index === 0) jumpBtn1.style.display = "none";
  if (index === 1) jumpBtn2.style.display = "none";

  if (!players[0].active && (!multiplayer || !players[1].active)) {
    endGame();
  }
}

function updateScore() {
  const rockRect = rock.getBoundingClientRect();

  players.forEach((player, index) => {
    if (!player.active) return;

    const playerRect = player.element.getBoundingClientRect();

    // Only count score if rock passed player
    if (rockRect.right < playerRect.left && !player.passed) {
      player.passed = true;
      player.score++;
      if (index === 0) {
        scoreDisplay1.textContent = `Player 1: ${player.score}`;
      } else {
        scoreDisplay2.textContent = `Player 2: ${player.score}`;
      }

      // Increase difficulty
      if (currentSpeed > minSpeed) {
        currentSpeed -= speedIncrease;
        updateRockSpeed();
      }
    }

    // Reset passed flag when rock is back around
    if (rockRect.left > playerRect.right) {
      player.passed = false;
    }
  });
}

function updateRockSpeed() {
  rock.style.animation = "none";
  void rock.offsetWidth; // force reflow
  rock.style.animation = `moveRock ${currentSpeed / 1000}s linear infinite`;
}

function gameLoop() {
  if (!gameRunning) return;

  if (players[0].active) checkCollision(0);
  if (multiplayer && players[1].active) checkCollision(1);

  updateScore();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  rock.style.animationPlayState = "paused";
  background.style.animationPlayState = "paused";
  gameOverText.style.display = "block";
}

function resetGame() {
  // Reset game visuals and logic
  gameRunning = false;
  rock.style.animation = "none";
  background.style.animationPlayState = "paused";

  players.forEach((player) => {
    player.jumping = false;
    player.score = 0;
    player.active = false;
    player.passed = false;
    player.element.style.bottom = "50px";
    player.element.style.display = "none";
  });

  scoreDisplay1.textContent = "Player 1: 0";
  scoreDisplay2.textContent = "Player 2: 0";
  jumpBtn1.style.display = "none";
  jumpBtn2.style.display = "none";
  scoreDisplay2.style.display = "none";

  gameOverText.style.display = "none";
  startScreen.style.display = "flex";
}

singlePlayerBtn.addEventListener("click", () => startGame(false));
multiplayerBtn.addEventListener("click", () => startGame(true));
jumpBtn1.addEventListener("click", () => jump(0));
jumpBtn2.addEventListener("click", () => jump(1));
replayBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump(0);
  if (e.code === "ArrowUp" && multiplayer) jump(1);
});
