throw new Error("IPC listener for socket")

const fs = require('fs');
const {spawn, spawnSync, fork} = require('child_process');
//const {spawnArgs, nodePath} = require('./loaderData.json')
const http = require('http');
const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var request = require('then-request');;
const extract = require('extract-zip')
const fetch = require('node-fetch');

const clients = new Map();

let queues = new Map();


function queueUpdate(){
console.log('queueUpdate');



    for(var [key, value] of clients) {

        if(value === "unknown") continue;

        let socket = value;



        console.log(key + " has a socket of " + value.id + ".");

            let queue = queues.get(key);

            queue.length > 0 ? console.log(key + " has a queue of " + queue + ".") : console.log(key + " has an empty queue.");

            for(var i = 0; i < queue.length; i++){

                let element = queue[i];
                if(element.arg){

                    console.log("Emit " + element.name + " on socket " + socket.id + " with arg " + element.arg)
                    socket.emit(element.name, element.arg);

                }
                else{

                    console.log("Emit " + element.name + " on socket " + socket.id )
                    socket.emit(element.name)
                }
            }

            clients.set(key, [])



    }
}

async function download(url, dest) {
    const response = await fetch(url);
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        response.body.pipe(file);
        file.on('finish', function () {
            file.close();
            resolve();
        });
        file.on('error', function (err) {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}


app.set('view engine', 'pug')

app.get('/', (req, res) => {
//res.sendFile("html/index.html", {root: "."})
res.status(200).render("index", {stuffs: [{name: 1, id: 1},{name: 2, id: 2},{name: 3, id: 3}]})
})

app.get('/assets/js/index.js', (req, res) => {
res.status(200).sendFile("/assets/js/index.js", {root: "."})
//res.render("index", {data: 1})
})

app.get('/assets/js/assignment.js', (req, res) => {
res.status(200).sendFile("/assets/js/assignment.js", {root: "."})
//res.render("index", {data: 1})
})

app.get('/assets/js/messages.js', (req, res) => {
res.status(200).sendFile("/assets/js/messages.js", {root: "."})
//res.render("index", {data: 1})
})

app.get('/assets/css/assignment.css', (req, res) => {
res.status(200).sendFile("/assets/css/assignment.css", {root: "."})
//res.render("index", {data: 1})
})



app.get('/assets/images/favicon.ico', (req, res) => {
res.status(200).sendFile("/assets/images/favicon.ico", {root: "."})
})

app.get('/assignments/', async (req, res) => {



    const id = req.query.id

    let cookie = req.cookies.id;

    let identifier = parseInt(cookie)


    let installed = true

    try{
    let data = JSON.parse(fs.readFileSync("./exercise/module.json"))
    }catch(e){
        installed = false
        console.log("Read/Parse failed with error: " + e)
    }
        console.log(installed)


        if(!identifier){

        identifier = Math.floor(Math.random() * 1000000)

        while(clients.has(identifier)) identifier = Math.floor(Math.random() * 1000000)

        res.cookie("id", identifier)

        }

        clients.set(identifier, "unknown")
        queues.set(identifier, []);

        if(!installed) await install(id, identifier)



            return res.render('assignment', {data: { id: id, identification: identifier} })


    


})


async function install(packageId, id){

console.log(queues)


    console.log('Downloading package ' + packageId)

    await download("https://github.com/importshark/assignments/releases/download/publish/excersise-1.0.0.zip", "./exercise.zip")

    console.log("Package download complete.")


    console.log("Unzipping...")


    extract("./exercise.zip", { dir: `${__dirname}/exercise` })

    console.log("Unzipped")

    let queue = queues.get(id)

    queue.push({name: "finished"})

    queues.set(id, queue);

    queueUpdate()

}

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('identify', (arg) => {
    console.log(clients)
                  console.log("Socket " + socket.id + "has identified as " + arg);
                    clients.set(arg, socket)
                    queueUpdate();
                });

    socket.on('redirect', (arg) => {
        socket.emit("html", fs.readFileSync("./html/assignment.html"));
    });
  console.log('a user connected at ' + socket.id);
});



server.listen(3000, function(){
console.log("Loader web app is listening on port 3000.")

})


