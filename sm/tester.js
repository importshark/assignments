const {workerData, parentPort} = require('worker_threads')

setTimeout(function(){
        parentPort.postMessage(false)
        process.exit(0)
    }, 10000)

    socket.on('testConfirm', function(){
        console.log("Test successful.")
        parentPort.postMessage(true)
        process.exit(0)
    })