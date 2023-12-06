import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const [, ...timesRaw] = data[0].split(/\s+/);
const [, ...distancesRaw] = data[1].split(/\s+/);
const times = [+timesRaw.join('')];
const distances = [+distancesRaw.join('')];

let result = 1;
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
  result *= beatCount;
})

console.log(result);