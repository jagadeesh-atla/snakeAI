const cellSize = 20;
let allowMove = false;
let cellCountX, cellCountY;
let canvasOffsetX, canvasOffsetY;
let game;
let bgColor, gridColor, snakeColor, foodColor;
let lastUpdateTime = 0;

let maxScore = localStorage.getItem("maxScore") || 0;
let search;

let isAIPlaying = false;
let interval = isAIPlaying ? 0.00001 : 0.15;

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
  interval = isAIPlaying ? 0.00000000001 : 0.15;

  background(bgColor);

  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text(`Score: ${game.score}`, width - 10, 30);
  text(`Max Score: ${maxScore}`, width - 10, 60);

  let buttonY = 50;
  let buttonHeight = 40;
  let buttonSpacing = 10;

  fill(100);
  rect(width / 2 - 100, buttonY, 200, buttonHeight);
  rect(
    width / 2 - 100,
    buttonY + buttonHeight + buttonSpacing,
    200,
    buttonHeight
  );
  rect(
    width / 2 - 100,
    buttonY + 2 * (buttonHeight + buttonSpacing),
    200,
    buttonHeight
  );

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("AI Player", width / 2, buttonY + buttonHeight / 2);
  text(
    "Human Player",
    width / 2,
    buttonY + buttonHeight + buttonSpacing + buttonHeight / 2
  );
  text(
    "Restart",
    width / 2,
    buttonY + 2 * (buttonHeight + buttonSpacing) + buttonHeight / 2
  );

  strokeWeight(0.5);
  stroke(gridColor);
  drawGridLines();

  if (eventTriggered(interval)) {
    allowMove = true;
    game.update();
  }
  game.draw();
}

function mouseClicked() {
  let buttonY = 50;

  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
    if (mouseY > buttonY && mouseY < buttonY + 40) {
      isAIPlaying = true;
    } else if (mouseY > buttonY + 50 && mouseY < buttonY + 90) {
      isAIPlaying = false;
    } else if (mouseY > buttonY + 100 && mouseY < buttonY + 140) {
      game.score = 0;
      game.snake.reset();
    }
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
