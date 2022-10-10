const fs = require('fs');
const {spawn, spawnSync} = require('child_process');
const {spawnArgs, nodePath} = require('./loaderData.json')
const express = require('express');

const app = express();
app.set('view engine', 'pug')

async function run (){


res.render('index', { title: 'Hey', message: 'Hello there!' })


if(!id){
console.error("[Loader] Please enter a valid exercise number!");
process.exit(1)
}


console.log("[Loader] Loading data...");

const exerciseData = require("../exercises/" + id + "/module.json");

console.log("[Loader] Data loaded.")



let args = ["/c", nodePath + "\\node.exe", `${exerciseData.path}\\${exerciseData.mainFile}`]

if (exerciseData.requiredData.required > 0){


    console.log(`[Loader] This program requires ${exerciseData.requiredData.required} extra piece(s) of information. Please enter them when prompted.`)
    for(i = 0; i < exerciseData.requiredData.required; i ++){
         const data = prompt("[Loader] " + exerciseData.requiredData.data[i].value);

         args.push(data)
    }
}


console.log("[Loader] Setup complete. Starting program...")
console.log("[Loader] Data that does not start with '[Loader]' is likely from the script.")

spawnArgs.cwd = exerciseData.path;

const child = spawnSync("cmd", args, spawnArgs)

console.log("[Loader] The child exited wtih code " + child.status)

console.log("[Loader] Exiting....")


app.listen(3000, function(){
console.log("Loader web app is listening on port 3000.)
})
}