/* global Terminal */

const term = new Terminal({ convertEol: true });

term.open(document.getElementById("terminal"));
term.resize(80, 40);

function resize() {
  let measure = document.querySelector(".xterm-char-measure-element");
  let termEl = document.querySelector("#terminal");
  let charWidth = measure.offsetWidth;
  let charHeight = measure.offsetHeight;
  term.resize(
    ((termEl.offsetWidth / charWidth) | 0) - 1,
    (termEl.offsetHeight / charHeight) | 0
  );
}

resize();

let resizeTimeout;
window.addEventListener("resize", function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 1000);
});

function listen(backoff = 100) {
  if (backoff > 64000) {
    backoff = 64000;
  }
  let socket;
  if (window.location.protocol === 'http:')  {
    socket = new WebSocket(window.location.origin.replace(/^http/, "ws"));
  } else if (window.location.protocol === 'https:') {
    socket = new WebSocket(window.location.origin.replace(/^https/, "wss"));
  }
  let firstMessage = true;
  socket.addEventListener("open", function(event) {
    socket.send("hello");
    setInterval(function() {
      socket.send("ping");
    }, 10000);
  });
  socket.addEventListener("message", function(event) {
    if (firstMessage) {
      term.clear();
    }
    term.write(event.data);
    firstMessage = false;
  });
  socket.addEventListener("close", function() {
    setTimeout(function() {
      listen(backoff * 2);
    }, backoff);
  });
}

listen();
