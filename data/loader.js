var prompt = require('prompt');
const fs = require('fs');
const {spawn} = require('child_process');
const {spawnArgs, nodePath} = require('./loaderData.json')

  //
  // Start the prompt
  //

async function run() {
prompt.start();



const {id} = await prompt.get(['integer']);

if(!id){
console.error("[Loader] Please enter a valid exercise number!");
process.exit(1)
}

console.log("[Loader] Loading data...");

const exerciseData = require("../exercises/" + id + "/module.json");

console.log("[Loader] Data loaded.")

spawnArgs.cwd = exerciseData.path;


let args = []

if (exerciseData.requiredData.required > 0){

    let prop = {
                  name: '',
                  message: ''
                };

    console.log(`This program requires ${exerciseData.requiredData.required} extra pieces of information. Please enter them when prompted.`)
    for(let i = 0; i < exerciseData.requiredData.data; i++) {
        prop.name = exerciseData.requiredData.data[i].name;
        prop.message = exerciseData.requiredData.data[i].message;

        let data = await prompt.get(['integer'])[prop.name];

        args.push(data)

    }
}

console.log("[Loader] Setup complete. Starting program...")
console.log("[Loader] Data that does not start with '[Loader]' is likely from the script.")


const child = spawn("", args, spawnArgs)



console.log("The program has exited with code " + code);
console.log("Loader exiting...");

}
run()