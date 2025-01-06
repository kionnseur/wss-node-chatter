const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const helmet = require('helmet');
const escapeHtml = require('escape-html');

const app = express();

// Charger les certificats SSL
const server = https.createServer({
    key: fs.readFileSync('172.20.49.33-key.pem'),
    cert: fs.readFileSync('172.20.49.33.pem')
}, app);

const wss = new WebSocket.Server({ server });

app.use(helmet()); // Sécurise l'application avec des en-têtes HTTP

// Configuration de la CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "wss://172.20.49.33:8080"], 
    },
}));

app.use(express.static('public')); 

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const safeMessage = escapeHtml(message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(safeMessage);
            }
        });
    });
});

server.listen(8080, () => {
    console.log('Server is listening on https://172.20.49.33:8080/');
});