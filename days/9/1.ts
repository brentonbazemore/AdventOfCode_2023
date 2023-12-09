import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const extrap = (line: number[]) => {
  let diffs = line;
  let history = [diffs];
  while (!diffs.every(num => num === 0)) {
    const newDiffs = [];
    for (let i = 1; i < diffs.length; i++) {
      newDiffs.push(diffs[i] - diffs[i - 1]);
    }
    diffs = newDiffs;
    history.push(diffs);
  }

  let extrapolate = 0;
  history.reverse().forEach((hist) => {
    extrapolate += hist.at(-1)!;
  });
  // console.log(history)
  // console.log(extrapolate);
  return extrapolate;
}

let sum = 0;
data.forEach(line => {
  sum += extrap(line.split(' ').map(Number));
});
console.log(sum);
