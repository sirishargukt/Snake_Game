const gameCanvas = document.getElementById('gameCanvas');
const displayCanvas = document.getElementById('displayCanvas');
const gameCtx = gameCanvas.getContext('2d');
const displayCtx = displayCanvas.getContext('2d');
const startMessage = document.getElementById('startMessage');

const boxSize = 20;
const gridWidth = 30;
const gridHeight = 20;

gameCanvas.width = displayCanvas.width = boxSize * gridWidth;
gameCanvas.height = displayCanvas.height = boxSize * gridHeight;

let snake = [{x: 10, y: 10}];
let direction = {x: 1, y: 0};
let food = {};
let speed = 150; // milliseconds per move
let score = 0;
let level = 1;
let gameRunning = false;

function init() {
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0};
    score = 0;
    level = 1;
    speed = 150;
    placeFood();
    gameRunning = true;
    startMessage.style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function update() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        if (snake.length >= 30) {
            level++;
            speed *= 0.95; // Increase speed by 5%
        }
        placeFood();
    } else {
        snake.pop();
    }
}

function draw() {
    gameCtx.fillStyle = 'black';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    gameCtx.fillStyle = 'lime';
    snake.forEach(segment => {
        gameCtx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });

    gameCtx.fillStyle = 'red';
    gameCtx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

    gameCtx.fillStyle = 'white';
    gameCtx.font = '20px Arial';
    gameCtx.fillText(`Score: ${score} Level: ${level}`, 10, 30);

    displayCtx.drawImage(gameCanvas, 0, 0);
}

function gameOver() {
    gameRunning = false;
    startMessage.innerHTML = 'Game Over! Press Enter to Restart';
    startMessage.style.display = 'block';
}

let lastTime = 0;
function gameLoop(currentTime) {
    if (gameRunning) {
        requestAnimationFrame(gameLoop);

        if (!lastTime) {
            lastTime = currentTime;
        }
        const deltaTime = currentTime - lastTime;

        if (deltaTime > speed) {
            lastTime = currentTime;
            update();
            draw();
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameRunning) {
        init();
    } else if (gameRunning) {
        switch(e.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = {x: 1, y: 0};
                break;
        }
    }
});
draw();
