import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n\n');

const seeds = data[0].split(': ')[1].split(' ').map(Number);

const rawToMappers = (raw: string) => {
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
  return mappers;
}

let out: number[] = [];
seeds.forEach(seed => {
  let num = seed;
  for (let i = 1; i < data.length; i++) {
    const toNext = rawToMappers(data[i]);
  
    for (let j = 0; j < toNext.length; j++) {
      const out = toNext[j](num);
      if (out != num) {
        num = out;
        break;
      }
    }
  }
  out.push(num);
});
console.log(Math.min(...out));

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