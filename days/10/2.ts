import '../../types/helper.d.ts';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');
// console.log(inputFile);

type Coords = `${number}_${number}`;

type Shape = '|' | '-' | 'L' | 'J' | '7' | 'F';

type Pipe = {
  x: number;
  y: number;
  shape: Shape;
  neighbors: [Coords, Coords];
  coords: Coords;
}

const myStart = 'J'; // TODO: Figure out how to calculate lol;
const testStart = '7';

const pipes: { [coords: Coords]: Pipe } = {};

const determineShape = (x: number, y: number): Shape => {
  if (inputFile === 'input.txt') {
    return myStart;
  } else {
    return testStart;
  }
  // const up = data[y - 1][x];
  // const down = data[y + 1][x];
  // const left = data[y][x - 1];
  // const right = data[y][x + 1];
  
  // let potentials = ['|', '-', 'L', 'J', '7', 'F'];
  // if (['F', '7', '|'].includes(up)) {
  //   potentials = potentials.filter(s => [])
  // }

  // return '|';
}

let startCoords: Coords;
for (let y = 0; y < data.length; y++) {
  const row = data[y];
  for (let x = 0; x < data[0].length; x++) {
    const up: Coords = `${x}_${y - 1}`;
    const down: Coords = `${x}_${y + 1}`;
    const right: Coords = `${x + 1}_${y}`;
    const left: Coords = `${x - 1}_${y}`;

    let shape = row[x];
    if (shape === '.') {
      continue;
    }

    if (shape === 'S') {
      shape = determineShape(x, y);
      // console.log(shape);
      startCoords = `${x}_${y}`;
    }

    const pipe: Pipe = {
      x,
      y,
      shape: shape as Shape,
      neighbors: [] as any,
      coords: `${x}_${y}`,
    }

    if (shape === '|') {
      pipe.neighbors = [up, down];
    } else if (shape === '-') {
      pipe.neighbors = [left, right];
    } else if (shape === 'L') {
      pipe.neighbors = [up, right];
    } else if (shape === 'J') {
      pipe.neighbors = [up, left];
    } else if (shape === '7') {
      pipe.neighbors = [left, down];
    } else if (shape === 'F') {
      pipe.neighbors = [down, right];
    }

    pipes[`${x}_${y}`] = pipe;
  }
}

let prevPipe = pipes[startCoords!].neighbors[1];
let currPipe = pipes[startCoords!];
let steps = 0;
const visited = new Set<Coords>();
while (true) {
  for (let i = 0; i < currPipe.neighbors.length; i++) {
    const nextPipe = currPipe.neighbors[i];
    if (nextPipe === prevPipe) {
      continue;
    }

    steps++;

    visited.add(currPipe.coords);
    // console.log({nextPipe})
    prevPipe = currPipe.coords;
    currPipe = pipes[nextPipe];

  }

  if (currPipe.coords === startCoords!) {
    break;
  }
}

const shapeMap = {
  'F': '╔',
  'L': '╚',
  'J': '╝',
  '7': '╗',
  '|': '║',
  '-': '═',
}

const pipeSymbols = ['╔',
'╚',
'╝',
'╗',
'║',
'═',];

let rows = [];
for (let y = 0; y < data.length; y++) {
  let row1 = '';
  for (let x = 0; x < data[0].length; x++) {
    if (visited.has(`${x}_${y}`)) {
      row1 += shapeMap[pipes[`${x}_${y}`].shape];
    } else {
      row1 += '.';
    }
  }
  let row2 = '';
  for (let x = 0; x < data[0].length; x++) {
    if (['╔', '╗', '║'].includes(row1[x])) {
      row2 += '║';
    } else {
      row2 += '.';
    }
  }
  rows.push(row1);
  rows.push(row2);
  // console.log(row1);
  // console.log(row2);
}

let expandedRows = [];
for (let y = 0; y < rows.length; y++) {
  let expandedRow = '';
  let row = rows[y];
  for (let x = 0; x < rows[0].length; x++) {
    expandedRow += row[x];
    if (['╔', '╚', '═'].includes(row[x])) {
      expandedRow += '═';
    } else {
      expandedRow += '.';
    }
  }
  // console.log(expandedRow);
  expandedRows.push(expandedRow);
}

// Force there to be edges
for (let i = 0; i < expandedRows.length; i++) {
  expandedRows[i] = '.' + expandedRows[i];
  expandedRows[i] += '.';
}
let filler = '';
for (let i = 0; i < expandedRows[0].length; i++) {
  filler += '.';
}
expandedRows.unshift(filler)
expandedRows.push(filler);


for (let y = 0; y < expandedRows.length; y++) {
  let row = '';
  for (let x = 0; x < expandedRows[0].length; x++) {
    row += expandedRows[y][x];
  }
  console.log(row);
}

const display = (grid: string[]) => {
  for (let y = 0; y < grid.length; y++) {
    let row = '';
    for (let x = 0; x < grid[0].length; x++) {
      row += grid[y][x];
    }
    console.log(row);
  }
}

const isEdge = (x: number, y: number, grid: string[]) => x <= 0 || x >= grid[0].length || y <= 0 || y >= grid.length;

const checkAdjacent = (x: number, y: number, grid: string[], filled: Set<Coords>) => {
  const aPipe = pipeSymbols.includes(grid[y]?.[x]);
  // const anEdge = isEdge(x, y, grid);
  const isFilled = filled.has(`${x}_${y}`);

  return !aPipe && !isFilled;
}

const fill = (x: number, y: number, grid: string[], filled: Set<Coords>) => {
  const queue: [number, number][] = [];

  queue.push([x, y]);
  filled.add(`${x}_${y}`);

  while (queue.length > 0) {
    const [curX, curY] = queue.shift()!;
    if (isEdge(curX, curY, grid)) {
      return false;
    }

    // up
    if (checkAdjacent(curX, curY - 1, grid, filled)) {
      filled.add(`${curX}_${curY - 1}`);
      queue.push([curX, curY - 1]);
    }
    // down
    if (checkAdjacent(curX, curY + 1, grid, filled)) {
      filled.add(`${curX}_${curY + 1}`);
      queue.push([curX, curY + 1]);
    }
    // left
    if (checkAdjacent(curX - 1, curY, grid, filled)) {
      filled.add(`${curX - 1}_${curY}`);
      queue.push([curX - 1, curY]);
    }
    // right
    if (checkAdjacent(curX + 1, curY, grid, filled)) {
      filled.add(`${curX + 1}_${curY}`);
      queue.push([curX + 1, curY]);
    }
  }

  return true;

  // console.log(filled);
}

console.log('Checking', expandedRows[0].length, 'by', expandedRows.length);
const interior: { [coords: Coords]: boolean } = {};
for (let y = 0; y < expandedRows.length; y++) {
  for (let x = 0; x < expandedRows[0].length; x++) {
    // console.log(x, y)
    const isInterior = fill(x, y, expandedRows, new Set<Coords>());
    interior[`${x}_${y}`] = (interior[`${x}_${y}`] ?? false) || isInterior;
  }
}
let checkedRows = [];
for (let y = 0; y < expandedRows.length; y++) {
  let row = '';
  for (let x = 0; x < expandedRows[0].length; x++) {
    if (pipeSymbols.includes(expandedRows[y][x])) {
      row += '█';
    } else {
      row += interior[`${x}_${y}`] ? 'I' : '.'
    }
  }
  checkedRows.push(row);
}

console.log('=========')
display(checkedRows);
checkedRows.shift();
checkedRows.pop();
checkedRows = checkedRows.map(row => {
  const ar = row.split('');
  ar.shift();
  ar.pop();
  return ar.join('');
});

// display(checkedRows);
// // console.log(checkedRows);
let collapsedY = [];
for (let i = 0; i < checkedRows.length; i++) {
  if (i % 2 === 0) {
    collapsedY.push(checkedRows[i]);
  }
}
// console.log(collapsedY);
let collapsedX = [];
for (let y = 0; y < collapsedY.length; y++) {
  let row = '';
  for (let x = 0; x < collapsedY[0].length; x++) {
    if (x % 2 === 0) {
      row += collapsedY[y][x];
    }
  }
  collapsedX.push(row);
}
display(collapsedX);

console.log(collapsedX.join('').replaceAll('.', '').replaceAll('█', '').length);

// try to find an outer edge (x = 0, x = length; y = 0; y = length)
// if touching a point that is known to touch an edge, instantly mark as touching an edge
// after finding all exterior, delete filler edges and every other column/row to compress

// To your future self, this runs incredibly slow, but it gets the job done. 