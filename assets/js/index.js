let socket = io();
socket.emit("data", "Hi")

socket.on("html", function(data){
document = data
})

function redirect(id){

    document.location.href = "/assignments/?id=" + id
}