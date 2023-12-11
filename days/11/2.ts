import '../../types/helper.d.ts';
import 'lodash.combinations';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const expansionRate = 999999;

const expanded: { [y: number]: { [x: number]: string } } = {};
let expansionOffsetY = 0;
data.forEach((line, i) => {
  const y = i + expansionOffsetY;
  expanded[y] = {};

  if (!line.includes('#')) {
    expansionOffsetY += expansionRate;
  }
});

let expansionOffsetX = 0;
for (let lineX = 0; lineX < data[0].length; lineX++) {
  const x = lineX + expansionOffsetX;
  let column = '';
  data.forEach(yLine => {
    column += yLine[lineX];
  });

  Object.typedKeys(expanded).forEach((y, j) => {
    expanded[y][x] = data[j][lineX];
  });

  if (!column.includes('#')) {
    expansionOffsetX += expansionRate;
  }
}

const universe = expanded;
type Coords = `${number}_${number}`;
const galaxies = new Set<Coords>();
Object.typedKeys(universe).forEach(y => {
  Object.typedKeys(universe[Object.typedKeys(universe)[0]]).forEach(x => {
    if (universe[y][x] === '#') {
      galaxies.add(`${x}_${y}`);
    }
  });
});

const galaxyPairs = _.combinations(Array.from(galaxies), 2);

let sum = 0;
galaxyPairs.forEach(([a, b]) => {
  const [ax, ay] = a.split('_').map(Number);
  const [bx, by] = b.split('_').map(Number);

  const distance = Math.abs(ax - bx) + Math.abs(ay - by);
  sum += distance;
})

console.log(sum);