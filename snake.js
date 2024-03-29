class Snake {
  constructor() {
    this.body = [createVector(6, 9), createVector(5, 9), createVector(4, 9)];
    this.direction = createVector(1, 0);
    this.addSegment = false;
    this.path = [];
  }

  draw() {
    noStroke();

    for (let i = 0; i < this.body.length; i++) {
      const x = canvasOffsetX + this.body[i].x * cellSize;
      const y = canvasOffsetY + this.body[i].y * cellSize;
      const gradColor = lerpColor(
        color(255, 0, 0),
        color(0, 255, 0),
        i / this.body.length
      ); // Gradient from red to green

      fill(gradColor);
      if (i === 0) {
        ellipse(x + cellSize / 2, y + cellSize / 2, cellSize, cellSize);
      } else {
        rect(x, y, cellSize, cellSize, 6);
      }
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
