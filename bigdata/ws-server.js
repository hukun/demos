var WebSocketServer = require('ws').Server
  , fs = require('fs')
  , wss = new WebSocketServer({port: 8090});

function isString(obj){
  return Object.prototype.toString.call(obj) == '[object String]';
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

var fileBuffer = fs.readFileSync('ws-client.html');

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    if ( isString(message) ){
      message = JSON.parse(message);
      if ( message.fileName != 'ws-client.html' ){
        return;
      }
      switch(message.cmd){
        case 1:
            ws.send(JSON.stringify({
              fileName: message.fileName,
              length: fileBuffer.length
            }));
          break;
        case 2:
          console.log('start', message.start, 'length', message.length);
          ws.send(fileBuffer.slice(message.start, message.end));
          break;
      }
    }
  });
});
