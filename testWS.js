const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

var wsArr = [];
wss.on("connection", function connection(ws) {
  wsArr.push(ws);
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    wsArr.forEach(element => {
      element.send(message);
    });
  });

  ws.send("OK");
});
