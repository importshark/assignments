//throw new Error("IPC listener for socket")

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

app.set('views','./assets/views');

const clients = new Map();

let queues = new Map();


let cacher = require('./cache/cache.js');


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

app.get('/', async (req, res) => {


const force = req.query.forceReCache

console.log('force cache load: ' + force);

console.log('is cache loaded: ' + cacher.isCached())

if(force || !cacher.isCached()) {
    console.log("Recaching...")
    await cacher.download();
}




let data = cacher.getCache();

//res.sendFile("html/index.html", {root: "."})
res.status(200).render("index", {stuffs: data.modules})
})

app.get('/assets/js/index.js', (req, res) => {
res.status(200).sendFile("/assets/js/index.js", {root: "."})
//res.render("index", {data: 1})
})

app.get('/assets/js/assignment.js', (req, res) => {
res.status(200).sendFile("/assets/js/assignment.js", {root: "."})
//res.render("index", {data: 1})
})

app.get('/assets/js/functions.js', (req, res) => {
res.status(200).sendFile("/assets/js/functions.js", {root: "."})
//res.render("index", {data: 1})
})

app.get('/assets/css/assignment.css', (req, res) => {
res.status(200).sendFile("/assets/css/assignment.css", {root: "."})
//res.render("index", {data: 1})
})



app.get('/assets/images/favicons/favicon.ico', (req, res) => {
res.status(200).sendFile("/assets/images/favicons/favicon.ico", {root: "."})
})
app.get('/assets/images/favicons/favicon.ico', (req, res) => {
res.status(200).sendFile("/assets/images/favicon.ico", {root: "."})
})

app.get('/assets/images/backgroundUpdate.png', (req, res) => {
res.status(200).sendFile("/assets/images/backgroundUpdate.png", {root: "."})
})

app.get('/assignments/', async (req, res) => {



    const id = req.query.id

    const force = req.query.forceReCache

    let cookie = req.cookies.id;

    cookie ? console.log("Identified user connected.") : console.log("Unidentified user connected.")

    let identifier = parseInt(cookie)


    let cached = cacher.isCached()

    if(force || !cacher.isCached()){

    console.log("Caching data as forced")
    await cacher.download()


    }

    const cache = cacher.getCache()

    //array id is id - 1

    //assign data
    const data = cache.modules[id - 1]


        if(!identifier){

        identifier = Math.floor(Math.random() * 1000000)

        while(clients.has(identifier)) identifier = Math.floor(Math.random() * 1000000)

        res.cookie("id", identifier)
        console.log("Identity " + identifier + " has been assigned to the unknown user")

        }

        console.log("A user has connected as " + identifier)







            return res.render('assignment', {data: { id: id, identification: identifier, moduleData: data} })


    


})


async function install(packageId, id){



    console.log('Initiating package download for ' + id + " . Package: " +  packageId)






    await download("https://github.com/importshark/assignments/releases/download/publish/excersise-1.0.0.zip", "./exercise.zip")



    extract("./exercise.zip", { dir: `${__dirname}/exercise` })


    let queue = queues.get(id)

    queue.push({name: "finished"})

    queues.set(id, queue);

    queueUpdate()
    console.log("Finished")

}

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('identify', (arg) => {
                  console.log("Socket " + socket.id + "has identified as " + arg);
                    clients.set(arg, socket)
                });

    socket.on('redirect', (arg) => {
        socket.emit("html", fs.readFileSync("./assets/html/assignment.html"));
    });
  console.log('a user connected at ' + socket.id);
});



server.listen(3000, function(){
console.log("Loader web app is listening on port 3000.")

})


