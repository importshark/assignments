//Nuke script if is iframe
if ( window.location !== window.parent.location ) {
  throw new Error("This script is stopping due to being run in an iframe.")
}

//INITIALIZE VARS
let socket = io();
let waiting = false;
let doRandom = false;
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
let number = 1;





//document vars
const dataElement = document.getElementById('data')
const home = document.getElementById('homeBtn')
const consoleArea = document.getElementById('console')
let consoleDiv = document.getElementById('consoleDiv')
const paragraph = document.getElementById('p');
const header = document.getElementById('header');
const anim_holder = document.getElementById('animation_holder');
const description = document.getElementById('description');

//interpret vars, if required
const data = JSON.parse(dataElement.value);
const {moduleData} = data;

let array = [moduleData.id];

//debug variables
console.log(data)

//initialize document state
paragraph.hidden = true;
header.hidden = true;
anim_holder.hidden = true;
home.hidden = true;
consoleDiv.hidden = true;
description.innerHTML = moduleData.description

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


function getData(){
    array = [moduleData.id]
    console.log("I am getting the data!")
    for (let i = 0; i < moduleData.requiredData.data.length; i++) {
        let element = document.getElementById(moduleData.requiredData.data[i].id);
    
        array.push(element.value);
    
    }

}

//Create necessary functions for page
function submit() {

    getData()




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

console.log("I am ready!")
socket.emit("ready", array);

}, 100)

}else{
console.log(valid + " is not valid");

document.getElementById(valid).focus
alert("Field " + valid + " is not valid!");


}

return false;

}





//socket events
socket.on('queueUpdate', function(arg){
    header.innerHTML = `You are #${arg} in the queue.`
    doRandom = false;
    if(arg == 0) paragraph.innerHTML = "Loading package..."
})

socket.on('finish', function (arg) {
    console.log("The package has been installed successfully")
    finished = true;
    doRandom = true;
})

socket.on("childError", function(err){

    console.error(err)
    
    })

socket.on("downloadStart", function(){

    console.log("download has begun.")
    paragraph.innerHTML = "Download has started"
        
    })

socket.on("downloadError", function(err){

    console.log("download has errored with err " + err + " .")
            
})

socket.on("downloadFinish", function(){

            console.log("download has finished.")

            console.log(array)
            
            
            
            socket.emit("ready", array);
            })

socket.on('close', function (arg) {
    console.log("Child closed.")
    finished = true;
    doRandom = false;


    socket.close();

    header.innerHTML = "The script has finished running. To restart or run another script, please click below."

    home.hidden = false;

})


socket.on('runInit', function () {
    paragraph.innerHTML = "Checking to make sure the package is happy...."
    consoleDiv.hidden = false;
})

function createRow(data){

    const row = document.createElement("tr")
    const numberHolder = document.createElement("td")
    const num = document.createTextNode(number)
    numberHolder.appendChild(num)

    const textHolder = document.createElement("td")
    const text = document.createTextNode(data)
    textHolder.appendChild(text)

    row.appendChild(numberHolder)
    row.appendChild(textHolder)

    return row;

}

socket.on('childStdout', function (arg) {

    let data = String.fromCharCode.apply(null, new Int8Array(arg))
    console.log("Child stdout! " + data)
    
    consoleArea.appendChild(createRow(data))
    number ++;
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
    if(doRandom) paragraph.innerHTML = random();

}, 3750)