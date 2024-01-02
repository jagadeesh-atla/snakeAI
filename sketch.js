const cellSize = 20;
let allowMove = false;
let cellCountX, cellCountY;
let canvasOffsetX, canvasOffsetY;
let game;
let bgColor, gridColor, snakeColor, foodColor;
let lastUpdateTime = 0;

let search;

const isAIPlaying = true;
const interval = isAIPlaying ? 0.00000000001 : 0.15;

function preload() {
  eatSound = loadSound("Sounds/eat.mp3");
  wallSound = loadSound("Sounds/wall.mp3");
}

function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10);

  cellCountX = floor(width / cellSize);
  cellCountY = floor(height / cellSize);

  canvasOffsetX = (width - cellSize * cellCountX) / 2;
  canvasOffsetY = (height - cellSize * cellCountY) / 2;

  game = new Game(eatSound, wallSound);

  search = new Search();

  bgColor = color("black");
  gridColor = color("gray");
  snakeColor = color("white");
  foodColor = color("red");

  frameRate(60);
}

function draw() {
  background(bgColor);

  strokeWeight(0.5);
  stroke(gridColor);
  drawGridLines();

  if (game.running) {
    if (eventTriggered(interval)) {
      allowMove = true;
      game.update();
    }
    game.draw();
  }
}

function drawGridLines() {
  for (let i = 0; i < cellCountX + 1; i++) {
    line(
      canvasOffsetX + i * cellSize,
      canvasOffsetY,
      canvasOffsetX + i * cellSize,
      canvasOffsetY + cellSize * cellCountY
    );
  }

  for (let j = 0; j < cellCountY + 1; j++) {
    line(
      canvasOffsetX,
      canvasOffsetY + j * cellSize,
      canvasOffsetX + cellSize * cellCountX,
      canvasOffsetY + j * cellSize
    );
  }
}

function keyPressed(event) {
  if (!isAIPlaying) return;

  const keyCode = event.keyCode;
  if (keyCode === UP_ARROW && game.snake.direction.y !== 1 && allowMove) {
    game.snake.direction = createVector(0, -1);
    game.running = true;
    allowMove = false;
  } else if (
    keyCode === DOWN_ARROW &&
    game.snake.direction.y !== -1 &&
    allowMove
  ) {
    game.snake.direction = createVector(0, 1);
    game.running = true;
    allowMove = false;
  } else if (
    keyCode === LEFT_ARROW &&
    game.snake.direction.x !== 1 &&
    allowMove
  ) {
    game.snake.direction = createVector(-1, 0);
    game.running = true;
    allowMove = false;
  } else if (
    keyCode === RIGHT_ARROW &&
    game.snake.direction.x !== -1 &&
    allowMove
  ) {
    game.snake.direction = createVector(1, 0);
    game.running = true;
    allowMove = false;
  }
}

function eventTriggered(interval) {
  let currentTime = millis() / 1000;
  if (currentTime - lastUpdateTime >= interval) {
    lastUpdateTime = currentTime;
    return true;
  }
  return false;
}

function test() {
  const graph = new Graph(Maze(game.snake.body));
  let { x, y } = game.snake.body[0];
  const start = graph.nodes[y][x];
  x = game.food.position.x;
  y = game.food.position.y;
  end = graph.nodes[y][x];

  const path = xd.search(graph.nodes, start, end);

  // console.log(path);
}
