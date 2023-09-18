import os from 'node:os';
const THREAD_COUNT = os.cpus().length; // only make as many threads as the hardware can handle

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
// const data = rawData.split('\n');
const data: number[] = [];
for (let i = 0; i < 144; i++) {
  data.push(i);
}

const workerURL = new URL("worker.ts", import.meta.url).href;
const workers: Promise<number>[] = [];
for (let i = 0; i < THREAD_COUNT; i++) {
  const worker = new Worker(workerURL);
  
  workers.push(new Promise((res, rej) => {
    worker.addEventListener("message", (event: MessageEvent) => { // receive output from thread
      res(event.data); // let Promise.all know when the thread finished
      worker.terminate(); // kill thread
    });
  }));

  worker.postMessage(data.slice(i * 12, (i * 12) + 12)); // send chunk of data to thread
}

Promise.all(workers).then((threadOutputs) => {
  let sum = 0;
  for (let i = 0; i < threadOutputs.length; i++) {
    sum += threadOutputs[i];
  }
  console.log(sum);
});
