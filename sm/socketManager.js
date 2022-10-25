const { spawnSync } = require('child_process');

const sockets = new Map();






function connect(socket, id){

    console.log("Socket connected: " + socket.id);
    console.log("Assuming interface valid.");

    sockets.set(socket.id, socket);

}


module.exports = {connect}