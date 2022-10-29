const { spawnSync } = require('child_process');


function getKey(map, searchValue){
     for (let [key, value] of map.entries()) {
        if (value === searchValue)
          return key;
      }
}

function getValue(map, key){
    return map.get(key)
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
            console.log("Socket " + socket.id + "has readied with args " + arg);
            userQueue.push({id: socket.id, args: arg})
            await queueUpdate()
        });

        socket.on('redirect', (arg) => {
            socket.emit("html", fs.readFileSync("./assets/html/assignment.html"));
        });

    console.log("Registered listeners.")

    socket.emit('transfer_finish')

}
function getSocket(id){
    return sockets.getValue(sockets.map, id)
}
function getFirst(){
    return userQueue[0]
}

function finish(id){

    if(!userQueue[0]) throw new Error("Help")

    if(id != userQueue[0].id){
        throw new Error("Help me")
    }

    let socket = sockets.getValue(sockets.map, id)

    socket.emit('close')


    userQueue.shift()

    for(var i = 0; i < userQueue.length; i++){
        let socket = sockets.getValue(sockets.map, userQueue[i].id)

        socket.emit('queueUpdate', i)

    }





}
function send(id, event, data){

    let socket = sockets.getValue(sockets.map, id);

    socket.emit(event, data);
}




module.exports = {connect, getIndex, getSocket, getFirst, send, finish}






async function queueUpdate(){



    for( let [key, value] of sockets.map){
        let valid = await testInterface(value);

        if(!valid){
            console.log("qu invalid " + value.id)
            sockets.map.delete(key);
            continue;

        }

        value.emit('queueUpdate', getIndex(value));


    }

    if(!userQueue[0]) return;

    console.log("Begin run of package for user " + userQueue[0].id)



}


setInterval(async function(){

    for( let [key, value] of sockets.map){
        let valid = await testInterface(value);

        if(!valid){
            console.log("Socket " + key + " is invalid")
            disconnect(value)
        }


    }

}, 10000)


