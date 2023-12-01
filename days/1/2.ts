const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');


const numStrings: any = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
}

let sum = 0;
data.forEach(line => {
  let clean = line;
  Object.keys(numStrings).forEach(str => {
    clean = clean.replaceAll(str, str[0] + numStrings[str] + str.slice(1));
  });
  const digits = clean.replaceAll(/\D/g, '');
  const first = digits[0];
  const last = digits.at(-1);
  const num = first + last;
  sum += +num;
})

console.log(sum);