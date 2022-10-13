
const handledSockets = [];

function handleConnection(socket){

}

function handleMessage(message, socketId, type){
console.log(message, socketId, type);
handledSockets.push(socketId);
}

function isHandleConnected(socketId){
return handledConnections.includes(socketId);
}


module.exports = {handleConnection, handleMessage, isHandleConnected}