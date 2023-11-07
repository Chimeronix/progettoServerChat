// moduli
const WebSocketServer = require('ws');
let listeningPort = 8080;
let splitMessage;
// dati di test da cancellare
let usr = "ciao";
let psw = "123";


// creazione WebSocket
const wss = new WebSocketServer.Server({ port: listeningPort });
wss.getUsername = function () {
    function user() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return user();
};
// creazione connessione WebSocket
wss.on("connection", ws => {
    console.log("Nuovo client connesso.");
 
    // messaggio da mandare al client
    ws.send('Sei stato connesso al WebSocket.');   
        
    // check dati login
    ws.on("message", data => {
        let dataString = data.toString();
        splitMessage = dataString.split("/");
        let username = splitMessage[1];
        let password = splitMessage[2];
        if(usr == username && psw == password){
            wss.getUsername = function () {
                function user() {
                    return username;
                }
                return user();
            };
            ws.send("OK.");
            ws.id = wss.getUsername();
            console.log(`Un client ha effettuato correttamente il login, ho assegnato l'ID ${ws.id}.`);
            //index++;
            ws.send("Errore.");
            ws.close();
        }
    });    
    // disconessione client
    ws.on("close", () => {
        console.log(`Un client con id ${ws.id} si è disconnesso.`);
    });
    // gestione errore connessione client
    ws.onerror = function () {
        console.log("E' stato riscontrato un errore!")
    }
});
console.log("Il WebSocket è in ascolto nella porta " + listeningPort + ".");