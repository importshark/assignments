const {
  Worker, isMainThread, parentPort, workerData
} = require('node:worker_threads');

console.log("I am")