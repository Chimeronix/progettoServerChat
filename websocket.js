// dichiarazione e creazione delle variabili 
const WebSocketServer = require('ws');
// porta d'ascolto
let listeningPort = 8080;
const wss = new WebSocketServer.Server({ port: listeningPort });

let splitMessage;
let clientsList = [];
let messagesHistory = [];

let duplicated = false;
let messageBroadcast;
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
// quello che succede quando un client si connette al server
wss.on("connection", ws => {
    console.log("Nuovo client connesso al WebSocket. In attesa del login...");
    ws.send('Sei stato connesso al WebSocket.');
    ws.logged = false;
    // eseguo uno split del messaggio affinché si possa distinguere di quale messaggio si tratta:
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
                handleMessage(ws, splitMessage[1], splitMessage[2], splitMessage[3]);
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
        // invio in broadcast a chi ha effettuato il login la lista utenti connessi, sostituendo la "," con una "/"
        const userListMessage = `listautenti/${clientsList.join('/')}`;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocketServer.OPEN) {
                if (client.logged) {
                    client.send(userListMessage);
                }
            }
        });
    });
    // cosa succede se ho un errore
    ws.on("error", () => {
        console.error(`${RED}Errore WebSocket:${RESET}`, error);
    });
});

// funzione che gestisce il login 
function handleLogin(ws, username, password) {
    duplicated = false;
    found = false;
    // scorro il file csv e controllo se i dati inseriti sono corretti
    lines.forEach((line) => {
        // tramite trim elimino lo \r, che è presente alla fine di ogni riga dell'editor windows
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
    // controllo se un client si sta connettendo con dei dati
    // di un client il quale ha gia' effettuato il login
    for (let i = 0; i < clientsList.length; i++) {
        if (clientsList[i] == username && !duplicated) {
            duplicated = true;
        }
    }
    // se il client si sta connettendo per la prima volta
    // assegno id e lo inserisco nella lista utenti online
    // dopo di che invio la lista utenti aggiornata
    if (found && !duplicated) {
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
        return;
    } else {
        // se il login non va a successo la comunicazione si chiude ed invierà il messaggio "Errore"
        ws.logged = false;
        ws.send("Errore.");
        ws.close();
    }
}
// funzione per gestire i messaggi
function handleMessage(ws, id, ore, message) {
    // salvo il messaggio che arriva al server
    messageBroadcast = `messaggio/${id}/${ore}/${message}`;
    let [hours, minutes] = ore.split(":");
    // controllo la lunghezza della stringa che otterrò
    // questo perché l'ora che arriva, se avesse uno 
    // 0 come prima cifra delle ore e minuti,
    // verrebbe eliminato es. (18:2)
    if (hours.length == 1) {
        hours = `0${hours}`;
    }
    if (minutes.length == 1) {
        minutes = `0${minutes}`;
    }
    time = `${hours}:${minutes}`;
    // inserisco il valore corretto e lo invio a tutti i clienti che hanno
    // eseguito login
    messageBroadcast = `messaggio/${id}/${time}/${message}`;
    wss.clients.forEach(client => {
        if (client.logged) {
            client.send(messageBroadcast);
        }
    });
    // inserisco nell'array dello storico il messaggio mandato
    messagesHistory.push(messageBroadcast);
}
// funzione che gestisce lo storico
function handleStorico(ws, hourBegin, hourEnd) {
    let split;
    let hour;
    if (ws.logged) {
        // se lo storico è vuoto allora invio "vuoto"
        if (messagesHistory.length == 0) {
            ws.send("Storico vuoto");
        } else {
            // scorro l'array contenente i messaggi inviati dai clients
            // ogni volta prendendo in considerazione l'ora ed il minuto
            // del messaggio, e tramite un confronto dell'ora del messaggio 
            // con l'intervallo definito da hourBegin e hourEnd, mando
            // tutti i messaggi in quel periodo
            for (let i = 0; i < messagesHistory.length; i++) {
                split = messagesHistory[i].split("/");
                hour = split[2];
                if (hourBegin <= hour && hour <= hourEnd) {
                    ws.send(messagesHistory[i]);
                }
            }
        }
    }
}
console.log(`Il WebSocket è in ascolto nella porta ${listeningPort}.`);