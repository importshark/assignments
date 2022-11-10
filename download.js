var request = require('then-request');
const fs = require("fs")
var zipper = require('zip-local');
const sm = require("./sm/socketManager")

function run(url) {



    request("GET", url).done(function(res){

        const body = res.getBody()

        fs.writeFileSync("./exercise/exercise.zip", body)

        zipper.sync.unzip("./exercise/exercise.zip").save("./exercise");
    

    })


}

run(process.argv[2])