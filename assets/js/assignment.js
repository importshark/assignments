let socket = io();

let finished = false;

const dataString = document.getElementById('data').value;
data = JSON.parse(dataString);

const paragraph = document.getElementById('p');


socket.emit('identify', data.identification);

socket.on('finish', function (arg) {
    console.log("The package has been installed successfully")
    finished = true;
})


setInterval(function () {
    if(finished) return;

    paragraph.innerHTML = random();

}, 3750)