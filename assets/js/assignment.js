//Nuke script if is iframe
if ( window.location !== window.parent.location ) {
  throw new Error("This script is stopping due to being run in an iframe.")
}

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
const header = document.getElementById('header');
const anim_holder = document.getElementById('animation_holder');

//interpret vars, if required
const data = JSON.parse(dataElement.value);
const {moduleData} = data;

//debug variables
console.log(data)

//initialize document state
paragraph.hidden = true;
header.hidden = true;
anim_holder.hidden = true;

let form = document.createElement('form');

form.className = "row g-3 needs-validation"
form.id = "form"
form.action="javascript:submit()"



const button = document.createElement('button')

button.className = "btn btn-primary"
button.type = 'submit'


let buttonText = document.createTextNode("Submit")

button.appendChild(buttonText)



for (let i = 0; i < moduleData.requiredData.data.length; i++) {

    let div = document.createElement('div');

    div.id = "div" + moduleData.requiredData.data[i].id;

    let pElement = document.createElement('p');

    let textElement = document.createTextNode(moduleData.requiredData.data[i].value);


    let inputElement = document.createElement('input');


    inputElement.required = moduleData.requiredData.data[i].required;
    inputElement.id = moduleData.requiredData.data[i].id;
    inputElement.type=moduleData.requiredData.data[i].type;


    pElement.appendChild(textElement);

    div.appendChild(pElement)
    div.appendChild(inputElement)

    form.appendChild(div)


}

form.appendChild(button)

document.body.appendChild(form);




//Create necessary functions for page
function submit() {

let array = [];

for (let i = 0; i < moduleData.requiredData.data.length; i++) {
    let element = document.getElementById(moduleData.requiredData.data[i].id);

    array.push(element.value);

}

let valid = validate(array, moduleData)
if(valid){

fade()
setTimeout(function () {fade()}, 1750)
setTimeout(function () {

waiting = true;

for (let i = 0; i < moduleData.requiredData.data.length; i++) {
    let element = document.getElementById("div" + moduleData.requiredData.data[i].id);

    element.hidden = true;

}

button.hidden = true;

socket.emit("ready", array);

}, 100)

}else{
console.log(valid + " is not valid");

document.getElementById(valid).focus
alert("Field " + valid + " is not valid!");


}

return false;

}




//identify socket
socket.emit('identify', data.identification);


//socket events
socket.on('finish', function (arg) {
    console.log("The package has been installed successfully")
    finished = true;
})

socket.emit('runStart', function () {
    console.log("The package is starting")
})

socket.on('childStdout', function (arg) {
    console.log("Child stdout! " + String.fromCharCode.apply(null, new Int8Array(arg)))
})

socket.on('testInitiate', function (arg) {
console.log("Confirming test...")
    socket.emit('testConfirm')
})


setInterval(function () {

    if(!waiting) {

        paragraph.hidden = true;
        anim_holder.hidden = true;
        return;
    }

    paragraph.hidden = false;
    anim_holder.hidden = false;
    header.hidden = false;
    paragraph.innerHTML = random();

}, 3750)