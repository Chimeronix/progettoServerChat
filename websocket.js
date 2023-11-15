// variabili 
const WebSocketServer = require('ws');
let listeningPort = 8080;
const wss = new WebSocketServer.Server({ port: listeningPort });

let splitMessage;
let clientsList = [];
let messagesHistory = [];

let duplicated = false;

const fs = require("fs");
const path = "credenziali.csv";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";

// lettura del file csv e seguente chiamata della funzione
fs.readFile(path, "utf8", (err, data) => {
    if (err) {
        console.error("Error while reading:", err);
        return;
    }
    lines = data.split("\n");
}
);
wss.on("connection", ws => {
    console.log("Nuovo client connesso al WebSocket. In attesa del login...");

    ws.send('Sei stato connesso al WebSocket.');
    ws.logged = false;
    ws.on("message", data => {
        let dataString = data.toString();
        splitMessage = dataString.split("/");
        const splitCases = splitMessage[0];
        // gestione tipo di messaggio da parte del client con consecutiva chiamata alla rispettiva funzione
        switch (splitCases) {
            case "login":
                handleLogin(ws, splitMessage[1], splitMessage[2]);
                break;
            case "messaggio":
                handleMessage(ws, splitMessage[1]);
                break;
            case "storico":
                handleStorico(ws, splitMessage[1], splitMessage[2]);
        }
    });

    ws.on("close", () => {
        console.log(`${YELLOW}Il client con ID [${ws.id}] si è disconnesso.${RESET}`);
        // scorro tramite indexOf() la lista dei clients connessi
        const indexClientsList = clientsList.indexOf(ws.id);
        // se trova un'occorrenza mi rimuove l'elemento trovato nel posto in cui si trova l'indice
        if (indexClientsList !== -1) {
            clientsList.splice(indexClientsList, 1);
        }
        console.log(`Clients connessi al momento: ${clientsList}`);
        // mando in broadcast a chi ha effettuato il login la lista utenti connessi
        const userListMessage = `listautenti/${clientsList.join('/')}`;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocketServer.OPEN) {
                if (client.logged) {
                    client.send(userListMessage);
                }
            }
        });
    });

    ws.on("error", () => {
        console.error(`${RED}Errore WebSocket:${RESET}`, error);
    });
});


function handleLogin(ws, username, password) {
    duplicated = false;
    found = false;
    lines.forEach((line) => {
        line = line.trim();
        const [lineUsr, linePsw] = line.split(",");
        if (lineUsr == username && linePsw == password) {
            found = true;
            // funzione per determiare l'id, tramite username
            ws.getUsername = function () {
                function user() {
                    return username;
                }
                return user();
            };
        }
    });
    // 
    for(let i=0; i<clientsList.length;i++){
        if(clientsList[i] == username && !duplicated){
            duplicated = true;
        }
    }
    if(found && !duplicated){
        ws.logged = true;
        ws.send("OK.");
        ws.id = ws.getUsername();
        console.log(`${GREEN}Un client ha effettuato correttamente il login, ho assegnato l'ID [${ws.id}].${RESET}`);
        clientsList.push(ws.id);
        console.log(`Clients connessi al momento: ${clientsList}.`);
        const userListMessage = `listautenti/${clientsList.join('/')}`;
        wss.clients.forEach(client => {
            if (client.logged) {
                client.send(userListMessage);
            }
        });
        // scorro lista storico e invio i messaggi salvati nella lista
        if(messagesHistory.length==0){
            ws.send("storico vuoto");
        } else {
            for(let i=0; i<messagesHistory.length;i++){
                ws.send(messagesHistory[i]);
            }
        }
        return;
    } else {
        ws.logged = false;
        ws.send("Errore.");
        ws.close();
    }
}

function handleMessage(ws, message) {
    // dichiarazione variabili per formattare correttamente il messaggio da mandare ai clients
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const senderId = ws.id;
    const messageBroadcast = `messaggio/${senderId}/${hour}:${min}/${message}`;
    // mando in broadcast a chi ha effettuato il login il messaggio del client
    wss.clients.forEach(client => {
        if (client.logged) {
            client.send(messageBroadcast);
        }
    });
    // inserisco nell'array dello storico il messaggio mandato
    messagesHistory.push(messageBroadcast); // TODO da fixare orario 
}

console.log(`Il WebSocket è in ascolto nella porta ${listeningPort}.`);