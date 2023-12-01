const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

let sum = 0;
data.forEach(line => {
  const digits = line.replaceAll(/\D/g, '');
  const first = digits[0];
  const last = digits.at(-1);
  const num = first + last;
  sum += +num;
})

console.log(sum);