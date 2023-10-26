// moduli
const WebSocketServer = require('ws');
let listeningPort = 8080;
// creazione WebSocket
const wss = new WebSocketServer.Server({ port: listeningPort })
 
// creazione connessione WebSocket
wss.on("connection", ws => {
    console.log("Nuovo client connesso");
 
    // messaggio da mandare al client
    ws.send('Sei connesso alla WebChat');
 
    // check dati login
    ws.on("message", data => {
        if(data == "login/pippo/lacoca")
        console.log(`Il client ha inviato i dati di login: ${data}`)
    });

    // gestione arrivo messaggio client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });
 
    // disconessione client
    ws.on("close", () => {
        console.log("Il client si è disconnesso!");
    });
    // gestione errore connessione client
    ws.onerror = function () {
        console.log("E' stato riscontrato un errore")
    }
});
console.log("Il WebSocket è in ascolto nella porta "+ listeningPort);