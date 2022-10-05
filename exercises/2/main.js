

function run(array){
    console.log(array);
}

//Input is a string.
//Convert to number as required
let array = [];

for(i = 2; i < process.argv; i++) {
    array.push(parseInt(process.argv[i]));
}

run(array);