const fs = require('fs');
const {
    spawn,
    spawnSync,
    fork
} = require('child_process');
//const {spawnArgs, nodePath} = require('./loaderData.json')
const http = require('http');
const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const io = new Server(server);
var request = require('then-request');;
const extract = require('extract-zip')
const fetch = require('node-fetch');
const sm = require('./sm/socketManager')
let cacher = require('./cache/cache.js');
const events = require('events')

app.set('views', './assets/views');
app.set('view engine', 'pug')

let currentlyRunning = false;

async function download(url, dest) {
    const response = await fetch(url);
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        response.body.pipe(file);
        file.on('finish', function() {
            file.close();
            resolve();
        });
        file.on('error', function(err) {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}






async function runFirst(){


    //get the first user in the queue
        let {id, args} = sm.getFirst();

        args.unshift("main.js")


        sm.send(id, "runStart")

        const child = spawn("node", args, { cwd: "./exercise/"})

        child.stdout.on('data', function(data){
            sm.send(id, 'childStdout', data);
        })

        child.stderr.on('data', function(data){
                sm.send(id, 'childStderr', data);
            })
            child.on('close', function(code){
                currentlyRunning = false;
                sm.finish(id);
            })


}

app.get('/assignments/', async (req, res) => {



    const id = req.query.id
    const force = req.query.forceReCache



    let cached = cacher.isCached()

    if (force || !cacher.isCached()) {

        console.log("Caching data as forced")
        await cacher.download()


    }

    const cache = cacher.getCache()

    //array id is id - 1

    //assign data
    const data = cache.modules[id - 1]

    console.log("User connected.")




    return res.render('assignment', {
        data: {
            id: id,
            moduleData: data
        }
    })




})


async function install(packageId, id) {



    console.log('Initiating package download for ' + id + " . Package: " + packageId)




    await download("https://github.com/importshark/assignments/releases/download/publish/excersise-1.0.0.zip", "./exercise.zip")



    extract("./exercise.zip", {
        dir: `${__dirname}/exercise`
    })




}

io.on('connection', async (socket) => {


    console.log('a user connected at ' + socket.id);
    console.log("Passing to socketManager...")

    socket.emit("transfer_start")
    await sm.connect(socket)

});

app.get('/', async (req, res) => {


    const force = req.query.forceReCache

    console.log('force cache load: ' + force);

    console.log('is cache loaded: ' + cacher.isCached())

    if (force || !cacher.isCached()) {
        console.log("Recaching...")
        await cacher.download();
    }




    let data = cacher.getCache();

    //res.sendFile("html/index.html", {root: "."})
    res.status(200).render("index", {
        stuffs: data.modules
    })
})

app.get('/assets/js/index.js', (req, res) => {
    res.status(200).sendFile("/assets/js/index.js", {
        root: "."
    })
    //res.render("index", {data: 1})
})

app.get('/assets/js/assignment.js', (req, res) => {
    res.status(200).sendFile("/assets/js/assignment.js", {
        root: "."
    })
    //res.render("index", {data: 1})
})

app.get('/assets/js/functions.js', (req, res) => {
    res.status(200).sendFile("/assets/js/functions.js", {
        root: "."
    })
    //res.render("index", {data: 1})
})

app.get('/assets/css/assignment.css', (req, res) => {
    res.status(200).sendFile("/assets/css/assignment.css", {
        root: "."
    })
    //res.render("index", {data: 1})
})



app.get('/assets/images/favicons/favicon.ico', (req, res) => {
    res.status(200).sendFile("/assets/images/favicons/favicon.ico", {
        root: "."
    })
})

app.get('/assets/images/home.png', (req, res) => {
    res.status(200).sendFile("/assets/images/home.png", {
        root: "."
    })
})

app.get('/assets/images/favicon.ico', (req, res) => {
    res.status(200).sendFile("/assets/images/favicon.ico", {
        root: "."
    })
})

app.get('/assets/images/backgroundUpdate.png', (req, res) => {
    res.status(200).sendFile("/assets/images/backgroundUpdate.png", {
        root: "."
    })
})

server.listen(25565, function() {
    console.log("Loader web app is listening on port 3000.")

})

setInterval(() => {

   let data = sm.getFirst()

    if(!data) return
    if(data.id === currentlyRunning) return

    runFirst()

}, 5000)