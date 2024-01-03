class Game {
  constructor(eatSound, wallSound) {
    this.snake = new Snake();
    this.food = new Food(this.snake.body);
    this.running = true;
    this.score = 0;
    this.eatSound = eatSound;
    this.wallSound = wallSound;
  }

  draw() {
    this.food.draw();
    this.snake.draw();
  }

  update() {
    if (this.running) {
      if (isAIPlaying) this.letAIplay();
      this.snake.update();
      this.checkCollisionWithFood();
      this.checkCollisionWithEdge();
      this.checkCollisionWithTail();
    }
  }

  letAIplay() {
    const graph = new Graph(Maze(this.snake.body));

    let { x, y } = this.snake.body[0];
    const start = graph.nodes[y][x];

    x = game.food.position.x;
    y = game.food.position.y;
    const end = graph.nodes[y][x];

    x = this.snake.body[this.snake.body.length - 1].x;
    y = this.snake.body[this.snake.body.length - 1].y;
    const tail = graph.nodes[y][x];

    let path = search.search(graph.nodes, start, end);

    if (path.length === 0) {
      graph.nodes[y][x].type = 0;

      path = search.search(graph.nodes, start, tail);
    }

    if (path.length === 0) {
      this.gameOver();
    } else {
      this.moveToThat(path);
    }
  }

  moveToThat(path) {
    const head = this.snake.body[0];
    const next = path[0];
    const { dx, dy } = this.diff(head, next);

    if (dx === 0 && dy === -1) keyPressed({ keyCode: UP_ARROW });
    else if (dx === 0 && dy === 1) keyPressed({ keyCode: DOWN_ARROW });
    else if (dx === 1 && dy === 0) keyPressed({ keyCode: RIGHT_ARROW });
    else if (dx === -1 && dy === 0) keyPressed({ keyCode: LEFT_ARROW });
    else {
      this.gameOver();
    }
  }

  diff(head, next) {
    const dx = next.x - head.x;
    const dy = next.y - head.y;
    return { dx, dy };
  }

  checkCollisionWithFood() {
    if (this.snake.body[0].equals(this.food.position)) {
      console.log("Collision with food");
      this.food.position = this.food.generateRandomPos(this.snake.body);
      this.snake.addSegment = true;
      this.score++;

      this.eatSound.play();
    }
  }

  checkCollisionWithEdge() {
    if (this.snake.body[0].x === cellCountX || this.snake.body[0].x === -1) {
      console.log("Collision with Edge");
      this.gameOver();
    }
    if (this.snake.body[0].y === cellCountY || this.snake.body[0].y === -1) {
      console.log("Collision with Edge");
      this.gameOver();
    }
  }

  gameOver() {
    if (this.score > maxScore) {
      maxScore = this.score;
      localStorage.setItem("maxScore", maxScore);
    }

    this.snake.reset();

    this.food.position = this.food.generateRandomPos(this.snake.body);
    this.running = false;
    this.score = 0;
    this.wallSound.play();
  }

  checkCollisionWithTail() {
    for (let i = 1; i < this.snake.body.length; i++) {
      if (this.snake.body[0].equals(this.snake.body[i])) {
        console.log("Collision with Tail");
        this.gameOver();
        break;
      }
    }
  }
}
