

function calculateDots (side){
    let dots = 0
    for(i = 1; i < side + 1; i++){
        dots = dots + i
    }
    return dots
}
//Incoming data will be type string.
let dots = parseInt(process.argv[2])
console.log("Initializing.")
console.log("Dots:" + calculateDots(dots))