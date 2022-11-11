const {spawn, fork} = require("child_process")
const fs = require("fs")
const sm = require("./socketManager")

let currentlyRunning = false;


function run(data){


    const {id, args} = data;

    let {modules} = require('./cache/cache.json');

            let module = modules[data.args[0] - 1]

            console.log("run")

            let ready = initiateRun(data, module)
            console.log("Is package ready? " + ready)
            if(!ready) return;

    debugger;

    const child = spawn("node", args, { cwd: "./exercise/"})

        child.stdout.on('data', function(data){
            sm.send(id, 'childStdout', data);
            })

        child.on("error", function(err){

            sm.send(id, 'childError', err)

        })

        child.stderr.on('data', function(data){
            sm.send(id, 'childStderr', data);
            })
        child.on('close', function(code){
            currentlyRunning = false;
            sm.finish(id);
            })
}



function initiateRun(data, module){



    //get the first user in the queue
    console.log("runInit")




        sm.send(data.id, "runInit")



        data.args.shift(); //remove package id
        data.args.unshift("main.js")

        let moduleFile = false;

        let returnValue = true;


    try{
        moduleFile = JSON.parse(fs.readFileSync("./exercise/module.json"))
        if(!moduleFile.id) throw new Error("Incorrect package")
        if(moduleFile.id != module.id) throw new Error("Incorrect package")
    }
    catch(err){

            console.log("Is not error " + !err)

            if(err){
               sm.send(data.id, "downloadStart")
               let out = fs.createWriteStream("./out.txt")
               const download = fork("./download.js", [module.url], {stdio: "ignore", detached: true})
               download.on("close", function() {sm.send(data.id, 'downloadFinish')})
               download.unref();
               returnValue = false;
            }





        }
        sm.send(data.id, "beginRun")
       
        return returnValue;
            };

            
            module.exports = {run}