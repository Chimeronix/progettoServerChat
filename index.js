// moduli
const WebSocketServer = require('ws');
let listeningPort = 8080;
let roomcode = 10;
let arrayUsers;
// creazione WebSocket
const wss = new WebSocketServer.Server({ port: listeningPort })
  
// creazione connessione WebSocket
wss.on("connection", ws => {
    console.log("Nuovo client connesso");
 
    // messaggio da mandare al client
    ws.send('Sei stato connesso al WebSocket');   
 
    // check dati login
    ws.on("message", data => {
        //           arr 1 | arr |2 arr 3
        //if(data == "login/pippo/lacoca"){
            let stringa= data.toString;
            console.log(stringa);
            arrayUsers = stringa.split("/");
            console.log(arrayUsers[2]);
            if(roomcode == arrayUsers[2]){
            console.log(`Il client ha inviato i seguenti dati: Username: ${arrayUsers[1]} Codice stanza: ${arrayUsers[2]}.`);
        } else {
            console.log("Il client ha inserito un codice stanza errato.");
            ws.send("Sei stato disconesso dal WebSocket.")
            ws.close();
        }
    });
    // TODO -------- da term
    /*ws.on("message", data => {
        console.log(data);
        let array = data.split("/");
        let login = array[0];
        let nome = array[1];
        let password = array[2];
        console.log(login+" "+ nome +" "+password);
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