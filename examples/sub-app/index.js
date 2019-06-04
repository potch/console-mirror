const express = require('express');
const consoleMirror = require('../../index.js');

let app = express();

app.use('/console', consoleMirror());

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
      <iframe src="/console/"></iframe>
    </body>
  </html>`)
});

app.listen();

console.log('hey there');
 
console.log('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
