const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNickNameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
    document.querySelector("h2").textContent = input.value;
    room.querySelector("#name").hidden = true;
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.textContent = `Room Name: ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nickNameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nickNameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left ㅠㅠ!`);
});

socket.on("new_message", addMessage);
// websocket 사용 시
// const messageList = document.querySelector('ul');
// const nickForm = document.querySelector('#nick');
// const messageForm = document.querySelector('#message');
// const h2 = document.querySelector('h2');

// function makeMessage(type, payload) {
//     const msg = { type, payload };
//     return JSON.stringify(msg);
// }

// const url = window.location.host
// const socket = new WebSocket(`ws://${url}`);

// function handleOpen() {
//     console.log('Connected to Server 😀');
// }

// socket.addEventListener('open', handleOpen);

// socket.addEventListener('message', (message) => {
//     const li = document.createElement('li');
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener('close', () => {
//     console.log('Disconnected from Server ❌');
// });

// function handleSubmit(event) {
//     event.preventDefault();
//     const input = messageForm.querySelector('input');
//     socket.send(makeMessage('new_message', input.value));
//     const li = document.createElement('li');
//     li.innerText = `You: ${input.value}`;
//     messageList.append(li);
//     input.value = '';
// }

// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector('input');
//     socket.send(makeMessage('nickname', input.value));
//     h2.textContent = input.value;
//     input.value = '';
// }

// messageForm.addEventListener('submit', handleSubmit);
// nickForm.addEventListener('submit', handleNickSubmit);