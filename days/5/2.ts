import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n\n');
import * as _ from 'lodash';

// let seeds: number[] = [];
let maxSeed = 0;
const seedPairs = _.chunk(data[0].split(': ')[1].split(' ').map(Number), 2);
seedPairs.forEach((pair) => {
  // for (let i = pair[0]; i <= pair[0] + pair[1]; i++) {
  //   // seeds.push(i);
  // }
  maxSeed = Math.max(maxSeed, pair[0] + pair[1])
  // console.log('Processing', seeds.length)
});
console.log(maxSeed);
// for (let i = 0; i < maxSeed; i += 10000) {
//   seeds.push(i);
// }
const seeds: number[] = [];
for (let i = 882050000; i < 883450000 + 300000; i++) {
  seeds.push(i);
}

const checkSeedExists = (seed: number) => {
  return seedPairs.some((pair) => {
    return seed >= pair[0] && seed <= pair[0] + pair[1];
  });
}

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
      // console.log({ destination, source, range });
      if (num >= source && num <= source + range) {
        const diff = destination - source;
        return num + diff;
      }
      return num;
    }
    mappers.push(check);
  }
  memoMappers[cacheKey] = mappers;
  return mappers;
}

let out: { seed: number, num: number }[] = [];
seeds.forEach((seed, index) => {
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
// console.log(out.slice(-10));
for (let i = 0; i < out.length; i++) {
  if (checkSeedExists(out[i].seed)) {
    console.log(out[i]);
    break;
  }
}

// const seedToSoil = rawToMappers(data[1]);
// const soilToFertilizer = rawToMappers(data[2]);
// const fertilizerToWater = rawToMappers(data[3]);
// const waterToLight = rawToMappers(data[4]);
// const lightToTemperature = rawToMappers(data[5]);
// const temperatureToHumidity = rawToMappers(data[6]);
// const humidityToLocation = rawToMappers(data[7]);


// console.log(seedToSoil.map(map => map(13)));
// console.log(soilToFertilizer.map(map => map(13)));

// if (num >= destination && <= destination + range) {
//   num = source - destination;
// }

// To anybody reading this in the future (likely myself), I basically just heuristic'd this by hand...
// so just running bun p2 ain't gonna work
// I got the max seed and sampled every 10000th seed between 0 and max. Then I compared the minima
// and got the lowest output that was caused by a valid seed
// Then I did a "tiny" loop that checked that seed +- 1000000 and that gave me the actual minimum seed
