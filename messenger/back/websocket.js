// WebSocket handling in a separate file (websocket.js)
const WebSocket = require('ws');

const handleWebSocketConnections = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket Client Connected');

    ws.on('close', () => {
      console.log('WebSocket Client Disconnected');
    });
  });
};

module.exports = handleWebSocketConnections;
