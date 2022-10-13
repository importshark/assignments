const fs = require('fs');
const {spawn, spawnSync, fork} = require('child_process');
//const {spawnArgs, nodePath} = require('./loaderData.json')
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var request = require('then-request');;
const extract = require('extract-zip')
const fetch = require('node-fetch');



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

    let installed = false

    try{
    let data = JSON.parse(fs.readFileSync("./exercise/module.json"))
    if(data.id == id) installed = true
    }catch(e){
        console.log("Read/Parse failed with error: " + e)
    }

    




    return res.render('assignment', {reqData: [], id})
})


async function install(id){




    console.log('Downloading package ' + id)

    await download("https://github.com/importshark/assignments/releases/download/publish/excersise-1.0.0.zip", "./exercise.zip")

    console.log("Package download complete.")


    console.log("Unzipping...")


    extract("./exercise.zip", { dir: `${__dirname}/exercise` })

    console.log(console.log("Unzipped"))
}

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('data', (arg) => {
              console.log(arg);
            });
    socket.on('redirect', (arg) => {
        socket.emit("html", fs.readFileSync("./html/assignment.html"));
    });
  console.log('a user connected at ' + socket.id);
});



server.listen(3000, function(){
console.log("Loader web app is listening on port 3000.")

})
