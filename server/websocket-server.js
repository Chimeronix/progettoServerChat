// moduli
const WebSocketServer = require('ws');
let listeningPort = 8080;
let splitMessage;
let users;
let index=0;
// dati di test da cancellare
let usr = "ciao";
let psw = "123";

// creazione WebSocket
const wss = new WebSocketServer.Server({ port: listeningPort })
  
// creazione connessione WebSocket
wss.on("connection", ws => {
    console.log("Nuovo client connesso.");
 
    // messaggio da mandare al client
    ws.send('Sei stato connesso al WebSocket.');   
 
    // check dati login
    ws.on("message", data => {
        //           arr 1 | arr |2 arr 3
        //if(data == "login/pippo/lacoca"){
            let stringa = data.toString();
         splitMessage = stringa.split("/");
        if(usr == splitMessage[1] && psw == splitMessage[2]){
            users[index]=splitMessage[1];
            ws.send("OK.");
            index++;
            
        } else {
            ws.send("Errore.");
            ws.close();
        }
    });    
    // gestione arrivo messaggio client
    /*ws.on("message", data => {
        console.log(`Il client ha mandato al server: ${data}`)
    });*/
 
    // disconessione client
    ws.on("close", () => {
        console.log("Il client si è disconnesso!");
    });
    // gestione errore connessione client
    ws.onerror = function () {
        console.log("E' stato riscontrato un errore!")
    }
});
console.log("Il WebSocket è in ascolto nella porta " + listeningPort + ".");