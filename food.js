class Food {
  constructor(snakeBody) {
    this.texture = loadImage("Graphics/food.png");
    this.position = this.generateRandomPos(snakeBody);
  }

  draw() {
    noStroke();
    fill(foodColor);

    ellipse(
      canvasOffsetX + this.position.x * cellSize + cellSize / 2,
      canvasOffsetY + this.position.y * cellSize + cellSize / 2,
      cellSize - 1,
      cellSize - 1
    );
  }

  generateRandomCell() {
    const x = floor(random(0, cellCountX));
    const y = floor(random(0, cellCountY));
    return createVector(x, y);
  }

  generateRandomPos(snakeBody) {
    let position = this.generateRandomCell();
    while (this.elementInDeque(position, snakeBody)) {
      position = this.generateRandomCell();
    }
    return position;
  }

  elementInDeque(element, deque) {
    for (let i = 0; i < deque.length; i++) {
      if (deque[i].equals(element)) {
        return true;
      }
    }
    return false;
  }
}
