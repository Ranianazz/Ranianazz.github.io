const player = document.getElementById("player");
const rock = document.getElementById("rock");
const gameOver = document.getElementById("gameOver");
const jumpBtn = document.getElementById("jumpBtn");
const replayBtn = document.getElementById("replayBtn");
const background = document.getElementById("background");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const scoreDisplay = document.getElementById("score");

// Game state variables
let gameStarted = false;
let jumping = false;
let gameRunning = false;
let jumpAnimation;
let score = 0;
let rockPassed = false;

// Difficulty variables
let baseSpeed = 2.5; // Initial rock animation duration (seconds)
let currentSpeed = baseSpeed;
let speedIncrease = 0.1; // Speed increase per successful jump (seconds)
let minSpeed = 1.0; // Maximum difficulty (minimum duration)
let backgroundSpeed = 15; // Background animation duration

function startGame() {
  gameStarted = true;
  gameRunning = true;
  startScreen.style.display = "none";
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  currentSpeed = baseSpeed;

  // Start animations
  background.style.animationPlayState = "running";
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
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

function updateRockSpeed() {
  // Calculate new speed and update animation
  rock.style.animation = "none";
  rock.offsetHeight; // Trigger reflow
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";

  // Also increase background speed slightly for visual feedback
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

  // Check if rock has passed the player without collision
  if (rockRect.right < playerRect.left && !rockPassed) {
    rockPassed = true;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    // Increase speed after each successful jump
    if (currentSpeed > minSpeed) {
      currentSpeed -= speedIncrease;
      updateRockSpeed();
    }
  }

  // Reset the flag when rock is back to the right of the player
  if (rockRect.left > playerRect.right) {
    rockPassed = false;
  }
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

  // Reset difficulty
  currentSpeed = baseSpeed;
  backgroundSpeed = 15;

  // Reset rock
  rock.style.animation = "none";
  rock.offsetHeight;
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";

  // Reset background
  background.style.animation = "none";
  background.offsetHeight;
  background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
  background.style.animationPlayState = "running";

  // Reset game state
  gameOver.style.display = "none";
  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  rockPassed = false;
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
replayBtn.addEventListener("click", resetGame);

// Initialize game with animations paused
background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
background.style.animationPlayState = "paused";
rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
rock.style.animationPlayState = "paused";

// Start game loop
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
