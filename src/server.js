import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() => {
            done("hello from BE");
        }, 1000);
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

// websocket 사용 시
// const wss = new WebSocket.Server({ server });

// function onSocketClose() {
//     console.log('Disconnected from the Browser ❌');
// }

// const sockets = [];

// wss.on('connection', (socket) => {
//     sockets.push(socket);
//     socket['nickname'] = 'Anon'
//     console.log('Connected to Browser 😀');
//     socket.on('close', onSocketClose);
//     socket.on('message', (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type) {
//             case 'new_message':
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload.toString('utf8')}`));
//                 break;
//             case 'nickname':
//                 socket['nickname'] = message.payload.toString('utf8');
//                 break;
//         }
//     });
// });