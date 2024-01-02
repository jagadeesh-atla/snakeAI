class Snake {
  constructor() {
    this.body = [createVector(6, 9), createVector(5, 9), createVector(4, 9)];
    this.direction = createVector(1, 0);
    this.addSegment = false;
    this.path = [];
  }

  draw() {
    noStroke();
    fill(snakeColor);

    ellipse(
      canvasOffsetX + this.body[0].x * cellSize + cellSize / 2,
      canvasOffsetY + this.body[0].y * cellSize + cellSize / 2,
      cellSize,
      cellSize
    );

    for (let i = 1; i < this.body.length; i++) {
      let x = this.body[i].x;
      let y = this.body[i].y;
      rect(
        canvasOffsetX + x * cellSize,
        canvasOffsetY + y * cellSize,
        cellSize,
        cellSize,
        6
      );
    }
  }

  update() {
    this.body.unshift(p5.Vector.add(this.body[0], this.direction));
    if (this.addSegment == true) {
      this.addSegment = false;
    } else {
      this.body.pop();
    }
  }

  reset() {
    this.body = [createVector(6, 9), createVector(5, 9), createVector(4, 9)];
    this.direction = createVector(1, 0);
  }
}
