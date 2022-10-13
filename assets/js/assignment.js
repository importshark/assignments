let socket = io();

let finished = false;

const id = document.getElementById('id').innerHTML;

const paragraph = document.getElementById('p');



socket.on('finish', function (arg) {
    document.location.href = "/assignment?id=" + id + "&mode=prompt="
})


setInterval(function () {
    if(finished) return;

    paragraph.innerHTML = random();

}, 3750)