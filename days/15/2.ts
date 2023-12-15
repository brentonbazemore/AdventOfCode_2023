import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split(',');

let sum = 0;
data.forEach(inst => {
  let value = 0;
  for (let i = 0; i < inst.length; i++) {
    value += inst.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  sum += value;
})
console.log(sum);