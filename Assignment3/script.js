const player = document.getElementById("player");
const rock = document.getElementById("rock");
const gameOver = document.getElementById("gameOver");
const jumpBtn = document.getElementById("jumpBtn");
const replayBtn = document.getElementById("replayBtn");
const background = document.getElementById("background");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const scoreDisplay = document.getElementById("score");

let gameStarted = false;
let jumping = false;
let gameRunning = false;
let jumpAnimation;
let score = 0;
let rockPassed = false;

function startGame() {
  gameStarted = true;
  gameRunning = true;
  startScreen.style.display = "none";
  score = 0;
  scoreDisplay.textContent = "Score: 0";

  // Start animations
  background.style.animationPlayState = "running";
  rock.style.animationPlayState = "running";
}

function jump() {
  if (!jumping && gameRunning) {
    jumping = true;
    const jumpHeight = 450;
    const jumpDuration = 500;
    const startTime = Date.now();

    cancelAnimationFrame(jumpAnimation);

    function animateJump() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / jumpDuration, 1);

      // Quadratic easing for smooth jump arc
      if (progress < 0.5) {
        // Rising
        player.style.bottom =
          50 + jumpHeight * (1 - Math.pow(progress * 2 - 1, 2)) + "px";
      } else {
        // Falling
        player.style.bottom =
          50 + jumpHeight * Math.pow((progress - 0.5) * 2, 2) + "px";
      }

      if (progress < 1) {
        jumpAnimation = requestAnimationFrame(animateJump);
      } else {
        player.style.bottom = "50px";
        jumping = false;
      }
    }

    animateJump();
  }
}

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    jump();
  }
});

jumpBtn.addEventListener("click", jump);
startBtn.addEventListener("click", startGame);

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

  // Check if rock has passed the player without collision
  if (rockRect.right < playerRect.left && !rockPassed) {
    rockPassed = true;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  // Reset the flag when rock is back to the right of the player
  if (rockRect.left > playerRect.right) {
    rockPassed = false;
  }
}

function gameLoop() {
  if (gameRunning) {
    if (checkCollision()) {
      endGame();
    }
    updateScore();
  }
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  gameOver.style.display = "block";
  rock.style.animationPlayState = "paused";
  background.style.animationPlayState = "paused";
  cancelAnimationFrame(jumpAnimation);
}

function resetGame() {
  // Reset player
  player.style.bottom = "50px";
  jumping = false;

  // Reset rock
  rock.style.animation = "none";
  rock.offsetHeight;
  rock.style.animation = "moveRock 2.5s linear infinite";
  rock.style.animationPlayState = "running";

  // Reset background
  background.style.animation = "none";
  background.offsetHeight;
  background.style.animation = "scrollBg 15s linear infinite";
  background.style.animationPlayState = "running";

  // Reset game state
  gameOver.style.display = "none";
  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  rockPassed = false;
}

replayBtn.addEventListener("click", resetGame);

// Initialize game with animations paused
background.style.animationPlayState = "paused";
rock.style.animationPlayState = "paused";
gameLoop();
