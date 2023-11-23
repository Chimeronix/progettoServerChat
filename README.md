# *Server Redemption* 
## WebSocket per Chat - Guida all'Uso


Il nostro server WebSocket per la chat offre una solida infrastruttura per consentire la comunicazione in tempo reale tra client. Di seguito è descritto il funzionamento generale del server.

## Architettura del Server

Il server è implementato utilizzando Node.js e sfrutta la libreria `websocket` per gestire le connessioni WebSocket. L'architettura del server si basa su eventi, consentendo una gestione efficiente delle richieste in arrivo.

## Struttura del Codice

Il progetto è organizzato nei seguenti moduli principali:

- **`websocket.js`**: Gestisce il funzionamento del server, nel quale viene specificata la porta di ascolto, il protocollo utilizzato e la gestione delle seguenti situazioni: "login", "messaggio", "storico".
- **`credenziali.csv`**: Gestisce il login al server, con l'insieme di nomi e password all'interno di un file CSV.
- **`client.html`**: Contiene il client che abbiamo usato per eseguire dei test sul nostro server. Può essere usato per usufruire dei servizi di chat.

## Inizializzazione del Server

1. **Clonare il Repository**: Clona il repository del progetto utilizzando il comando:
    ```bash
    git clone https://github.com/Chimeronix/progettoServerChat.git
    ```

2. **Installare le Dipendenze**: Installa NodeJs e tutte le dipendenze con:
    ```bash
    npm install
    ```

3. **Configurare il Server**: Molto importante che si modifichi l'indirizzo IP (e se necessario anche la porta) con cui si vuole dialogare.

4. **Avviare il Server**: Esegui il server con il comando in console:
    ```bash
    node .\websocket.js
    ```

## Gestione delle Connessioni WebSocket

1. **Connessione Iniziale**: Quando un client si connette al server via WebSocket, viene gestito in `websocket.js`. Grazie ad una lista, potrò capire chi è connesso al mio server, ed ogni volta che il login avverà in maniera corretta, aggiungerò quello specifico utente alla **listautenti\**.

2. **Gestione della Chat**: Una volta connesso, il server dovrà indirizzare il tipo di comunicazione
* per esempio (login, messaggio, storico porteranno a 3 funzioni diverse).

3. **Scambio di Messaggi**: I messaggi tra i client vengono scambiati attraverso il protocollo WebSocket. Il server gestisce la ricezione e l'inoltro dei messaggi in tempo reale, in broadcast, a tutti i clienti loggati.

4. **Disconnessione Utente**: Quando un utente si disconnette, il server gestisce l'evento di chiusura della connessione e notifica gli altri utenti della disconnessione tramite un messaggio.
5. 
6. **Gestione Storico** : A partire da un intervallo da ora ad ora, che il client mi manderà, potrò mandare tutta la lista dei messaggi appartenente a quello specifico periodo.

# Creatori del progetto

### Creatori del progetto:

- **Alessandro Amantini**
  - GitHub: [github.com/amantini](https://github.com/amantini)

- **Alexandro Brugnoni**
  - GitHub: [https://github.com/Chimeronix](https://github.com/Chimeronix)
