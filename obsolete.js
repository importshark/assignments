// Welcome to obsolete.js, where I just put chunks of code that took me a while but I need to get rid of


function queueUpdate(){
console.log('queueUpdate');



    for(var [key, value] of clients) {

        if(value === "unknown") continue;

        let socket = value;



        console.log(key + " has a socket of " + value.id + ".");

            let queue = queues.get(key);

            queue.length > 0 ? console.log(key + ", associated with socket " + value.id + " has a queue of " + queue + ".") : console.log(key + ", associated with socket " + value.id + " has an empty queue.");

            for(var i = 0; i < queue.length; i++){

                let element = queue[i];
                if(element.arg){

                    console.log("Emit " + element.name + " on socket " + socket.id + " with arg " + element.arg)
                    socket.emit(element.name, element.arg);

                }
                else{

                    console.log("Emit " + element.name + " on socket " + socket.id )
                    socket.emit(element.name)
                }
            }

            clients.set(key, [])



    }
}

//New

