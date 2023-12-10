import '../../types/helper.d.ts';

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
const testStart = 'F';

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
while (true) {
  for (let i = 0; i < currPipe.neighbors.length; i++) {
    const nextPipe = currPipe.neighbors[i];
    if (nextPipe === prevPipe) {
      continue;
    }

    steps++;
    // console.log({nextPipe})
    prevPipe = currPipe.coords;
    currPipe = pipes[nextPipe];

  }

  if (currPipe.coords === startCoords!) {
    break;
  }
}

console.log(steps / 2);