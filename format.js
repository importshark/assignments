const fs = require('fs');

let data = fs.readFileSync("./modules.json")

fs.writeFileSync("./modules.json", JSON.stringify(JSON.parse(data), undefined, 2));

console.log("Formatted.")