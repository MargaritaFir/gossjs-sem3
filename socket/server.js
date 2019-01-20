const express = require('express');
const path = require('path');
const app = express();
const clients = [];
const PORT = 1234;
const expressWs = require('express-ws')(app);

app
  .get('/', r => r.res.sendFile(path.join(__dirname+'/index.html')))
  .ws('/', WebSocket => {
    const id = (Math.round(Math.random() * 100));
    clients[id] = WebSocket;
    console.log(`Client "${id}" connected`);

    WebSocket
              .on('message', msg => {
                    Object.values(clients).forEach(client => client.send(msg));
                })
              .on('close', () => {
                    console.log(`Client "${id}" left`);
                    delete clients[id];
                })

  })

  .use(r => r
    .res
    .set({'Content-Type' : 'text/html; charset=utf-8'})
    .status(404)
    .end('<b>url does not exist!</b>'))
  .use( r => r
    .set({'Content-Type' : 'text/html; charset=utf-8'})
    .status(500)
    .end('<b>Этого не было!</b>'))
  .listen(process.env.port || PORT, () => console.log('OK!'));