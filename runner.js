const {spawn, fork} = require("child_process")
const fs = require("fs")
const sm = require("./sm/socketManager")

let currentlyRunning = false;

function test(module){
    try{
        let moduleFile = JSON.parse(fs.readFileSync("./exercise/module.json"))
        if(!moduleFile.id) throw new Error("Incorrect package")
        if(moduleFile.id != module.id) throw new Error("Incorrect package")
        }catch(err){
                return err;
            }
            return "continue";
}

function run(data){


    const {id, args} = data;

    let {modules} = require('./cache/cache.json');

            let module = modules[data.args[0] - 1]

            console.log(module)

            let ready = initiateRun(data, module)
            if(!ready) return;



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



async function initiateRun(data, module){



    //get the first user in the queue
    console.log("run")




        sm.send(data.id, "runInit")



        data.args.shift(); //remove package id
        data.args.unshift("main.js")

        let moduleFile = false;




    try{
        moduleFile = JSON.parse(fs.readFileSync("./exercise/module.json"))
        console.log(!moduleFile.id)
        if(!moduleFile.id) throw new Error("Incorrect package")
        if(moduleFile.id != module.id) throw new Error("Incorrect package")
    }
    catch(err){

            console.log(err)

            if(err){
               sm.send(data.id, "downloadStart")
               let out = fs.createWriteStream("./out.txt")
               const download = fork("./download.js", [module.url], {stdio: "ignore", detached: true})
               download.on("close", function() {sm.send(data.id, 'downloadFinish')})
               download.unref();
               return false;
            }





        }
        sm.send(data.id, "beginRun")
        return true;

            };

            
            module.exports = {run}