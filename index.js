const http = require('http');
const express = require('express');
const ws = require('ws');

const app = express();

const server = http.createServer(app);
const wss = new ws.Server({ server });

const clients = new Set();

function hook(obj, method) {
  return function (string, encoding, fd) {
    buffer += string;
    method.apply(obj, Array.from(arguments));
    clients.forEach(client => {
      try {
        client.send(string);
      } catch (e) {}
    });
  }
}

let buffer = '';
let oldOut = process.stdout.write.bind(process.stdout);
process.stdout.write = hook(process.stdout, process.stdout.write);
process.stderr.write = hook(process.stderr, process.stderr.write);

wss.on('connection', function connection(ws) {
  clients.add(ws);
  ws.on('message', function incoming(message) {});
  ws.send(buffer);
});

app.get('/console-mirror/client.js', (req, res) => {
  res.type('js');
  res.sendFile(__dirname + '/client.js');
});

app.get('/console-mirror/xterm.js', (req, res) => {
  res.type('js');
  res.sendFile(__dirname + '/node_modules/xterm/dist/xterm.js');
});

app.get('/console-mirror/xterm.css', (req, res) => {
  res.type('css');
  res.sendFile(__dirname + '/node_modules/xterm/dist/xterm.css');
});

app.get('/', function(req, res) {
  res.type('html');
  res.sendFile(__dirname + '/index.html');
});

let port = process.env.PORT || 8080;
const listener = server.listen(port, function() {
  oldOut(`log mirror listening on port ${port}\n`);
});

