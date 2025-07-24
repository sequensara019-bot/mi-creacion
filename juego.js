const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let score = 0;
let gameOver = false;

const carWidth = 50;
const carHeight = 100;
let carX = WIDTH / 2 - carWidth / 2;
const carY = HEIGHT - carHeight - 10;

const carSpeed = 7;

let leftPressed = false;
let rightPressed = false;

const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 80;
const obstacleSpeed = 5;

function drawCar() {
  ctx.fillStyle = '#d91e18';
  ctx.beginPath();
  ctx.moveTo(carX, carY);
  ctx.lineTo(carX + carWidth, carY);
  ctx.lineTo(carX + carWidth - 10, carY + carHeight);
  ctx.lineTo(carX + 10, carY + carHeight);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#222';
  ctx.fillRect(carX + 5, carY + carHeight - 15, 15, 15);
  ctx.fillRect(carX + carWidth - 20, carY + carHeight - 15, 15, 15);
}

function drawObstacle(ob) {
  ctx.fillStyle = '#0b3c49';
  ctx.fillRect(ob.x, ob.y, obstacleWidth, obstacleHeight);
  ctx.fillStyle = '#fff';
  for(let i=0; i<4; i++){
    for(let j=0; j<4; j++){
      if ((i + j) % 2 === 0) {
        ctx.fillRect(ob.x + j * 12, ob.y + i * 20, 12, 20);
      }
    }
  }
}

function createObstacle() {
  const x = Math.random() * (WIDTH - obstacleWidth);
  obstacles.push({ x, y: -obstacleHeight });
}

function updateObstacles() {
  for(let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacleSpeed;

    if (
      obstacles[i].y + obstacleHeight > carY &&
      obstacles[i].x < carX + carWidth &&
      obstacles[i].x + obstacleWidth > carX
    ) {
      gameOver = true;
    }

    if (obstacles[i].y > HEIGHT) {
      score++;
      obstacles.splice(i, 1);
      i--;
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawScore() {
  document.getElementById('score').textContent = `Puntaje: ${score}`;
}

function gameLoop() {
  if(gameOver) {
    document.getElementById('gameOver').classList.remove('hidden');
    return;
  }

  clearCanvas();
  drawCar();
  updateObstacles();
  obstacles.forEach(drawObstacle);
  drawScore();

  if(leftPressed && carX > 0) carX -= carSpeed;
  if(rightPressed && carX < WIDTH - carWidth) carX += carSpeed;

  requestAnimationFrame(gameLoop);
}

function restartGame() {
  obstacles.length = 0;
  score = 0;
  gameOver = false;
  carX = WIDTH / 2 - carWidth / 2;
  document.getElementById('gameOver').classList.add('hidden');
  gameLoop();
}

// Teclado
window.addEventListener('keydown', e => {
  if(e.key === 'ArrowLeft') leftPressed = true;
  if(e.key === 'ArrowRight') rightPressed = true;
});

window.addEventListener('keyup', e => {
  if(e.key === 'ArrowLeft') leftPressed = false;
  if(e.key === 'ArrowRight') rightPressed = false;
});

// Botones táctiles
document.getElementById('leftBtn').addEventListener('touchstart', () => leftPressed = true);
document.getElementById('rightBtn').addEventListener('touchstart', () => rightPressed = true);
document.getElementById('leftBtn').addEventListener('touchend', () => leftPressed = false);
document.getElementById('rightBtn').addEventListener('touchend', () => rightPressed = false);

// Reinicio
document.getElementById('restartBtn').addEventListener('click', restartGame);

// Obstáculos
setInterval(() => {
  if (!gameOver) createObstacle();
}, 1500);

// Start
gameLoop();

