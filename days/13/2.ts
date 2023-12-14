import '../../types/helper.d.ts';
import * as _ from 'lodash';
import * as ArrayUtils from '../../utils/ArrayUtils.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n\n');

const getDiff = (a: string, b: string) => {
  let diff = 0;
  let lastDiffIndex = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff++;
      lastDiffIndex = i;
    }
  }
  return { diff, lastDiffIndex };
}

let op = '-'
const checkNeighbors = (y1: number, y2: number, grid: string[]) => {
  const max = Math.min(y1 + 1, grid.length - y2);
  // console.log(y1 + 1, grid.length - y2, op);
  let symmetrical = true;
  let checked = [];
  for (let i = 0; i < max; i++) {
    // console.log(grid[y1 - i]);
    // console.log(grid[y2 + i]);
    if (!grid[y1 - i] || !grid[y2 + i]) {
      console.error('ya messed up')
    }
    checked.unshift(grid[y1 - i]);
    checked.push(grid[y2 + i]);
    if (grid[y1 - i] !== grid[y2 + i]) {
      // then check to see if they are off by one, if so, try changing one of them and continue; may have to do it both directions
      symmetrical = false;
      break;
    }
  }
  // console.log(checked.join('\n'))
  // console.log('^', symmetrical)
  return symmetrical;
}

const displayLine = (grid: string[], y1: number, y2: number) => {
  const g = [...grid];
  g[y1] = ''.padStart(grid[0].length, 'v');
  g[y2] = ''.padStart(grid[0].length, '^');
  console.log()
  console.log(g.join('\n'));
}

const findLine = (grid: string[]) => {
  let rowWidth = grid[0].length;
  const g = [...grid];
  const fold = [];
  for (let i = 0; i < grid.length - 1; i++) {
    fold.unshift(g.shift());
    const shorter = Math.min(fold.length, g.length);
    // display logic
    const { diff } = getDiff(g.slice(0, shorter).join(','), fold.slice(0, shorter).join(','))
    if (diff === 1) {
      console.log('')
      for (let i = 0; i < Math.max(fold.length, g.length); i++) {
        console.log(g[i] ?? ''.padStart(rowWidth, ' '), fold[i] ?? ''.padStart(rowWidth, ' '));
      }
      console.log(diff);
      // found it
      return i + 1;
    }

    // console.log(g.join('\n'), fold.join('\n'));
    // console.log(fold.join('\n'));
  }
  // for (let i = 1; i < grid.length; i++) {
  //   const prev = grid[i - 1];
  //   const curr = grid[i];
  //   if (prev === curr) {
  //     if (checkNeighbors(i - 1, i, grid)) {
  //       // displayLine(grid, i - 1, i);

  //       return i;
  //     }
  //   }
  // }

  return null;
}

const findHoriz = (grid: string[]) => {
  op = '-'
  const h = findLine(grid);
  if (h != null) {
    return 100 * h;
  }

  return 0;
}

const findVert = (grid: string[]) => {
  op = '|'
  const turned = ArrayUtils.rotate(grid.map(l => l.split(''))).map(l => l.join(''));
  const v = findLine(turned);
  if (v != null) {
    return v;
  }

  return 0;
}

let sum = 0;
data.forEach((pattern, i) => {
  const lines = pattern.split('\n');
  sum += findVert(lines);
  sum += findHoriz(lines);
})
console.log(sum);