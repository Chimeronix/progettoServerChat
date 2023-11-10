const WebSocketServer = require('ws');
let listeningPort = 8080;
let splitMessage;
let clientsList = [];
const fs = require("fs");
const path = "credenziali.csv";
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const wss = new WebSocketServer.Server({ port: listeningPort });

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

    ws.on("message", data => {
        let dataString = data.toString();
        splitMessage = dataString.split("/");
        const messageCommand = splitMessage[0];

        switch (messageCommand) {
            case "login":
                handleLogin(ws, splitMessage[1], splitMessage[2]);
                break;
            case "messaggio":
                handleMessage(ws, splitMessage[1]);
                break;
        }
    });

    ws.on("close", () => {
        console.log(`${YELLOW}Il client con ID [${ws.id}] si è disconnesso.${RESET}`);
        const index = clientsList.indexOf(ws.id);

        if (index !== -1) {
            clientsList.splice(index, 1);
        }
        console.log(`Clients connessi al momento: ${clientsList}`);
        const userListMessage = `listautenti/${clientsList.join('/')}`;

        wss.clients.forEach(client => {
            if (client.readyState === WebSocketServer.OPEN) {
                client.send(userListMessage);
            }
        });
    });

    ws.on("error", () => {
        console.error(`${RED}Errore WebSocket:${RESET}`, error);
    });
});


function handleLogin(ws, username, password) {
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
    if(found){
        ws.send("OK.");
        ws.id = ws.getUsername();
        console.log(`${GREEN}Un client ha effettuato correttamente il login, ho assegnato l'ID [${ws.id}].${RESET}`);
        clientsList.push(ws.id);
        console.log(`Clients connessi al momento: ${clientsList}.`);
        const userListMessage = `listautenti/${clientsList.join('/')}`;

        wss.clients.forEach(client => {
            if (client.readyState === WebSocketServer.OPEN) {
                client.send(userListMessage);
            }
        });
        return;
    } else {
        ws.send("Errore.");
        ws.close();
    }
}

function handleMessage(ws, message) {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const senderId = ws.id;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocketServer.OPEN) {
            client.send(`messaggio/${senderId}/${hour}:${min}/${message}`);
        }
    });
}

console.log(`Il WebSocket è in ascolto nella porta ${listeningPort}.`);