if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    const len = this.length;
    let from = Number(arguments[1]) || 0;
    from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) {
      from += len;
    }
    for (; from < len; ++from) {
      if (from in this && this[from] === elt) {
        return from;
      }
    }
    return -1;
  };
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function (from, to) {
    const rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
}

const GraphNodeType = { OPEN: 0, WALL: 1 };

class Graph {
  constructor(grid) {
    this.elements = grid;
    const nodes = [];

    let row,
      rowLength,
      len = grid.length;
    for (let y = 0; y < len; ++y) {
      row = grid[y];
      rowLength = row.length;
      nodes[y] = new Array(rowLength);
      for (let x = 0; x < rowLength; ++x) {
        if (y < cellCountY && x < cellCountX) {
          nodes[y][x] = new GraphNode(x, y, row[x]);
        }
      }
    }

    this.nodes = nodes;
  }

  toString() {
    let graphString = "\n";
    const nodes = this.nodes;
    let rowDebug, row, x, l;

    for (let y = 0, len = nodes.length; y < len; ) {
      rowDebug = "";
      row = nodes[y++];
      for (x = 0, l = row.length; x < l; ) {
        rowDebug += row[x++].type + " ";
      }
      graphString = graphString + rowDebug + "\n";
    }

    return graphString;
  }
}

class GraphNode {
  constructor(x, y, type) {
    this.data = {};
    this.x = x;
    this.y = y;
    this.pos = { x: x, y: y };
    this.type = type;
  }

  isBoundary() {
    const { x, y } = this;

    if (x === 0 || y === 0 || x === cellCountX - 1 || y === cellCountY - 1)
      return true;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return "[" + this.x + " " + this.y + "]";
  }

  isWall() {
    return this.type === GraphNodeType.WALL;
  }
}

class BinaryHeap {
  constructor(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  push(element) {
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  }

  pop() {
    const result = this.content[0];
    let end = this.content.pop();

    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }

    return result;
  }

  remove(node) {
    let i = this.content.indexOf(node);
    let end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;
      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  }

  size() {
    return this.content.length;
  }

  rescoreElement(node) {
    this.sinkDown(this.content.indexOf(node));
  }

  sinkDown(n) {
    let element = this.content[n];

    while (n > 0) {
      let parentN = ((n + 1) >> 1) - 1,
        parent = this.content[parentN];

      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  bubbleUp(n) {
    const length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

    while (true) {
      let child2N = (n + 1) << 1,
        child1N = child2N - 1;

      let swap = null;

      if (child1N < length) {
        let child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      if (child2N < length) {
        let child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }
}

function Maze(snakeBody) {
  const grid = [];
  for (let i = 0; i < cellCountY; ++i) {
    const row = [];
    for (let j = 0; j < cellCountX; ++j) {
      row.push(0);
    }
    grid.push(row);
  }

  for (let sk of snakeBody) {
    const x = sk.x,
      y = sk.y;
    if (y < cellCountY && x < cellCountX) {
      grid[y][x] = 1;
    }
  }

  return grid;
}
