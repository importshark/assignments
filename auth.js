const tokenmap = new Map();
//Identify the user asscociated to the token
const idmap = new Map();
tokenmap.set("dummy", "exp")
idmap.set("dummy", "854887118940667924")

module.exports = {
    generate: function(id){
        //Generate a random token.
        let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log("TOKENIZER: Generated token: " + token);
        //Generate a expiration timestamp thirty minutes from now.
        let expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 30);
        //Add the token to the map.
        tokenmap.set(token, expiration);
        idmap.set(token, id)
        //Return the token.
        return token;
    },
    check: function(token){
        //Check if the token is valid.
        if(tokenmap.get(token)){
            console.log("TOKENIZER: " + token + " is valid");
            return idmap.get(token);
        }else{
            console.log("TOKENIZER: " + token + "  is invalid");
            return false;
        }
    }

}
