// DOM Element References - Cache all game elements for performance
const player = document.getElementById("player"); // Player character (marshmallow)
const rock = document.getElementById("rock"); // Obstacle (hot cocoa)
const gameOver = document.getElementById("gameOver"); // Game over message display
const replayBtn = document.getElementById("replayBtn"); // Restart game button
const background = document.getElementById("background"); // Scrolling background
const startScreen = document.getElementById("startScreen"); // Start screen container
const startBtn = document.getElementById("startBtn"); // Start game button
const scoreDisplay = document.getElementById("score"); // Score display element

// Game state variables
let gameStarted = false; // Tracks if game has started
let jumping = false; // Tracks if player is currently jumping
let gameRunning = false; // Tracks if game is actively running
let jumpAnimation; // Stores animation frame ID for jump
let score = 0; // Current player score
let rockPassed = false; // Tracks if player successfully passed the current rock
let jumpCount = 0; // Tracks consecutive jumps (for double jump)

// Difficulty variables
let baseSpeed = 2.5; // Initial rock movement speed (lower = faster)
let currentSpeed = baseSpeed; // Current rock speed (adjusts with difficulty)
let speedIncrease = 0.1; // How much speed increases per point
let minSpeed = 1.0; // Maximum difficulty (minimum speed value)
let backgroundSpeed = 15; // Background scroll speed (higher = slower)

/**
 * Starts the game by initializing game state and animations
 */
function startGame() {
  gameStarted = true;
  gameRunning = true;
  startScreen.style.display = "none"; // Hide start screen
  score = 0; // Reset score
  scoreDisplay.textContent = "Score: 0";
  currentSpeed = baseSpeed; // Reset difficulty

  // Start animations
  background.style.animationPlayState = "running";
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";
}

/**
 * Triggers the squish animation effect on the player
 */
function triggerSquish() {
  player.classList.remove("squish");
  void player.offsetWidth; // Force reflow to reset animation
  player.classList.add("squish");
}

/**
 * Makes the player character jump with physics-based animation
 */
function jump() {
  if (jumpCount >= 2 || !gameRunning) return; // Prevent double jump or jumping when game over

  jumpCount++;
  jumping = true;
  triggerSquish(); // Visual feedback at jump start

  const jumpHeight = 450; // Max jump height in pixels
  const jumpDuration = 500; // Total jump duration in ms
  const startTime = Date.now();

  cancelAnimationFrame(jumpAnimation); // Clear any existing jump animation

  /**
   * Animates the jump using a physics-inspired curve
   */
  function animateJump() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / jumpDuration, 1);

    // Quadratic easing for smooth jump arc
    if (progress < 0.5) {
      // Rising part of jump (ease-out)
      player.style.bottom =
        50 + jumpHeight * (1 - Math.pow(progress * 2 - 1, 2)) + "px";
    } else {
      // Falling part of jump (ease-in)
      player.style.bottom =
        50 + jumpHeight * Math.pow((progress - 0.5) * 2, 2) + "px";
    }

    // Continue animation until complete
    if (progress < 1) {
      jumpAnimation = requestAnimationFrame(animateJump);
    } else {
      // Jump complete - reset state
      player.style.bottom = "50px";
      triggerSquish(); // Visual feedback on landing
      jumping = false;
      jumpCount = 0;
    }
  }

  animateJump();
}

/**
 * Updates the rock movement speed based on current difficulty
 */
function updateRockSpeed() {
  // Reset animation to apply new speed
  rock.style.animation = "none";
  rock.offsetHeight; // Trigger reflow
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";

  // Increase background scroll speed (make it faster)
  backgroundSpeed = Math.max(10, backgroundSpeed - 0.5);
  background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
}

/**
 * Checks for collision between player and rock
 * @returns {boolean} True if collision detected
 */
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const rockRect = rock.getBoundingClientRect();

  // Collision detection with adjusted hitboxes
  return !(
    (
      playerRect.right < rockRect.left + 40 || // Player right edge vs rock left
      playerRect.left > rockRect.right - 40 || // Player left edge vs rock right
      playerRect.bottom < rockRect.top + 30 || // Player bottom vs rock top
      playerRect.top > rockRect.bottom - 30
    ) // Player top vs rock bottom
  );
}

/**
 * Updates the score when player passes a rock
 */
function updateScore() {
  const playerRect = player.getBoundingClientRect();
  const rockRect = rock.getBoundingClientRect();

  // Check if rock has passed player (score condition)
  if (rockRect.right < playerRect.left && !rockPassed) {
    rockPassed = true;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    // Increase difficulty (make rocks move faster)
    if (currentSpeed > minSpeed) {
      currentSpeed -= speedIncrease;
      updateRockSpeed();
    }
  }

  // Reset flag when rock is fully past player
  if (rockRect.left > playerRect.right) {
    rockPassed = false;
  }
}

/**
 * Ends the game and shows game over state
 */
function endGame() {
  gameRunning = false;
  gameOver.style.display = "block";

  // Visual feedback - melt the marshmallow
  player.classList.add("melt");

  // Stop all animations
  rock.style.animationPlayState = "paused";
  background.style.animationPlayState = "paused";
  cancelAnimationFrame(jumpAnimation);

  // Show restart button
  replayBtn.style.display = "inline-block";
}

/**
 * Resets the game to initial state
 */
function resetGame() {
  // Reset player position and visual state
  player.style.bottom = "50px";
  player.classList.remove("melt");
  jumping = false;
  jumpCount = 0;

  // Reset difficulty settings
  currentSpeed = baseSpeed;
  backgroundSpeed = 15;

  // Reset rock animation
  rock.style.animation = "none";
  rock.offsetHeight; // Trigger reflow
  rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
  rock.style.animationPlayState = "running";

  // Reset background animation
  background.style.animation = "none";
  background.offsetHeight;
  background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
  background.style.animationPlayState = "running";

  // Hide game over UI
  gameOver.style.display = "none";
  replayBtn.style.display = "none";

  // Reset game state
  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  rockPassed = false;

  startGame(); // Restart the game
}

// ===== EVENT LISTENERS ===== //

// Click anywhere to start game or jump
document.addEventListener("click", (e) => {
  if (!gameStarted) {
    startGame();
  } else if (gameRunning) {
    jump();
  }
});

// Start button click handler
startBtn.addEventListener("click", () => {
  startGame();
});

// Restart button click handler
replayBtn.addEventListener("click", resetGame);

// ===== INITIALIZATION ===== //

// Set up initial animations (paused)
background.style.animation = `scrollBg ${backgroundSpeed}s linear infinite`;
background.style.animationPlayState = "paused";
rock.style.animation = `moveRock ${currentSpeed}s linear infinite`;
rock.style.animationPlayState = "paused";

/**
 * Main game loop that runs continuously
 */
function gameLoop() {
  if (gameRunning) {
    if (checkCollision()) {
      endGame();
    }
    updateScore();
  }
  requestAnimationFrame(gameLoop); // Continue the loop
}

// Start the game loop
gameLoop();
