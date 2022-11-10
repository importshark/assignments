const fetch = require('node-fetch');
const fs = require('fs');


async function download(url, dest) {
    const response = await fetch("https://github.com/importshark/assignments/releases/download/pre-alpha/modules.json");
    const file = fs.createWriteStream("./cache/cache.json");
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

function isCached(){
    return fs.existsSync("./cache/cache.json")
}

function getCache(){
    return JSON.parse(fs.readFileSync("./cache/cache.json"))
}

module.exports = {
    download,
    isCached,
    getCache

}


