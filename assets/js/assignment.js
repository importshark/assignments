//INITIALIZE VARS
let socket = io();
let waiting = false;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}




//document vars
const dataElement = document.getElementById('data')
const paragraph = document.getElementById('p');
const anim_holder = document.getElementById('animation_holder');

//interpret vars, if required
const data = JSON.parse(dataElement.value);
const {moduleData} = data;

//debug variables
console.log(data)

//initialize document state
paragraph.hidden = true;
anim_holder.hidden = true;

for (let i = 0; i < moduleData.requiredData.data.length; i++) {

    let div = document.createElement('div');

    div.id = moduleData.requiredData.data[i].id;

    let pElement = document.createElement('p');

    let textElement = document.createTextNode(moduleData.requiredData.data[i].value);


    let inputElement = document.createElement('input');

    pElement.appendChild(textElement);

    div.appendChild(pElement)
    div.appendChild(inputElement)

    document.body.appendChild(div);

}

const button = document.createElement('button')

button.className = "btn btn-primary"
button.type = 'button'

let buttonText = document.createTextNode("Submit")

button.appendChild(buttonText)

document.body.appendChild(button)

//Create necessary event listeners
button.addEventListener("click", function () {

let array = [];

for (let i = 0; i < moduleData.requiredData.data.length; i++) {
    let element = document.getElementById(moduleData.requiredData.data[i].id);

    array.push(element.value);

}

let valid = validate(array, moduleData)
if(valid){

fade()
setTimeout(function () {fade()}, 2750)


}

})


//identify socket
socket.emit('identify', data.identification);


//socket events
socket.on('finish', function (arg) {
    console.log("The package has been installed successfully")
    finished = true;
})


setInterval(function () {

    if(!waiting) {

        paragraph.hidden = true;
        anim_holder.hidden = true;
        return;
    }

    paragraph.hidden = false;
    anim_holder.hidden = false;
    paragraph.innerHTML = random();

}, 3750)