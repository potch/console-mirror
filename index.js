const http = require('http');
const express = require('express');
const ws = require('ws');

exports = module.exports = function ({ clientPath = '', app } = {}) {
  // was an external app passed?
  if (!app) {
    app = express();
  }

  const clients = new Set();
  const cwd = process.cwd();

  let buffer = '';
  let oldOut = process.stdout.write.bind(process.stdout);
  process.stdout.write = hook(process.stdout, process.stdout.write);
  process.stderr.write = hook(process.stderr, process.stderr.write);

  function hook(obj, method) {
    return function (string, encoding, fd) {
      buffer += string;
      method.apply(obj, Array.from(arguments));
      clients.forEach(client => {
        try {
          client.send(string);
        } catch (e) { }
      });
    }
  }

  function hookServer(app) {
    if (hookedApp) {
      hookedApp.listen = oldListen;
    }
    hookedApp = app;

    oldListen = app.listen.bind(app);

    app.on('mount', parent => hookServer(parent));

    app.listen = function ([port = 8080, ...args] = []) {
      let server = oldListen(port, ...args);

      const wss = new ws.Server({ server });

      wss.on('connection', function connection(ws) {
        clients.add(ws);
        ws.on('message', function incoming(message) { });
        ws.send(buffer);
      });
    };
  }

  app.get('/client.js', (req, res) => {
    res.type('js');
    res.sendFile(__dirname + '/client.js');
  });

  app.get('/xterm.js', (req, res) => {
    res.type('js');
    res.sendFile(cwd + '/node_modules/xterm/dist/xterm.js');
  });

  app.get('/xterm.css', (req, res) => {
    res.type('css');
    res.sendFile(cwd + '/node_modules/xterm/dist/xterm.css');
  });

  app.get(`/${clientPath}`, function (req, res) {
    res.type('html');
    res.sendFile(__dirname + '/index.html');
  });

  let oldListen;
  let hookedApp;

  hookServer(app);

  return app;
};


