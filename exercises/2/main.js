
function validate(array){
    if(array.length < 6) return true;
    //Iterate through the array and validate each element
    for(i = 0; i < array.length; i++){
        if(array[i] >= 25) return true;
    }
    return false;
}


function format(array){
    let data = [];
    let total = 0
    for(i = 0; i < array.length; i++){
        switch(i){
            case 0:
                data.push({day: "Monday", salary: array[i]})
                total += array[i]
            break;

            case 1:
                data.push({day: "Tuesday", salary: array[i]})
                total += array[i]
            break;

            case 2:
                data.push({day: "Wednesday", salary: array[i]})
                total += array[i]
            break;

            case 3:
                data.push({day: "Thursday", salary: array[i]})
                total += array[i]
            break;

            case 4:
                data.push({day: "Friday", salary: array[i]})
                total += array[i]
            break;

            case 5:
                data.push({day: "Saturday", salary: array[i]})
                total += array[i]
            break;

            case 6:
                data.push({day: "Sunday", salary: array[i]})
                total += array[i]
            break;

        }
    }
        data.push({day: "Total", salary: total})
        return data

}

function run(array){
    if(validate(array)) return console.log("There was an error interpreting the numbers. Please try again.")

    let object = [];
    let money = 0


    for(x = 0; x < array.length; ){

       money = 0

       for(y = 0; y < array[x]; y++){
            if(y > 7){
            money = money + 15
            }else if(y < 8){
            money = money + 10
            }
       }
       if(x > 4) money = money * 2
       object.push(money)

        x++;
        }


        formattedData = format(object)
        console.table(formattedData)

    }



//Input is a string.
//Convert to number as required
let array = [];

for(i = 2; i < process.argv.length; i++) {
    array.push(parseInt(process.argv[i]));
}

run(array);