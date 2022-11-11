const { spawnSync } = require('child_process');
const runner = require("../runner")

function getKey(map, searchValue){
     for (let [key, value] of map.entries()) {
        if (value === searchValue)
          return key;
      }
}

function getValue(key){
    return sockets.map.get(key)
}



const sockets = {
    map: new Map(),
    getValue: getValue,
    getKey: getKey
}

let userQueue = [];

function getIndex(socket){

    let value = userQueue.find(x => x.id === socket.id)

    return userQueue.indexOf(value)
}

function testInterface(socket){
    return new Promise((resolve, reject) => {

         socket.emit('testInitiate')

                socket.on('testConfirm', function(){
                    resolve(true);
                })

                setTimeout(function(){
                    resolve(false);
            }, 2000)
    })
}


function disconnect(socket){
    console.log("Disconnect for socket " + socket.id);
    sockets.map.delete(socket.id);
}


function connect(socket){

    console.log("Socket connected: " + socket.id);

    sockets.map.set(socket.id, socket);

    //Register events

    socket.on('disconnect', () => {
            console.log('user disconnected');
        });


        socket.on('ready', async (arg) => {

            const data = {id: socket.id, args: arg}

            console.log("Socket " + socket.id + "has readied with args " + arg);
            userQueue.push(data)
            await queueUpdate()
            runner.run(data)
        });

        socket.on('redirect', (arg) => {
            socket.emit("html", fs.readFileSync("./assets/html/assignment.html"));
        });

    console.log("Registered listeners.")

    socket.emit('transfer_finish')

}
function getSocket(id){
    return sockets.getValue(id)
}
function getFirst(){
    return userQueue[0]
}

function finish(id){


    let socket = sockets.getValue(id)

    socket.emit('close')


    userQueue.shift()

    for(var i = 0; i < userQueue.length; i++){
        let socket = sockets.getValue(userQueue[i].id)

        socket.emit('queueUpdate', i)

    }





}
function send(id, event, data){



    let socket = sockets.map.get(id);

    if(!socket){
        console.error(id + " seems to be missing.")
        sockets.map.delete(id)
        return;
    }

    socket.emit(event, data);



    socket.emit(event, data);
}


exports.send = send;
exports.finish = finish;

module.exports = {connect, getIndex, getSocket, getFirst, send, finish}






function queueUpdate(){



    for( let [key, value] of sockets.map){


        value.emit('queueUpdate', getIndex(value));


    }

    if(!userQueue[0]) return;



}


