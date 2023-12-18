import '../../types/helper.d.ts';
import { dijkstra, findShortestPath } from './dijkstra.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

type NodeState = {
  x: number;
  y: number;
  lastDirection: Direction;
  lineLength: number;
};

const display = (path: NodeState[]) => {
  for (let y = 0; y < data.length; y++) {
    let row = '';
    for (let x = 0; x < data[0].length; x++) {
      let pathTaken = path.find((node) => node.x === x && node.y === y);
      if (pathTaken) {
        if (pathTaken.lastDirection === Direction.UP) {
          row += '^';
        } else if (pathTaken.lastDirection === Direction.DOWN) {
          row += 'v';
        } else if (pathTaken.lastDirection === Direction.RIGHT) {
          row += '>';
        } else if (pathTaken.lastDirection === Direction.LEFT) {
          row += '<';
        } else {
          row += '#';
        }
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
};

const getNeighbors = (node: NodeState) => {
  // Define an array to store the next steps
  let next: {
    node: NodeState;
    weight: number;
  }[] = [];

  if (node.lineLength < 4) {
    if (node.lastDirection === Direction.RIGHT) {
      const x = node.x + 1;
      const y = node.y;
      const lineLength = node.lineLength + 1;
      if (x < data[0].length) {
        next.push({
          node: { x, y, lastDirection: node.lastDirection, lineLength },
          weight: +data[y][x],
        });
      }
    }
    if (node.lastDirection === Direction.LEFT) {
      const x = node.x - 1;
      const y = node.y;
      const lineLength = node.lineLength + 1;
      if (x >= 0) {
        next.push({
          node: { x, y, lastDirection: node.lastDirection, lineLength },
          weight: +data[y][x],
        });
      }
    }
    if (node.lastDirection === Direction.UP) {
      const x = node.x;
      const y = node.y - 1;
      const lineLength = node.lineLength + 1;
      if (y >= 0) {
        next.push({
          node: { x, y, lastDirection: node.lastDirection, lineLength },
          weight: +data[y][x],
        });
      }
    }

    if (node.lastDirection === Direction.DOWN) {
      const x = node.x;
      const y = node.y + 1;
      const lineLength = node.lineLength + 1;
      if (y < data.length) {
        next.push({
          node: { x, y, lastDirection: node.lastDirection, lineLength },
          weight: +data[y][x],
        });
      }
    }
    return next;
  }

  // left
  // prevent reverse direction
  if (node.lastDirection != Direction.RIGHT) {
    const x = node.x - 1;
    const y = node.y;
    const lineLength = node.lastDirection === Direction.LEFT ? node.lineLength + 1 : 1;
    if (x >= 0) {
      // OOB
      if (lineLength <= 10) {
        next.push({
          node: { x, y, lastDirection: Direction.LEFT, lineLength },
          weight: +data[y][x],
        });
      }
    }
  }

  // right
  if (node.lastDirection != Direction.LEFT) {
    const x = node.x + 1;
    const y = node.y;
    const lineLength = node.lastDirection === Direction.RIGHT ? node.lineLength + 1 : 1;
    if (x < data[0].length) {
      if (lineLength <= 10) {
        next.push({
          node: { x, y, lastDirection: Direction.RIGHT, lineLength },
          weight: +data[y][x],
        });
      }
    }
  }

  // up
  if (node.lastDirection != Direction.DOWN) {
    const x = node.x;
    const y = node.y - 1;
    const lineLength = node.lastDirection === Direction.UP ? node.lineLength + 1 : 1;
    if (y >= 0) {
      if (lineLength <= 10) {
        next.push({
          node: { x, y, lastDirection: Direction.UP, lineLength },
          weight: +data[y][x],
        });
      }
    }
  }

  // down
  if (node.lastDirection != Direction.UP) {
    const x = node.x;
    const y = node.y + 1;
    const lineLength = node.lastDirection === Direction.DOWN ? node.lineLength + 1 : 1;
    if (y < data.length) {
      if (lineLength <= 10) {
        next.push({
          node: { x, y, lastDirection: Direction.DOWN, lineLength },
          weight: +data[y][x],
        });
      }
    }
  }

  return next;
};

const adapter = {
  getEdges: (node: NodeState) => {
    return getNeighbors(node);
  },
  getKey: (node: NodeState) => {
    return `${node.x}_${node.y}:${node.lastDirection}:${node.lineLength}`;
  },
};

const start: NodeState = {
  x: 0,
  y: 0,
  lastDirection: Direction.RIGHT,
  lineLength: 0,
};

const out = dijkstra(adapter, start);

const finishStates = [];
for (let i = 4; i <= 10; i++) {
  for (let j = 0; j < 4; j++) {
    finishStates.push({ x: data[0].length - 1, y: data.length - 1, lineLength: i, lastDirection: j });
  }
}
const lowest = finishStates
  .map((finish) => {
    const path = findShortestPath(out, adapter, start, finish);
    console.log(path.distance)
    return path;
  })
  .filter((path) => path.distance != undefined)
  .reduce(
    (prev, curr) => {
      return curr.distance < prev.distance ? curr : prev;
    },
    { distance: Infinity, path: [] }
  );
// display(lowest.path);
console.log(lowest.distance);

// finishStates.map(finish => {
//   const path = findShortestPath(out, adapter, start, finish)
//   if (path.distance) {
//     display(path.path);
//     console.log(path.distance)
//   }
// })
