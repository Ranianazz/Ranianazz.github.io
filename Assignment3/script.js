const player = document.getElementById("player");
const rock = document.getElementById("rock");
const gameOver = document.getElementById("gameOver");
const replayBtn = document.getElementById("replayBtn");
const background = document.getElementById("background");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");

// Game state variables
let gameStarted = false;
let jumping = false;
let gameRunning = false;
let jumpAnimation;
let score = 0;
let rockPassed = false;
let jumpCount = 0;

// Difficulty variables
let baseSpeed = 2.5;
let currentSpeed = baseSpeed;
let speedIncrease = 0.1;
let minSpeed = 1.0;
let backgroundSpeed = 15;

function startGame() {
  gameStarted = true;
  gameRunning = true;
  startScreen.style.display = "none";
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  currentSpeed = baseSpeed;

  background.style.animationPlayState = "running";
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";
}

function triggerSquish() {
  player.classList.remove("squish");
  void player.offsetWidth; // Force reflow
  player.classList.add("squish");
}

function jump() {
  if (jumpCount >= 2 || !gameRunning) return;

  jumpCount++;
  jumping = true;
  triggerSquish(); // Squish at start of jump

  const jumpHeight = 450;
  const jumpDuration = 500;
  const startTime = Date.now();

  cancelAnimationFrame(jumpAnimation);

  function animateJump() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / jumpDuration, 1);

    if (progress < 0.5) {
      player.style.bottom =
        50 + jumpHeight * (1 - Math.pow(progress * 2 - 1, 2)) + "px";
    } else {
      player.style.bottom =
        50 + jumpHeight * Math.pow((progress - 0.5) * 2, 2) + "px";
    }

    if (progress < 1) {
      jumpAnimation = requestAnimationFrame(animateJump);
    } else {
      player.style.bottom = "50px";
      triggerSquish(); // Squish on landing
      jumping = false;
      jumpCount = 0;
    }
  }

  animateJump();
}

function updateRockSpeed() {
  rock.style.animation = "none";
  rock.offsetHeight;
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";

  backgroundSpeed = Math.max(10, backgroundSpeed - 0.5);
  background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const rockRect = rock.getBoundingClientRect();

  return !(
    playerRect.right < rockRect.left + 40 ||
    playerRect.left > rockRect.right - 40 ||
    playerRect.bottom < rockRect.top + 30 ||
    playerRect.top > rockRect.bottom - 30
  );
}

function updateScore() {
  const playerRect = player.getBoundingClientRect();
  const rockRect = rock.getBoundingClientRect();

  if (rockRect.right < playerRect.left && !rockPassed) {
    rockPassed = true;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    if (currentSpeed > minSpeed) {
      currentSpeed -= speedIncrease;
      updateRockSpeed();
    }
  }

  if (rockRect.left > playerRect.right) {
    rockPassed = false;
  }
}

function endGame() {
  gameRunning = false;
  gameOver.style.display = "block";

  // Trigger the melting effect on the player
  player.classList.add("melt");

  // Stop the rock and background animations
  rock.style.animationPlayState = "paused";
  background.style.animationPlayState = "paused";
  cancelAnimationFrame(jumpAnimation);

  // Show the restart button when the game ends
  replayBtn.style.display = "inline-block";
}

function resetGame() {
  player.style.bottom = "50px";
  player.classList.remove("melt"); // Reset melt effect
  jumping = false;
  jumpCount = 0;

  currentSpeed = baseSpeed;
  backgroundSpeed = 15;

  rock.style.animation = "none";
  rock.offsetHeight;
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";

  background.style.animation = "none";
  background.offsetHeight;
  background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
  background.style.animationPlayState = "running";

  gameOver.style.display = "none";
  replayBtn.style.display = "none"; // Hide restart button after reset

  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  rockPassed = false;

  startGame(); // Restart the game
}

// Event listener for clicking anywhere to start the game and jump
document.addEventListener("click", (e) => {
  if (!gameStarted) {
    startGame();
  } else if (gameRunning) {
    jump();
  }
});

// Event listener for the start button
startBtn.addEventListener("click", () => {
  startGame();
});

// Restart the game when the restart button is clicked
replayBtn.addEventListener("click", resetGame);

// Init
background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
background.style.animationPlayState = "paused";
rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
rock.style.animationPlayState = "paused";

function gameLoop() {
  if (gameRunning) {
    if (checkCollision()) {
      endGame();
    }
    updateScore();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
