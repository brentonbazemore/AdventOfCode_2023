import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const [, ...times] = data[0].split(/\s+/).map(Number);
const [, ...distances] = data[1].split(/\s+/).map(Number);

let beatCounts: number[] = [];
times.forEach((time, index) => {
  const recordDistance = distances[index];
  let beatCount = 0;
  for (let i = 0; i < time; i++) {
    // y = mx + b;
    const speed = i;
    const timeRemaining = time - i;
    const travelled = (speed * timeRemaining)
    if (travelled > recordDistance) {
      beatCount++;
    }
  }
  beatCounts.push(beatCount);
})

let result = 1;
beatCounts.forEach(beat => result *= beat);
console.log(result);