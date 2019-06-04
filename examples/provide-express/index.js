const express = require('express');

let app = express();

app.get('/', (req, res) => {
  res.end(`<html>
    <head>
      <style>
        iframe {
          width: 640px;
          height: 480px;
        }
      </style>
    </head>
    <body>
      <h1>Test</h1>
      <iframe src="/console"></iframe>
    </body>
  </html>`);
});

require('../../index.js')({ app, clientPath: 'console' }).listen();

console.log('hey there');

console.log('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
