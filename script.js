const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");
const pauseResumeBtn = document.getElementById("pauseResumeBtn");

const boxSize = 20;
const canvasSize = 20;
let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let food = { x: Math.floor(Math.random() * canvasSize) * boxSize, y: Math.floor(Math.random() * canvasSize) * boxSize };
let direction = "RIGHT";
let gameOver = false;
let score = 0;
let gameSpeed = 100;  // Default speed (Normal)
let gameInterval;
let isPaused = false;

// Event listeners
document.addEventListener("keydown", changeDirection);
document.getElementById("startGameBtn").addEventListener("click", startGame);
pauseResumeBtn.addEventListener("click", togglePauseResume);

function startGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    if (gameInterval) {
        clearInterval(gameInterval);  // Reset the game interval if it already exists
    }
    
    // Reset game state
    snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
    food = { x: Math.floor(Math.random() * canvasSize) * boxSize, y: Math.floor(Math.random() * canvasSize) * boxSize };
    direction = "RIGHT";
    gameOver = false;
    score = 0;
    document.getElementById("score").innerText = "Score: 0";

    // Get selected speed
    const speed = document.getElementById("speed").value;
    gameSpeed = parseInt(speed);

    // Start the game loop
    gameInterval = setInterval(game, gameSpeed);
}

// Pause/Resume button functionality
function togglePauseResume() {
    if (isPaused) {
        gameInterval = setInterval(game, gameSpeed);  // Resume game
        pauseResumeBtn.textContent = "Pause";
    } else {
        clearInterval(gameInterval);  // Pause game
        pauseResumeBtn.textContent = "Resume";
    }
    isPaused = !isPaused;
}

// Game loop
function game() {
    if (gameOver) return;

    drawCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    updateScore();

    if (checkCollision()) {
        gameOver = true;
        clearInterval(gameInterval);
        alert("Game Over! Your score: " + score);
        startScreen.classList.remove("hidden");
        gameScreen.classList.add("hidden");
    }
}

// Draw the canvas grid
function drawCanvas() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// Draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
}

// Move the snake
function moveSnake() {
    let head = { x: snake[0].x, y: snake[0].y };

    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "UP") head.y -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;
    if (direction === "DOWN") head.y += boxSize;

    // Check if snake ate the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * canvasSize) * boxSize, y: Math.floor(Math.random() * canvasSize) * boxSize };
    } else {
        snake.pop(); // Remove tail
    }

    snake.unshift(head); // Add new head
}

// Change snake direction
function changeDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

// Check for collisions
function checkCollision() {
    let head = snake[0];

    // Check collision with walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Update the score display
function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}