import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";
import { disconnect } from "process";

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", socket => {
    socket["nickname"] = "Anonymous";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname, roomName, done) => {
        (socket["nickname"] = nickname);
        socket.to(roomName).emit("welcome", nickname, countRoom(roomName));
        done();
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