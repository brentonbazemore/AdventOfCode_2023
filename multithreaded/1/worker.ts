addEventListener("message", (event: MessageEvent) => {
  console.log("Message from main thread:", event.data);
  let sum = 0;
  for (let i = 0; i < event.data.length; i++) {
    sum += event.data[i];
  }
  postMessage(sum); // return output
});
