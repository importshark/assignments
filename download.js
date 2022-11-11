var request = require('then-request');
const fs = require("fs")
var zipper = require('zip-local');
const sm = require("./sm/socketManager")

function run(url, socketId) {


    try{
        request("GET", url).done(function(res){

            const body = res.getBody()
    
            fs.writeFileSync("./exercise/exercise.zip", body)
    
            zipper.sync.unzip("./exercise/exercise.zip").save("./exercise");
        
    
        })
    }catch(err){
    sm.send(socketId, "downloadError", err)
    return fs.writeFileSync("./error.txt", err)

    }
    fs.writeFileSync("./error.txt", "No Error.")
    sm.send(socketId, "downloadFinish")
    


}

run(process.argv[2], process.argv[3])