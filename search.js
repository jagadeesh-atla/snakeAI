class Search {
  constructor() {
    this.grid = null;
    this.start = null;
    this.end = null;
  }

  init(grid) {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        grid[y][x].f = 0;
        grid[y][x].g = 0;
        grid[y][x].h = 0;
        grid[y][x].visited = false;
        grid[y][x].closed = false;
        grid[y][x].debug = "";
        grid[y][x].parent = null;
      }
    }
  }

  search(grid, start, end) {
    this.init(grid);

    const heuristic = this.euclidean;

    const openList = [];
    openList.push(start);

    while (openList.length > 0) {
      let lowInd = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[lowInd].f) {
          lowInd = i;
        }
      }
      let currentNode = openList[lowInd];

      openList.splice(lowInd, 1);
      currentNode.closed = true;

      if (currentNode.equals(end)) {
        let curr = currentNode;
        const ret = [];
        while (curr.parent != null) {
          ret.push(curr);
          curr = curr.parent;
        }

        return ret.slice().reverse();
      }

      const neighbors = this.neighbors(grid, currentNode);

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (
          neighbor.closed ||
          neighbor.isWall() ||
          neighbor.x < 0 ||
          neighbor.x >= grid[0].length ||
          neighbor.y < 0 ||
          neighbor.y >= grid.length
        ) {
          continue;
        }
        let gScore = currentNode.g + 1;
        let gScoreIsBest = false;

        if (neighbor.isBoundary()) gScore = 1111;

        if (!neighbor.visited || gScore < neighbor.g) {
          gScoreIsBest = true;
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.h = heuristic(neighbor.pos, end.pos);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.visited = true;

          if (!openList.includes(neighbor)) {
            openList.push(neighbor);
          }
        }
      }
    }

    return [];
  }

  euclidean(pos0, pos1) {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);

    return sqrt(d1 * d1 + d2 * d2);
  }

  manhattan(pos0, pos1) {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);

    return d1 + d2;
  }

  farthest(pos0, pos1) {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);

    return max(d1, d2);
  }

  neighbors(grid, node) {
    const ret = [];
    const x = node.x;
    const y = node.y;

    if (y > 0 && grid[y - 1][x]) {
      ret.push(grid[y - 1][x]);
    }
    if (y < grid.length - 1 && grid[y + 1][x]) {
      ret.push(grid[y + 1][x]);
    }
    if (x > 0 && grid[y][x - 1]) {
      ret.push(grid[y][x - 1]);
    }
    if (x < grid[y].length - 1 && grid[y][x + 1]) {
      ret.push(grid[y][x + 1]);
    }
    return ret;
  }

  canReach80(path) {
    const { grid, start } = this.updateGrid(path);
    const totalCells = grid.length * grid[0].length - game.snake.body.length;
    const reachableCells = new Set();

    const queue = [{ x: start.x, y: start.y }];
    reachableCells.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      const currentNode = queue.shift();
      const neighbors = this.neighbors(grid, currentNode);

      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (
          !reachableCells.has(key) &&
          !neighbor.isWall() &&
          !game.snake.body.some(
            (part) => part.x === neighbor.x && part.y === neighbor.y
          )
        ) {
          reachableCells.add(key);
          queue.push({ x: neighbor.x, y: neighbor.y });

          if (
            reachableCells.size / totalCells >= 0.6 ||
            reachableCells.size > totalCells * 0.6
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  updateGrid(path) {
    const snakeBody = [...game.snake.body];

    for (const xyz of path) {
      snakeBody.unshift(createVector(xyz.x, xyz.y));
      snakeBody.pop();
    }
    const graph = new Graph(Maze(snakeBody));

    let { x, y } = snakeBody[0];
    const start = graph.nodes[y][x],
      last = snakeBody[snakeBody.length - 1],
      tail = graph.nodes[last.y][last.x];

    const grid = graph.nodes;
    this.init(grid);

    return {
      grid,
      start,
      snakeBody,
      tail,
    };
  }
}
