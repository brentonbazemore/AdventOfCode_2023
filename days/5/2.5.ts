import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n\n');
import * as _ from 'lodash';

let maxSeed = 0;
const seedPairs = _.chunk(data[0].split(': ')[1].split(' ').map(Number), 2);
seedPairs.forEach((pair) => {
  maxSeed = Math.max(maxSeed, pair[0] + pair[1]);
});
const sampleSeeds: number[] = [];
for (let i = 0; i < maxSeed; i += 10000) {
  sampleSeeds.push(i);
}

const checkSeedExists = (seed: number) => {
  return seedPairs.some((pair) => {
    return seed >= pair[0] && seed <= pair[0] + pair[1];
  });
};

const memoMappers: { [cacheKey: number]: ((num: number) => number)[] } = {};

const rawToMappers = (raw: string, cacheKey: number) => {
  if (memoMappers[cacheKey]) {
    return memoMappers[cacheKey];
  }

  const lines = raw.split('\n');
  let mappers = [];
  for (let i = 1; i < lines.length; i++) {
    const [destination, source, range] = lines[i].split(' ').map(Number);
    const check = (num: number) => {
      if (num >= source && num <= source + range) {
        const diff = destination - source;
        return num + diff;
      }
      return num;
    };
    mappers.push(check);
  }
  memoMappers[cacheKey] = mappers;
  return mappers;
};

const findMin = (seeds: number[]) => {
  let out: { seed: number; num: number }[] = [];
  seeds.forEach((seed) => {
    let num = seed;
    for (let i = 1; i < data.length; i++) {
      const toNext = rawToMappers(data[i], i);

      for (let j = 0; j < toNext.length; j++) {
        const out = toNext[j](num);
        if (out != num) {
          num = out;
          break;
        }
      }
    }
    out.push({ seed, num });
  });

  out.sort((a, b) => a.num - b.num);
  return out;
};

const out = findMin(sampleSeeds);

let minima: {
  seed: number;
  num: number;
};
for (let i = 0; i < out.length; i++) {
  if (checkSeedExists(out[i].seed)) {
    minima = out[i];
    break;
  }
}

let localSeeds: number[] = [];
for (let i = minima!.seed - 1000000; i < minima!.seed + 1000000; i++) {
  localSeeds.push(i);
}

console.log(findMin(localSeeds)[0].num);

// I got the max seed and sampled every 10000th seed between 0 and max. Then I compared the minima
// and got the lowest output that was caused by a valid seed
// Then I did a "tiny" loop that checked that seed +- 1000000 and that gave me the actual minimum seed

// Cleaned this up to make it solve via cli