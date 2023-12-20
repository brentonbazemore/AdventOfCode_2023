import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const dugCoords: { [y: number]: { [x: number]: string }} = {}
const filled: { [y: number]: { [x: number]: string }} = {}

let count = 0;
const display = () => {
  // const output = Bun.file('./days/18/output.txt');
  // const writer = output.writer();
  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;
  Object.typedKeys(dugCoords).forEach(y => {
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    Object.typedKeys(dugCoords[y]).forEach(x => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    });
  });

  for (let y = minY; y <= maxY; y++) {
    let row = '';
    for (let x = minX; x <= maxX; x++) {
      if (dugCoords[y]?.[x] || filled[y]?.[x]) {
        row += '#'
        count++;
      } else {
        row += '.'
      }
    }
    // writer.write(row + '\n');
    console.log(row);
  }
  console.log(count);
}

// const findCorners = (start: [number, number]) => {
//   let minY = Infinity;
//   let maxY = -Infinity;
//   let minX = Infinity;
//   let maxX = -Infinity;
//   Object.typedKeys(dugCoords).forEach(y => {
//     minY = Math.min(minY, y);
//     maxY = Math.max(maxY, y);
//     Object.typedKeys(dugCoords[y]).forEach(x => {
//       minX = Math.min(minX, x);
//       maxX = Math.max(maxX, x);
//     });
//   });

//   const points: [number, number][] = [];

//   let currCorner = start;

//   for (let y = minY; y <= maxY; y++) {
//     for (let x = minX; x <= maxX; x++) {
//       const hasVert = dugCoords[y - 1]?.[x] != null || dugCoords[y + 1]?.[x] != null;
//       const hasHori = dugCoords[y]?.[x - 1] != null || dugCoords[y]?.[x + 1] != null;
      
//       if (dugCoords[y]?.[x]) {
//         if (hasHori && hasVert) {
//           points.push([x, y]);
//         }
//       }
//     }
//   }

//   return points;
// }

enum Direction {
  RIGHT = 'R',
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L'
}

let position = { x: 0, y: 0 }
const dig = (x: number, y: number, color: string) => {
  dugCoords[y] = dugCoords[y] ?? {};
  dugCoords[y][x] = color;
}

dig(position.x, position.y, 'none')
// const corners: [number, number][] = [[position.x, position.y]];
data.forEach(line => {
  const [direction, rawLength, rawColor] = line.split(' ');
  const length = +rawLength;
  const color = rawColor.replace('(', '').replace(')', '');

  if (direction === Direction.RIGHT) {
    for (let i = 0; i < length; i++) {
      dig(position.x, position.y, color);
      position.x += 1;
    }
  }
  if (direction === Direction.LEFT) {
    for (let i = 0; i < length; i++) {
      dig(position.x, position.y, color);
      position.x -= 1;
    }
  }
  if (direction === Direction.UP) {
    for (let i = 0; i < length; i++) {
      dig(position.x, position.y, color);
      position.y -= 1;
    }
  }
  if (direction === Direction.DOWN) {
    for (let i = 0; i < length; i++) {
      dig(position.x, position.y, color);
      position.y += 1;
    }
  }
  // corners.push([position.x, position.y]);
});

const findAPointInside = () => {
  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;
  Object.typedKeys(dugCoords).forEach(y => {
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    Object.typedKeys(dugCoords[y]).forEach(x => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    });
  });

  for (let x = minX; x <= maxX; x++) {
    if (dugCoords[minY][x]) {
      if (!dugCoords[minY + 1][x]) {
        return [x, minY + 1] as [number, number];
      }
    }
  }
}

const isEdge = (x: number, y: number) => {
  return !!dugCoords[y]?.[x];
}

const checkAdjacent = (x: number, y: number) => {
  const anEdge = isEdge(x, y);
  const isFilled = filled[y]?.[x];;

  return !anEdge && !isFilled;
}

const addFilled = (x: number, y: number) => {
  filled[y] = filled[y] ?? {};
  filled[y][x] = 'filled';
}

const fill = (x: number, y: number) => {
  const queue: [number, number][] = [];

  queue.push([x, y]);
  filled[y] = filled[y] ?? {};
  filled[y][x] = 'filled';

  while (queue.length > 0) {
    const [curX, curY] = queue.shift()!;
    if (isEdge(curX, curY)) {
      return false;
    }

    // up
    if (checkAdjacent(curX, curY - 1)) {
      addFilled(curX, curY - 1);
      queue.push([curX, curY - 1]);
    }
    // down
    if (checkAdjacent(curX, curY + 1)) {
      addFilled(curX, curY + 1)
      queue.push([curX, curY + 1]);
    }
    // left
    if (checkAdjacent(curX - 1, curY)) {
      addFilled(curX - 1, curY)
      queue.push([curX - 1, curY]);
    }
    // right
    if (checkAdjacent(curX + 1, curY)) {
      addFilled(curX + 1, curY)
      queue.push([curX + 1, curY]);
    }
  }

  return true;

  // console.log(filled);
}

const start = findAPointInside()!;
fill(start[0], start[1]);


// corners.pop(); // puts start in twice
// console.log(corners)

// // const corners = findCorners();
// // console.log(corners)
// console.log(pip.pointInPolyWindingNumber(corners, [1, 1]))

display();